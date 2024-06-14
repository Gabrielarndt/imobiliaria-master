// routes/favoritRoutes.js

const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite } = require('../controllers/favoritoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addFavorite);
router.post('/remove', authMiddleware, removeFavorite);
router.get('/', authMiddleware, listFavorites);

module.exports = router;
