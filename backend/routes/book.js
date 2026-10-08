const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

// Récupérer tous les livres
router.get('/', bookCtrl.getAllBooks);

// Récupérer un livre précis
router.get('/:id', bookCtrl.getOneBook);

// Ajouter un livre
router.post('/', auth, multer, bookCtrl.createBook);

// Supprimer un livre
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;