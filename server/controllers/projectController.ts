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

// Create new project (admin only)
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectData = req.body;

    // Parse technologies if it's a JSON string
    if (typeof projectData.technologies === 'string') {
      try {
        projectData.technologies = JSON.parse(projectData.technologies);
      } catch (error) {
        // If JSON parse fails, split by comma
        projectData.technologies = projectData.technologies.split(',').map((t: string) => t.trim());
      }
    }

    // Parse featured if it's a string
    if (typeof projectData.featured === 'string') {
      projectData.featured = projectData.featured === 'true';
    }

    // Add thumbnail if uploaded
    if (req.file) {
      projectData.thumbnail = `/uploads/projects/${req.file.filename}`;
    }

    // Add gallery images if uploaded
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      projectData.gallery = files.map(file => `/uploads/projects/${file.filename}`);
    }

    // Create project
    const project = await Project.create(projectData);

    // Send created project
    successResponse(res, 'Project created successfully', project, 201);
  } catch (error) {
    errorResponse(res, 'Failed to create project', 500, error);
  }
};

// ============================================
// Update project (admin only)
// ============================================

// Update project (admin only)
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const projectData = req.body;

    // Parse technologies if it's a JSON string
    if (typeof projectData.technologies === 'string') {
      try {
        projectData.technologies = JSON.parse(projectData.technologies);
      } catch (error) {
        projectData.technologies = projectData.technologies.split(',').map((t: string) => t.trim());
      }
    }

    // Parse featured if it's a string
    if (typeof projectData.featured === 'string') {
      projectData.featured = projectData.featured === 'true';
    }

    // Add thumbnail if uploaded
    if (req.file) {
      projectData.thumbnail = `/uploads/projects/${req.file.filename}`;
    }

    // Find and update project
    const project = await Project.findByIdAndUpdate(
      id,
      projectData,
      { new: true, runValidators: true }
    );

    // Check if project exists
    if (!project) {
      errorResponse(res, 'Project not found', 404);
      return;
    }

    // Send updated project
    successResponse(res, 'Project updated successfully', project, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update project', 500, error);
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