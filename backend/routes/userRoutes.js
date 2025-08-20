const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AuthController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/register', adminController.registerAdmin);
router.get('/verify/:token', adminController.verifyEmail);
router.post('/login', adminController.loginAdmin);
router.post('/forgot-password', adminController.forgotPassword);
router.put('/reset-password/:token', adminController.resetPassword);
router.get('/check', protectAdmin, adminController.checkAuth);

module.exports = router;
