const express = require('express');
const router = express.Router();
const { validateContact } = require('../validators/contactValidators');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');
const { createRateLimiter } = require('../utils/rateLimit');
const ContactController = require('../controllers/ContactController');

const contactLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/', contactLimiter, validateContact, handleValidationErrors, ContactController.submitContact);

module.exports = router;


