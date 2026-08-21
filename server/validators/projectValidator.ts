// ============================================
// PROJECT VALIDATOR
// Validates project creation and updates
// ============================================

import { body } from 'express-validator';

// Validation rules for creating a project
export const validateProject = [
  // Title required
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  // Description required
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  // Long description optional
  body('longDescription')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Long description cannot exceed 5000 characters'),

  // Technologies required (must be array)
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),

  // Category required
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Project category is required')
    .isIn(['web', 'mobile', 'desktop', 'api', 'fullstack', 'other'])
    .withMessage('Invalid category'),

  // Status must be valid
  body('status')
    .optional()
    .isIn(['in-progress', 'completed', 'maintenance', 'archived'])
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

  body('liveUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid live demo URL'),

  // Order must be number
  body('order')
    .optional()
    .isNumeric()
    .withMessage('Order must be a number'),
];

// Validation rules for updating a project (all optional)
export const validateProjectUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('technologies')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),

  body('category')
    .optional()
    .trim()
    .isIn(['web', 'mobile', 'desktop', 'api', 'fullstack', 'other'])
    .withMessage('Invalid category'),

  body('status')
    .optional()
    .isIn(['in-progress', 'completed', 'maintenance', 'archived'])
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

  body('liveUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid live demo URL'),

  body('order')
    .optional()
    .isNumeric()
    .withMessage('Order must be a number'),
];