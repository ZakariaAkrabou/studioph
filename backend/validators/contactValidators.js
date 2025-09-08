const { body } = require('express-validator');

exports.validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('service')
    .trim()
    .notEmpty().withMessage('Service is required')
    .isLength({ max: 100 }).withMessage('Service must be at most 100 characters'),
  body('preferredDate')
    .optional()
    .isISO8601().withMessage('Preferred date must be a valid date')
    .custom((value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0,0,0,0);
      const chosen = new Date(value);
      chosen.setHours(0,0,0,0);
      if (chosen < today) {
        throw new Error('Preferred date cannot be in the past');
      }
      return true;
    }),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message must be at most 2000 characters'),
];


