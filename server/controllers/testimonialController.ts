// ============================================
// TESTIMONIAL CONTROLLER
// Manages client testimonials
// ============================================

import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Get all testimonials (public)
export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find visible testimonials sorted by order
    const testimonials = await Testimonial.find({ isVisible: true }).sort({ order: 1 });

    // Send testimonials
    successResponse(res, 'Testimonials fetched successfully', testimonials, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch testimonials', 500, error);
  }
};

// Get all testimonials including hidden (admin only)
export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find all testimonials sorted by order
    const testimonials = await Testimonial.find().sort({ order: 1 });

    // Send testimonials
    successResponse(res, 'All testimonials fetched successfully', testimonials, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch testimonials', 500, error);
  }
};

// Create testimonial (admin only)
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonialData = req.body;

    // Add avatar if uploaded
    if (req.file) {
      testimonialData.avatar = `/uploads/testimonials/${req.file.filename}`;
    }

    // Create testimonial
    const testimonial = await Testimonial.create(testimonialData);

    // Send created testimonial
    successResponse(res, 'Testimonial created successfully', testimonial, 201);
  } catch (error) {
    errorResponse(res, 'Failed to create testimonial', 500, error);
  }
};

// Update testimonial (admin only)
export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonialData = req.body;

    // Add avatar if uploaded
    if (req.file) {
      testimonialData.avatar = `/uploads/testimonials/${req.file.filename}`;
    }

    // Find and update testimonial
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      testimonialData,
      { new: true, runValidators: true }
    );

    // Check if testimonial exists
    if (!testimonial) {
      errorResponse(res, 'Testimonial not found', 404);
      return;
    }

    // Send updated testimonial
    successResponse(res, 'Testimonial updated successfully', testimonial, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update testimonial', 500, error);
  }
};

// Delete testimonial (admin only)
export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete testimonial
    const testimonial = await Testimonial.findByIdAndDelete(id);

    // Check if testimonial exists
    if (!testimonial) {
      errorResponse(res, 'Testimonial not found', 404);
      return;
    }

    // Send success response
    successResponse(res, 'Testimonial deleted successfully', null, 200);
  } catch (error) {
    errorResponse(res, 'Failed to delete testimonial', 500, error);
  }
};