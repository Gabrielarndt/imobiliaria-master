// routes/protectedRoutes.js

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');

// Rota protegida que requer autenticação
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Protected route accessed successfully', user: req.user });
});

module.exports = router;
