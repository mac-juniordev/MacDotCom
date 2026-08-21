// ============================================
// SKILL ROUTES
// Public and admin routes for skills
// ============================================

import express from 'express';
import {
  getSkills,
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from '../controllers/skillController';
import { protect, isOwner } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes
router.get('/', getSkills);

// Admin routes
router.get('/all', protect, isOwner, getAllSkills);
router.post('/', protect, isOwner, uploadSingle('icon'), createSkill);
router.put('/:id', protect, isOwner, uploadSingle('icon'), updateSkill);
router.delete('/:id', protect, isOwner, deleteSkill);
router.post('/reorder', protect, isOwner, reorderSkills);

export default router;