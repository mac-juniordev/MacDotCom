// ============================================
// PRODUCT CONTROLLER
// Handles all product operations
// ============================================

import { Request, Response } from 'express';
import Product from '../models/Product';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse';

// Get all products (public)
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Filter by featured if provided
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    // Get total count
    const total = await Product.countDocuments(filter);

    // Find products with pagination
    const products = await Product.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Send paginated response
    paginatedResponse(res, 'Products fetched successfully', products, page, limit, total);
  } catch (error) {
    errorResponse(res, 'Failed to fetch products', 500, error);
  }
};

// Get single product by ID (public)
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find product and increment views
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    // Check if product exists
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    // Send product data
    successResponse(res, 'Product fetched successfully', product, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch product', 500, error);
  }
};

// Get featured products (public)
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find featured products
    const products = await Product.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    // Send products
    successResponse(res, 'Featured products fetched successfully', products, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch featured products', 500, error);
  }
};

// Create new product (admin only)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;

    // Add logo if uploaded
    if (req.file) {
      productData.logo = `/uploads/products/${req.file.filename}`;
    }

    // Add screenshots if uploaded
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      productData.screenshots = files.map(file => `/uploads/products/${file.filename}`);
    }

    // Create product
    const product = await Product.create(productData);

    // Send created product
    successResponse(res, 'Product created successfully', product, 201);
  } catch (error) {
    errorResponse(res, 'Failed to create product', 500, error);
  }
};

// Update product (admin only)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productData = req.body;

    // Add logo if uploaded
    if (req.file) {
      productData.logo = `/uploads/products/${req.file.filename}`;
    }

    // Add screenshots if uploaded
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      productData.screenshots = files.map(file => `/uploads/products/${file.filename}`);
    }

    // Find and update product
    const product = await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true, runValidators: true }
    );

    // Check if product exists
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    // Send updated product
    successResponse(res, 'Product updated successfully', product, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update product', 500, error);
  }
};

// Delete product (admin only)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete product
    const product = await Product.findByIdAndDelete(id);

    // Check if product exists
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    // Send success response
    successResponse(res, 'Product deleted successfully', null, 200);
  } catch (error) {
    errorResponse(res, 'Failed to delete product', 500, error);
  }
};

// Toggle featured status (admin only)
export const toggleFeatured = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findById(id);

    // Check if product exists
    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    // Toggle featured status
    product.featured = !product.featured;
    await product.save();

    // Send updated product
    successResponse(res, 'Product featured status updated', product, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update featured status', 500, error);
  }
};