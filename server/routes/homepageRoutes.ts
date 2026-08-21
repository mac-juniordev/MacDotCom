// ============================================
// HOMEPAGE ROUTES
// Public and admin routes for homepage
// ============================================

import express from 'express';
import {
  getHomepage,
  updateHomepage,
  updateHero,
  updateVisualSettings,
} from '../controllers/homepageController';
import { protect, isOwner } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getHomepage);

// Admin routes
router.put('/', protect, isOwner, updateHomepage);
router.put('/hero', protect, isOwner, updateHero);
router.put('/visual-settings', protect, isOwner, updateVisualSettings);

export default router;