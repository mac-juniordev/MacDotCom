// ============================================
// SITE SETTINGS ROUTES
// Public and admin routes for site settings
// ============================================

import express from 'express';
import {
  getSiteSettings,
  updateSiteSettings,
  uploadResume,
  deleteResume,
} from '../controllers/siteSettingsController';
import { protect, isOwner } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes
router.get('/', getSiteSettings);

// Admin routes
router.put('/', protect, isOwner, updateSiteSettings);
router.post('/resume', protect, isOwner, uploadSingle('resume'), uploadResume);
router.delete('/resume', protect, isOwner, deleteResume);

export default router;