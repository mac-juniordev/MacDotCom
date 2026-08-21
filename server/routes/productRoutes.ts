// ============================================
// PRODUCT ROUTES
// Public and admin routes for products
// ============================================

import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
} from '../controllers/productController';
import { protect, isOwner } from '../middleware/authMiddleware';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware';
import { validateProduct, validateProductUpdate } from '../validators/productValidator';
import { validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
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
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, isOwner, uploadSingle('logo'), validateProduct, validate, createProduct);
router.put('/:id', protect, isOwner, uploadSingle('logo'), validateProductUpdate, validate, updateProduct);
router.delete('/:id', protect, isOwner, deleteProduct);
router.patch('/:id/featured', protect, isOwner, toggleFeatured);

export default router;