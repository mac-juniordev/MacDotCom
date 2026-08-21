// ============================================
// AUTH ROUTES
// Routes for authentication
// ============================================

import express from 'express';
import { login, getMe, updateMe, changePassword, logout } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { validateLogin, validateProfileUpdate, validatePasswordChange } from '../validators/authValidator';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware to check validation results
const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err: any) => err.msg),
    });
  }
  next();
};

// Public routes
router.post('/login', validateLogin, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, validateProfileUpdate, validate, updateMe);
router.put('/password', protect, validatePasswordChange, validate, changePassword);
router.post('/logout', protect, logout);

export default router;