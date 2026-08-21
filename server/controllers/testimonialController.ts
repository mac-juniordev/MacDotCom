// ============================================
// TESTIMONIAL CONTROLLER
// Manages client testimonials
// Auto-publish reviews + admin moderation
// ============================================

import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';
import { successResponse, errorResponse } from '../utils/apiResponse';

// ============================================
// GET PUBLISHED TESTIMONIALS
// Public
// ============================================

export const getTestimonials = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Find visible and published testimonials
    const testimonials = await Testimonial.find({
      isVisible: true,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    successResponse(
      res,
      'Testimonials fetched successfully',
      testimonials,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch testimonials',
      500,
      error
    );
  }
};

// ============================================
// GET ALL TESTIMONIALS
// Admin
// Includes unpublished and hidden testimonials
// ============================================

export const getAllTestimonials = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const testimonials = await Testimonial.find().sort({
      createdAt: -1,
    });

    successResponse(
      res,
      'All testimonials fetched successfully',
      testimonials,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch testimonials',
      500,
      error
    );
  }
};

// ============================================
// CREATE TESTIMONIAL
// Public
// Automatically publishes review
// ============================================

export const createTestimonial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      content,
      rating,
      company,
      role,
    } = req.body;

    // Prepare testimonial data
    const testimonialData: Record<string, any> = {
      name,
      content,
      rating: rating || 5,
      company: company || null,
      role: role || 'Client',
      isVisible: true,
      isPublished: true,
    };

    // Add avatar if uploaded
    if (req.file) {
      testimonialData.avatar = `/uploads/testimonials/${req.file.filename}`;
    }

    // Create testimonial
    const testimonial = await Testimonial.create(testimonialData);

    successResponse(
      res,
      'Review submitted successfully',
      testimonial,
      201
    );
  } catch (error: any) {
    errorResponse(
      res,
      error.message || 'Failed to submit review',
      500,
      error
    );
  }
};

// ============================================
// UPDATE TESTIMONIAL
// Admin
// ============================================

export const updateTestimonial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const testimonialData: Record<string, any> = {
      ...req.body,
    };

    // Add new avatar if uploaded
    if (req.file) {
      testimonialData.avatar = `/uploads/testimonials/${req.file.filename}`;
    }

    // Find and update testimonial
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      testimonialData,
      {
        new: true,
        runValidators: true,
      }
    );

    // Check if testimonial exists
    if (!testimonial) {
      errorResponse(
        res,
        'Testimonial not found',
        404
      );
      return;
    }

    successResponse(
      res,
      'Testimonial updated successfully',
      testimonial,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to update testimonial',
      500,
      error
    );
  }
};

// ============================================
// TOGGLE PUBLISH STATUS
// Admin
// ============================================

export const togglePublish = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find testimonial
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      errorResponse(
        res,
        'Testimonial not found',
        404
      );
      return;
    }

    // Toggle publish state
    testimonial.isPublished = !testimonial.isPublished;

    await testimonial.save();

    successResponse(
      res,
      'Review status updated successfully',
      testimonial,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to update review status',
      500,
      error
    );
  }
};

// ============================================
// DELETE TESTIMONIAL
// Admin
// ============================================

export const deleteTestimonial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete testimonial
    const testimonial = await Testimonial.findByIdAndDelete(id);

    // Check if testimonial exists
    if (!testimonial) {
      errorResponse(
        res,
        'Testimonial not found',
        404
      );
      return;
    }

    successResponse(
      res,
      'Review deleted successfully',
      null,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to delete review',
      500,
      error
    );
  }
};