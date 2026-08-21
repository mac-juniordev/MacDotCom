// ============================================
// PRODUCT VALIDATOR
// Validates product creation and updates
// ============================================

import { body } from 'express-validator';

// Validation rules for creating a product
export const validateProduct = [
  // Name required
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),

  // Tagline required
  body('tagline')
    .trim()
    .notEmpty()
    .withMessage('Product tagline is required')
    .isLength({ max: 200 })
    .withMessage('Tagline cannot exceed 200 characters'),

  // Description required
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  // Features required (must be array)
  body('features')
    .isArray({ min: 1 })
    .withMessage('At least one feature is required'),

  // Technologies required (must be array)
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),

  // Status must be valid
  body('status')
    .optional()
    .isIn(['development', 'beta', 'launched', 'maintenance'])
    .withMessage('Invalid status'),

  // Featured must be boolean
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be true or false'),

  // URLs must be valid if provided
  body('githubUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid GitHub URL'),

  body('demoUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid demo URL'),

  // Order must be number
  body('order')
    .optional()
    .isNumeric()
    .withMessage('Order must be a number'),
];

// Validation rules for updating a product (all optional)
export const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),

  body('tagline')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tagline cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('features')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one feature is required'),

  body('technologies')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),

  body('status')
    .optional()
    .isIn(['development', 'beta', 'launched', 'maintenance'])
    .withMessage('Invalid status'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be true or false'),

  body('githubUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid GitHub URL'),

  body('demoUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid demo URL'),

  body('order')
    .optional()
    .isNumeric()
    .withMessage('Order must be a number'),
];