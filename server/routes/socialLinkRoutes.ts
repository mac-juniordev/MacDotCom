// ============================================
// SOCIAL LINK ROUTES
// Public and admin routes for social links
// ============================================

import express from 'express';
import {
  getSocialLinks,
  getAllSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '../controllers/socialLinkController';
import { protect, isOwner } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getSocialLinks);

// Admin routes
router.get('/all', protect, isOwner, getAllSocialLinks);
router.post('/', protect, isOwner, createSocialLink);
router.put('/:id', protect, isOwner, updateSocialLink);
router.delete('/:id', protect, isOwner, deleteSocialLink);

export default router;