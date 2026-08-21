// ============================================
// SOCIAL LINK CONTROLLER
// Manages social media links
// ============================================

import { Request, Response } from 'express';
import SocialLink from '../models/SocialLink';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Get all social links (public)
export const getSocialLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find visible social links sorted by order
    const links = await SocialLink.find({ isVisible: true }).sort({ order: 1 });

    // Send links
    successResponse(res, 'Social links fetched successfully', links, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch social links', 500, error);
  }
};

// Get all social links including hidden (admin only)
export const getAllSocialLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find all social links sorted by order
    const links = await SocialLink.find().sort({ order: 1 });

    // Send links
    successResponse(res, 'All social links fetched successfully', links, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch social links', 500, error);
  }
};

// Create social link (admin only)
export const createSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create social link
    const link = await SocialLink.create(req.body);

    // Send created link
    successResponse(res, 'Social link created successfully', link, 201);
  } catch (error) {
    errorResponse(res, 'Failed to create social link', 500, error);
  }
};

// Update social link (admin only)
export const updateSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and update social link
    const link = await SocialLink.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    // Check if link exists
    if (!link) {
      errorResponse(res, 'Social link not found', 404);
      return;
    }

    // Send updated link
    successResponse(res, 'Social link updated successfully', link, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update social link', 500, error);
  }
};

// Delete social link (admin only)
export const deleteSocialLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete social link
    const link = await SocialLink.findByIdAndDelete(id);

    // Check if link exists
    if (!link) {
      errorResponse(res, 'Social link not found', 404);
      return;
    }

    // Send success response
    successResponse(res, 'Social link deleted successfully', null, 200);
  } catch (error) {
    errorResponse(res, 'Failed to delete social link', 500, error);
  }
};