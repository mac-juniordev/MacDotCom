// ============================================
// TIMELINE CONTROLLER
// Manages career timeline entries
// ============================================

import { Request, Response } from 'express';
import Timeline from '../models/Timeline';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Get timeline entries (public)
export const getTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    // Build filter
    const filter: any = { isVisible: true };

    // Filter by type if provided
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Find timeline entries sorted by year descending
    const timeline = await Timeline.find(filter).sort({ year: -1, order: 1 });

    // Send timeline
    successResponse(res, 'Timeline fetched successfully', timeline, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch timeline', 500, error);
  }
};

// Get all timeline entries including hidden (admin only)
export const getAllTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find all timeline entries sorted by year descending
    const timeline = await Timeline.find().sort({ year: -1, order: 1 });

    // Send timeline
    successResponse(res, 'All timeline entries fetched successfully', timeline, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch timeline', 500, error);
  }
};

// Create timeline entry (admin only)
export const createTimelineEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create timeline entry
    const entry = await Timeline.create(req.body);

    // Send created entry
    successResponse(res, 'Timeline entry created successfully', entry, 201);
  } catch (error) {
    errorResponse(res, 'Failed to create timeline entry', 500, error);
  }
};

// Update timeline entry (admin only)
export const updateTimelineEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and update timeline entry
    const entry = await Timeline.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    // Check if entry exists
    if (!entry) {
      errorResponse(res, 'Timeline entry not found', 404);
      return;
    }

    // Send updated entry
    successResponse(res, 'Timeline entry updated successfully', entry, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update timeline entry', 500, error);
  }
};

// Delete timeline entry (admin only)
export const deleteTimelineEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete timeline entry
    const entry = await Timeline.findByIdAndDelete(id);

    // Check if entry exists
    if (!entry) {
      errorResponse(res, 'Timeline entry not found', 404);
      return;
    }

    // Send success response
    successResponse(res, 'Timeline entry deleted successfully', null, 200);
  } catch (error) {
    errorResponse(res, 'Failed to delete timeline entry', 500, error);
  }
};