// ============================================
// PROJECT ROUTES
// Public and admin routes for projects
// ============================================

import express from 'express';
import {
  getProjects,
  getProjectById,
  getFeaturedProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
} from '../controllers/projectController';
import { protect, isOwner } from '../middleware/authMiddleware';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware';
import { validateProject, validateProjectUpdate } from '../validators/projectValidator';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware to check validation results
const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err: any) => err.msg),
    });
  }
  next();
};

// ============================================
// PUBLIC ROUTES (No auth needed)
// ============================================

// Get all projects with filters
router.get('/', getProjects);

// Get featured projects
router.get('/featured', getFeaturedProjects);

// Get single project
router.get('/:id', getProjectById);

// ============================================
// ADMIN ROUTES (Auth required)
// ============================================

// Create project
router.post(
  '/',
  protect,
  isOwner,
  uploadSingle('thumbnail'),
  validateProject,
  validate,
  createProject
);

// Update project
router.put(
  '/:id',
  protect,
  isOwner,
  uploadSingle('thumbnail'),
  validateProjectUpdate,
  validate,
  updateProject
);

// Delete project
router.delete('/:id', protect, isOwner, deleteProject);

// Toggle featured status
router.patch('/:id/featured', protect, isOwner, toggleFeatured);

export default router;