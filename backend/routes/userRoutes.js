const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AuthController');

router.post('/register', adminController.registerAdmin);
router.get('/verify/:token', adminController.verifyEmail);
router.post('/login', adminController.loginAdmin);
router.post('/forgot-password', adminController.forgotPassword);
router.put('/reset-password/:token', adminController.resetPassword);

module.exports = router;
