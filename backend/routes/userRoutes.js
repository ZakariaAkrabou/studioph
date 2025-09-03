const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AuthController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail
} = require('../validators/authValidators');

router.post('/register', validateRegister, handleValidationErrors, adminController.registerAdmin);
router.get('/verify/:token', validateVerifyEmail, handleValidationErrors, adminController.verifyEmail);
router.post('/login', validateLogin, handleValidationErrors, adminController.loginAdmin);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, adminController.forgotPassword);
router.put('/reset-password/:token', validateResetPassword, handleValidationErrors, adminController.resetPassword);
router.get('/check', protectAdmin, adminController.checkAuth);

module.exports = router;
