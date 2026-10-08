const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

// Récupérer tous les livres
router.get('/', bookCtrl.getAllBooks);

// Récupérer les livres les mieux notés
router.get('/bestrating', bookCtrl.getBestRatedBooks);

// Récupérer un livre précis
router.get('/:id', bookCtrl.getOneBook);

// Ajouter un livre
router.post('/', auth, multer, bookCtrl.createBook);

// Supprimer un livre
router.delete('/:id', auth, bookCtrl.deleteBook);

// Modifier un livre
router.put('/:id', auth, multer, bookCtrl.modifyBook);

// Noter un livre
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;