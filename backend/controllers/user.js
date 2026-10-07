const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.signup = (req, res, next) => {
  console.log('Requête signup reçue :', req.body.email);

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => {
          console.error('Erreur sauvegarde utilisateur :', error);
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      console.error('Erreur bcrypt :', error);
      res.status(500).json({ error });
    });
};