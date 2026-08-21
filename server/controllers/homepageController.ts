// ============================================
// HOMEPAGE CONTROLLER
// Manages homepage content
// ============================================

import { Request, Response } from 'express';
import Homepage from '../models/Homepage';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Get homepage content (public)
export const getHomepage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find first homepage document (there should only be one)
    let homepage = await Homepage.findOne()
      .populate('featuredProject', 'title thumbnail description technologies githubUrl liveUrl')
      .populate('featuredProduct', 'name tagline logo description features');

    // If no homepage exists, create default one
    if (!homepage) {
      homepage = await Homepage.create({});
    }

    // Send homepage data
    successResponse(res, 'Homepage fetched successfully', homepage, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch homepage', 500, error);
  }
};

// Update homepage content (admin only)
export const updateHomepage = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = req.body;

    // Find first homepage document
    let homepage = await Homepage.findOne();

    // Create if doesn't exist
    if (!homepage) {
      homepage = await Homepage.create(updateData);
    } else {
      // Update existing homepage
      homepage = await Homepage.findByIdAndUpdate(
        homepage._id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    // Send updated homepage
    successResponse(res, 'Homepage updated successfully', homepage, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update homepage', 500, error);
  }
};

// Update hero section only (admin only)
export const updateHero = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hero } = req.body;

    // Find and update hero section
    const homepage = await Homepage.findOneAndUpdate(
      {},
      { hero },
      { new: true, upsert: true, runValidators: true }
    );

    // Send updated homepage
    successResponse(res, 'Hero section updated successfully', homepage, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update hero section', 500, error);
  }
};

// Update visual settings only (admin only)
export const updateVisualSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { visualSettings } = req.body;

    // Find and update visual settings
    const homepage = await Homepage.findOneAndUpdate(
      {},
      { visualSettings },
      { new: true, upsert: true, runValidators: true }
    );

    // Send updated homepage
    successResponse(res, 'Visual settings updated successfully', homepage, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update visual settings', 500, error);
  }
};