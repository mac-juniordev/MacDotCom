// ============================================
// THEME CONTROLLER
// Manages website theme settings
// ============================================

import { Request, Response } from 'express';
import ThemeSettings from '../models/ThemeSettings';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Get theme settings (public)
export const getTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find first theme settings document
    let theme = await ThemeSettings.findOne();

    // Create default if doesn't exist
    if (!theme) {
      theme = await ThemeSettings.create({});
    }

    // Send theme settings
    successResponse(res, 'Theme settings fetched successfully', theme, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch theme settings', 500, error);
  }
};

// Update theme settings (admin only)
export const updateTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = req.body;

    // Find and update theme settings
    const theme = await ThemeSettings.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    // Send updated theme
    successResponse(res, 'Theme settings updated successfully', theme, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update theme settings', 500, error);
  }
};

// Reset theme to defaults (admin only)
export const resetTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    // Delete existing theme
    await ThemeSettings.deleteMany({});

    // Create new default theme
    const theme = await ThemeSettings.create({});

    // Send new default theme
    successResponse(res, 'Theme reset to defaults', theme, 200);
  } catch (error) {
    errorResponse(res, 'Failed to reset theme', 500, error);
  }
};