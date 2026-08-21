// ============================================
// SITE SETTINGS CONTROLLER
// Manages general website settings
// ============================================

import { Request, Response } from 'express';
import SiteSettings from '../models/SiteSettings';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Get site settings (public)
export const getSiteSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find first site settings document
    let settings = await SiteSettings.findOne();

    // Create default if doesn't exist
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    // Send settings
    successResponse(res, 'Site settings fetched successfully', settings, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch site settings', 500, error);
  }
};

// Update site settings (admin only)
export const updateSiteSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = req.body;

    // Find and update site settings
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    // Send updated settings
    successResponse(res, 'Site settings updated successfully', settings, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update site settings', 500, error);
  }
};

// Upload resume (admin only)
export const uploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      errorResponse(res, 'No file uploaded', 400);
      return;
    }

    // Get resume URL
    const resumeUrl = `/uploads/resume/${req.file.filename}`;

    // Update site settings with resume URL
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { resumeUrl },
      { new: true, upsert: true }
    );

    // Send updated settings
    successResponse(res, 'Resume uploaded successfully', settings, 200);
  } catch (error) {
    errorResponse(res, 'Failed to upload resume', 500, error);
  }
};

// Delete resume (admin only)
export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    // Update site settings to remove resume URL
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { resumeUrl: null },
      { new: true }
    );

    // Send updated settings
    successResponse(res, 'Resume deleted successfully', settings, 200);
  } catch (error) {
    errorResponse(res, 'Failed to delete resume', 500, error);
  }
};