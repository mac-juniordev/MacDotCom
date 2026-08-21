// ============================================
// TESTIMONIAL ROUTES
// Public and admin routes for testimonials
// ============================================

import express from 'express';
import {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController';
import { protect, isOwner } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);

// Admin routes
router.get('/all', protect, isOwner, getAllTestimonials);
router.post('/', protect, isOwner, uploadSingle('avatar'), createTestimonial);
router.put('/:id', protect, isOwner, uploadSingle('avatar'), updateTestimonial);
router.delete('/:id', protect, isOwner, deleteTestimonial);

export default router;