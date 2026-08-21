// ============================================
// PRODUCT CONTROLLER
// Handles all product operations
// ============================================

import { Request, Response } from 'express';

import Product from '../models/Product';

import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from '../utils/apiResponse';

import {
  uploadFile,
  deleteFile,
  deleteFiles,
} from '../services/uploadService';

// ============================================
// Get all products
// ============================================

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page =
      Math.max(
        parseInt(req.query.page as string) || 1,
        1
      );

    const limit =
      Math.min(
        Math.max(
          parseInt(req.query.limit as string) || 10,
          1
        ),
        100
      );

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    const total =
      await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(
      res,
      'Products fetched successfully',
      products,
      page,
      limit,
      total
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch products',
      500,
      error
    );
  }
};

// ============================================
// Get single product
// ============================================

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product =
      await Product.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );

    if (!product) {
      errorResponse(
        res,
        'Product not found',
        404
      );
      return;
    }

    successResponse(
      res,
      'Product fetched successfully',
      product,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch product',
      500,
      error
    );
  }
};

// ============================================
// Get featured products
// ============================================

export const getFeaturedProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products =
      await Product.find({
        featured: true,
      })
        .sort({ order: 1, createdAt: -1 })
        .limit(6);

    successResponse(
      res,
      'Featured products fetched successfully',
      products,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch featured products',
      500,
      error
    );
  }
};

// ============================================
// Create product
// ============================================

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productData: Record<string, any> = {
      ...req.body,
    };

    // Upload logo
    if (req.file) {
      const uploaded = await uploadFile(
        req.file,
        'macdotcom/products'
      );

      productData.logo =
        uploaded.secure_url;
    }

    // Upload screenshots
    if (req.files) {
      const files =
        req.files as Express.Multer.File[];

      const uploadedFiles =
        await Promise.all(
          files.map((file) =>
            uploadFile(
              file,
              'macdotcom/products/screenshots'
            )
          )
        );

      productData.screenshots =
        uploadedFiles.map(
          (file) => file.secure_url
        );
    }

    const product =
      await Product.create(productData);

    successResponse(
      res,
      'Product created successfully',
      product,
      201
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to create product',
      500,
      error
    );
  }
};

// ============================================
// Update product
// ============================================

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id);

    if (!product) {
      errorResponse(
        res,
        'Product not found',
        404
      );
      return;
    }

    const productData: Record<string, any> = {
      ...req.body,
    };

    // Replace logo
    if (req.file) {
      const uploaded = await uploadFile(
        req.file,
        'macdotcom/products'
      );

      const oldLogo = product.logo;

      productData.logo =
        uploaded.secure_url;

      if (oldLogo) {
        await deleteFile(oldLogo);
      }
    }

    // Replace screenshots
    if (req.files) {
      const files =
        req.files as Express.Multer.File[];

      const uploadedFiles =
        await Promise.all(
          files.map((file) =>
            uploadFile(
              file,
              'macdotcom/products/screenshots'
            )
          )
        );

      const oldScreenshots =
        product.screenshots || [];

      productData.screenshots =
        uploadedFiles.map(
          (file) => file.secure_url
        );

      await deleteFiles(
        oldScreenshots
      );
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        productData,
        {
          new: true,
          runValidators: true,
        }
      );

    successResponse(
      res,
      'Product updated successfully',
      updatedProduct,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to update product',
      500,
      error
    );
  }
};

// ============================================
// Delete product
// ============================================

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id);

    if (!product) {
      errorResponse(
        res,
        'Product not found',
        404
      );
      return;
    }

    await Product.findByIdAndDelete(id);

    if (product.logo) {
      await deleteFile(product.logo);
    }

    if (product.screenshots?.length) {
      await deleteFiles(
        product.screenshots
      );
    }

    successResponse(
      res,
      'Product deleted successfully',
      null,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to delete product',
      500,
      error
    );
  }
};

// ============================================
// Toggle featured
// ============================================

export const toggleFeatured = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id);

    if (!product) {
      errorResponse(
        res,
        'Product not found',
        404
      );
      return;
    }

    product.featured =
      !product.featured;

    await product.save();

    successResponse(
      res,
      'Product featured status updated',
      product,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to update featured status',
      500,
      error
    );
  }
};