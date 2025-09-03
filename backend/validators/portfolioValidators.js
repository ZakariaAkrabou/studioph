const { body, param } = require('express-validator');

exports.validateCreatePortfolio = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Portfolio title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID')
];

exports.validateUpdatePortfolio = [
  param('id')
    .isMongoId()
    .withMessage('Invalid portfolio ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID')
];

exports.validatePortfolioId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid portfolio ID')
];

exports.validateDeletePortfolio = [
  param('id')
    .isMongoId()
    .withMessage('Invalid portfolio ID')
];
