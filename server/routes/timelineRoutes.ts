// ============================================
// TIMELINE ROUTES
// Public and admin routes for timeline
// ============================================

import express from 'express';
import {
  getTimeline,
  getAllTimeline,
  createTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
} from '../controllers/timelineController';
import { protect, isOwner } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getTimeline);

// Admin routes
router.get('/all', protect, isOwner, getAllTimeline);
router.post('/', protect, isOwner, createTimelineEntry);
router.put('/:id', protect, isOwner, updateTimelineEntry);
router.delete('/:id', protect, isOwner, deleteTimelineEntry);

export default router;