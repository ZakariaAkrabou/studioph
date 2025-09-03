const { body, param, query } = require('express-validator');

exports.validateCreateClientSpace = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Client space name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  body('key')
    .notEmpty()
    .withMessage('Access key is required')
    .isLength({ min: 6, max: 50 })
    .withMessage('Access key must be between 6 and 50 characters')
];

exports.validateAccessClientSpace = [
  param('id')
    .isMongoId()
    .withMessage('Invalid client space ID'),
  body('key')
    .notEmpty()
    .withMessage('Access key is required')
];

exports.validateUpdateClientSpace = [
  param('id')
    .isMongoId()
    .withMessage('Invalid client space ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  body('key')
    .optional()
    .isLength({ min: 6, max: 50 })
    .withMessage('Access key must be between 6 and 50 characters')
];

exports.validateClientSpaceId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid client space ID')
];

exports.validateUploadImages = [
  param('id')
    .isMongoId()
    .withMessage('Invalid client space ID')
];

exports.validateRemoveImage = [
  param('id')
    .isMongoId()
    .withMessage('Invalid client space ID'),
  query('index')
    .isInt({ min: 0 })
    .withMessage('Image index must be a non-negative integer')
];

exports.validateReplaceImage = [
  param('id')
    .isMongoId()
    .withMessage('Invalid client space ID'),
  param('index')
    .isInt({ min: 0 })
    .withMessage('Image index must be a non-negative integer')
];
