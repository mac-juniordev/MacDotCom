// ============================================
// STATISTIC CONTROLLER
// Manages company statistics
// ============================================

import { Request, Response } from 'express';
import Statistic from '../models/Statistic';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Get all statistics (public)
export const getStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find visible statistics sorted by order
    const stats = await Statistic.find({ isVisible: true }).sort({ order: 1 });

    // Send stats
    successResponse(res, 'Statistics fetched successfully', stats, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch statistics', 500, error);
  }
};

// Get all statistics including hidden (admin only)
export const getAllStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find all statistics sorted by order
    const stats = await Statistic.find().sort({ order: 1 });

    // Send stats
    successResponse(res, 'All statistics fetched successfully', stats, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch statistics', 500, error);
  }
};

// Create statistic (admin only)
export const createStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create statistic
    const stat = await Statistic.create(req.body);

    // Send created statistic
    successResponse(res, 'Statistic created successfully', stat, 201);
  } catch (error) {
    errorResponse(res, 'Failed to create statistic', 500, error);
  }
};

// Update statistic (admin only)
export const updateStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and update statistic
    const stat = await Statistic.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    // Check if statistic exists
    if (!stat) {
      errorResponse(res, 'Statistic not found', 404);
      return;
    }

    // Send updated statistic
    successResponse(res, 'Statistic updated successfully', stat, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update statistic', 500, error);
  }
};

// Delete statistic (admin only)
export const deleteStatistic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete statistic
    const stat = await Statistic.findByIdAndDelete(id);

    // Check if statistic exists
    if (!stat) {
      errorResponse(res, 'Statistic not found', 404);
      return;
    }

    // Send success response
    successResponse(res, 'Statistic deleted successfully', null, 200);
  } catch (error) {
    errorResponse(res, 'Failed to delete statistic', 500, error);
  }
};