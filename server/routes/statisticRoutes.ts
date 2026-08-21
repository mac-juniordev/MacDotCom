// ============================================
// STATISTIC ROUTES
// Public and admin routes for statistics
// ============================================

import express from 'express';
import {
  getStatistics,
  getAllStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from '../controllers/statisticController';
import { protect, isOwner } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getStatistics);

// Admin routes
router.get('/all', protect, isOwner, getAllStatistics);
router.post('/', protect, isOwner, createStatistic);
router.put('/:id', protect, isOwner, updateStatistic);
router.delete('/:id', protect, isOwner, deleteStatistic);

export default router;