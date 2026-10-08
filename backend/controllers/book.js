const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: 'Livre introuvable'
        });
      }

      res.status(200).json(book);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject.userId;

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      ratings: [],
      averageRating: 0
    });

    book.save()
      .then(() => res.status(201).json({
        message: 'Livre enregistré !'
      }))
      .catch((error) => res.status(400).json({ error }));

  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.deleteBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: 'Livre introuvable'
        });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({
          message: 'Vous ne pouvez pas supprimer ce livre'
        });
      }

      const filename = path.basename(new URL(book.imageUrl).pathname);
      const imagePath = path.join(__dirname, '..', 'images', filename);

      return Book.deleteOne({
        _id: book._id,
        userId: req.auth.userId
      })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.status(404).json({
              message: 'Livre introuvable'
            });
          }

          fs.unlink(imagePath, (error) => {
            if (error && error.code !== 'ENOENT') {
              console.error(
                'Erreur lors de la suppression de l’image :',
                error
              );
            }
          });

          return res.status(200).json({
            message: 'Livre supprimé !'
          });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};