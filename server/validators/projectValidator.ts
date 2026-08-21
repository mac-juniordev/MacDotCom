// ============================================
// PROJECT VALIDATOR - UPDATED
// Handles both JSON and FormData
// ============================================

import { body } from 'express-validator';

// Helper to check if technologies is valid
const isValidTechnologies = (value: any): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'string') {
    // Try JSON parse
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch (error) {
      // Not JSON, check comma-separated
      return value.split(',').filter((t: string) => t.trim()).length > 0;
    }
  }

  return false;
};

// Validation rules for creating a project
export const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),

  body('technologies')
    .custom(isValidTechnologies)
    .withMessage('At least one technology is required'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Project category is required')
    .isIn(['web', 'mobile', 'desktop', 'api', 'fullstack', 'other'])
    .withMessage('Invalid category'),

  body('status')
    .optional()
    .isIn(['in-progress', 'completed', 'maintenance', 'archived'])
    .withMessage('Invalid status'),

  body('featured')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        return value === 'true' || value === 'false';
      }
      return typeof value === 'boolean';
    })
    .withMessage('Featured must be true or false'),

  body('githubUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage('Invalid GitHub URL'),

  body('liveUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage('Invalid live demo URL'),
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
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),

  body('technologies')
    .optional()
    .custom(isValidTechnologies)
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
    .custom((value) => {
      if (typeof value === 'string') {
        return value === 'true' || value === 'false';
      }
      return typeof value === 'boolean';
    })
    .withMessage('Featured must be true or false'),

  body('githubUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage('Invalid GitHub URL'),

  body('liveUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage('Invalid live demo URL'),
];
