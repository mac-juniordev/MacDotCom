// ============================================
// TESTIMONIAL ROUTES
// Public can submit reviews
// Admin can manage testimonials
// ============================================

import express from 'express';

import {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  togglePublish,
  deleteTestimonial,
} from '../controllers/testimonialController';

import {
  protect,
  isOwner,
} from '../middleware/authMiddleware';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get published testimonials
router.get('/', getTestimonials);

// Submit a testimonial
// Automatically published by the controller
router.post('/', createTestimonial);

// ============================================
// ADMIN ROUTES
// ============================================

// Get all testimonials
// Includes published, unpublished, visible and hidden
router.get(
  '/all',
  protect,
  isOwner,
  getAllTestimonials
);

// Update testimonial
router.put(
  '/:id',
  protect,
  isOwner,
  updateTestimonial
);

// Toggle published/unpublished status
router.patch(
  '/:id/toggle',
  protect,
  isOwner,
  togglePublish
);

// Delete testimonial
router.delete(
  '/:id',
  protect,
  isOwner,
  deleteTestimonial
);

export default router;