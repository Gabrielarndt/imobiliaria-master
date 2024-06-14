// authRouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('/cadastrar', authController.registerUser);
router.post('/login', authController.loginUser);

router.get('/usuario', authenticateJWT, (req, res) => {
    res.json({ user: req.user });
});

router.put('/usuario', authenticateJWT, authController.updateUser);


module.exports = router;

