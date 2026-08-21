// ============================================
// THEME ROUTES
// Public and admin routes for theme
// ============================================

import express from 'express';
import {
  getTheme,
  updateTheme,
  resetTheme,
} from '../controllers/themeController';
import { protect, isOwner } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getTheme);

// Admin routes
router.put('/', protect, isOwner, updateTheme);
router.post('/reset', protect, isOwner, resetTheme);

export default router;