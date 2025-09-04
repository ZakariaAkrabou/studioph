const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AuthController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword, validateVerifyEmail } = require('../validators/authValidators');
const { registreLmiter, LoginLimiter, forgotPasswordLimiter, resetPasswordLimiter, verifyEmailLimiter } = require('../utils/rateLimit');


router.post('/register', validateRegister, handleValidationErrors,registreLmiter, adminController.registerAdmin);
router.get('/verify/:token', validateVerifyEmail, handleValidationErrors, verifyEmailLimiter, adminController.verifyEmail);
router.post('/login', validateLogin, handleValidationErrors,LoginLimiter, adminController.loginAdmin);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, forgotPasswordLimiter, adminController.forgotPassword);
router.put('/reset-password/:token', validateResetPassword, handleValidationErrors, resetPasswordLimiter, adminController.resetPassword);
router.get('/check', protectAdmin, adminController.checkAuth);

module.exports = router;
