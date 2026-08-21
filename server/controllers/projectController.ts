// ============================================
// PROJECT CONTROLLER
// Handles all project operations
// ============================================

import { Request, Response } from 'express';
import multer from 'multer';

import Project from '../models/Project';

import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from '../utils/apiResponse';

// ============================================
// Types
// ============================================

type MulterFile = Express.Multer.File;

interface ProjectFiles {
  thumbnail?: MulterFile[];
  gallery?: MulterFile[];
}

type MulterRequest = Request & {
  files?: ProjectFiles;
};

// ============================================
// Get all projects (public)
// ============================================

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(
      res,
      'Projects fetched successfully',
      projects,
      page,
      limit,
      total
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch projects',
      500,
      error
    );
  }
};

// ============================================
// Get single project by ID (public)
// ============================================

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!project) {
      errorResponse(res, 'Project not found', 404);
      return;
    }

    successResponse(
      res,
      'Project fetched successfully',
      project,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch project',
      500,
      error
    );
  }
};

// ============================================
// Get featured projects (public)
// ============================================

export const getFeaturedProjects = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await Project.find({
      featured: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    successResponse(
      res,
      'Featured projects fetched successfully',
      projects,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch featured projects',
      500,
      error
    );
  }
};

// ============================================
// Create new project (admin only)
// ============================================

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const request = req as MulterRequest;

    const projectData = {
      ...req.body,
    };

    // ----------------------------------------
    // Thumbnail
    // ----------------------------------------

    if (request.files?.thumbnail?.[0]) {
      const thumbnail = request.files.thumbnail[0];

      projectData.thumbnail =
        `/uploads/projects/${thumbnail.filename}`;
    }

    // ----------------------------------------
    // Gallery
    // ----------------------------------------

    if (
      request.files?.gallery &&
      request.files.gallery.length > 0
    ) {
      projectData.gallery =
        request.files.gallery.map(
          (file) =>
            `/uploads/projects/${file.filename}`
        );
    }

    // ----------------------------------------
    // Create project
    // ----------------------------------------

    const project = await Project.create(projectData);

    successResponse(
      res,
      'Project created successfully',
      project,
      201
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to create project',
      500,
      error
    );
  }
};

// ============================================
// Update project (admin only)
// ============================================

export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const request = req as MulterRequest;

    const projectData = {
      ...req.body,
    };

    // ----------------------------------------
    // New thumbnail
    // ----------------------------------------

    if (request.files?.thumbnail?.[0]) {
      const thumbnail = request.files.thumbnail[0];

      projectData.thumbnail =
        `/uploads/projects/${thumbnail.filename}`;
    }

    // ----------------------------------------
    // New gallery
    // ----------------------------------------

    if (
      request.files?.gallery &&
      request.files.gallery.length > 0
    ) {
      projectData.gallery =
        request.files.gallery.map(
          (file) =>
            `/uploads/projects/${file.filename}`
        );
    }

    // ----------------------------------------
    // Update project
    // ----------------------------------------

    const project = await Project.findByIdAndUpdate(
      id,
      projectData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      errorResponse(res, 'Project not found', 404);
      return;
    }

    successResponse(
      res,
      'Project updated successfully',
      project,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to update project',
      500,
      error
    );
  }
};

// ============================================
// Delete project (admin only)
// ============================================

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      errorResponse(res, 'Project not found', 404);
      return;
    }

    successResponse(
      res,
      'Project deleted successfully',
      null,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to delete project',
      500,
      error
    );
  }
};

// ============================================
// Toggle featured status (admin only)
// ============================================

export const toggleFeatured = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      errorResponse(res, 'Project not found', 404);
      return;
    }

    project.featured = !project.featured;

    await project.save();

    successResponse(
      res,
      'Project featured status updated',
      project,
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