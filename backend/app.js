const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

// Permet de lire le JSON envoyé dans les requêtes
app.use(express.json());

// Gestion des CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes d'authentification
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;