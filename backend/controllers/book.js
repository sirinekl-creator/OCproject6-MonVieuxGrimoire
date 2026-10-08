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

exports.modifyBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: 'Livre introuvable'
        });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({
          message: 'Modification non autorisée'
        });
      }

      const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          }
        : { ...req.body };

      delete bookObject._id;
      delete bookObject.userId;
      delete bookObject.ratings;
      delete bookObject.averageRating;

    return Book.updateOne(
  { _id: req.params.id, userId: req.auth.userId },
  { $set: bookObject },
  { runValidators: true }
)
  .then((result) => {
    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Livre introuvable'
      });
    }

    if (req.file && book.imageUrl) {
      const oldFilename = path.basename(
        new URL(book.imageUrl).pathname
      );

      const oldImagePath = path.join(
        __dirname,
        '..',
        'images',
        oldFilename
      );

      fs.unlink(oldImagePath, (error) => {
        if (error && error.code !== 'ENOENT') {
          console.error(
            'Erreur lors de la suppression de l’ancienne image :',
            error
          );
        }
      });
    }

    return res.status(200).json({
      message: 'Livre modifié !'
    });
  });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = async (req, res) => {
  try {
    const { userId, rating } = req.body;

    if (userId !== req.auth.userId) {
      return res.status(403).json({
        message: 'Utilisateur non autorisé'
      });
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({
        message: 'La note doit être un entier entre 0 et 5'
      });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: 'Livre introuvable'
      });
    }

    const alreadyRated = book.ratings.some(
      (item) => item.userId === req.auth.userId
    );

    if (alreadyRated) {
      return res.status(400).json({
        message: 'Vous avez déjà noté ce livre'
      });
    }

    book.ratings.push({
      userId: req.auth.userId,
      grade: rating
    });

    const total = book.ratings.reduce(
      (sum, item) => sum + item.grade,
      0
    );

    book.averageRating = total / book.ratings.length;

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error });
  }
};