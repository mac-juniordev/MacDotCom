// ============================================
// MESSAGE ROUTES
// Public and admin routes for messages
// ============================================

import express from 'express';
import {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  replyToMessage,
  deleteMessage,
} from '../controllers/messageController';
import { protect, isOwner } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/', createMessage);

// Admin routes
router.get('/', protect, isOwner, getMessages);
router.get('/:id', protect, isOwner, getMessageById);
router.patch('/:id/status', protect, isOwner, updateMessageStatus);
router.post('/:id/reply', protect, isOwner, replyToMessage);
router.delete('/:id', protect, isOwner, deleteMessage);

export default router;