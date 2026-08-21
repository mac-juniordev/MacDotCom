// ============================================
// PROJECT CONTROLLER
// Handles all project operations
// ============================================

import { Request, Response } from 'express';

import Project from '../models/Project';

import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from '../utils/apiResponse';

import {
  uploadFile,
  deleteFile,
  deleteFiles,
} from '../services/uploadService';

// ============================================
// Helpers
// ============================================

const parseTechnologies = (
  technologies: unknown
): string[] => {
  if (Array.isArray(technologies)) {
    return technologies
      .map(String)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  if (typeof technologies === 'string') {
    try {
      const parsed = JSON.parse(technologies);

      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .map((value) => value.trim())
          .filter(Boolean);
      }
    } catch {
      // Fall back to comma-separated values.
    }

    return technologies
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return [];
};

const parseBoolean = (
  value: unknown
): boolean | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  if (value === 'true') return true;
  if (value === 'false') return false;

  return undefined;
};

// ============================================
// Get all projects
// ============================================

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page =
      Math.max(
        parseInt(req.query.page as string) || 1,
        1
      );

    const limit =
      Math.min(
        Math.max(
          parseInt(req.query.limit as string) || 10,
          1
        ),
        100
      );

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

    const total =
      await Project.countDocuments(filter);

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
// Get single project
// ============================================

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project =
      await Project.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );

    if (!project) {
      errorResponse(
        res,
        'Project not found',
        404
      );
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
// Get featured projects
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
// Create project
// ============================================

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectData: Record<string, any> = {
      ...req.body,
    };

    projectData.technologies =
      parseTechnologies(
        projectData.technologies
      );

    const featured = parseBoolean(
      projectData.featured
    );

    if (featured !== undefined) {
      projectData.featured = featured;
    }

    // Upload thumbnail to Cloudinary
    if (req.file) {
      const uploaded = await uploadFile(
        req.file,
        'macdotcom/projects'
      );

      projectData.thumbnail =
        uploaded.secure_url;
    }

    // Upload gallery images
    if (req.files) {
      const files =
        req.files as Express.Multer.File[];

      const uploadedFiles =
        await Promise.all(
          files.map((file) =>
            uploadFile(
              file,
              'macdotcom/projects/gallery'
            )
          )
        );

      projectData.gallery =
        uploadedFiles.map(
          (file) => file.secure_url
        );
    }

    const project =
      await Project.create(projectData);

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
// Update project
// ============================================

export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project =
      await Project.findById(id);

    if (!project) {
      errorResponse(
        res,
        'Project not found',
        404
      );
      return;
    }

    const projectData: Record<string, any> = {
      ...req.body,
    };

    if (
      projectData.technologies !== undefined
    ) {
      projectData.technologies =
        parseTechnologies(
          projectData.technologies
        );
    }

    const featured = parseBoolean(
      projectData.featured
    );

    if (featured !== undefined) {
      projectData.featured = featured;
    }

    // Replace thumbnail if a new one was uploaded
    if (req.file) {
      const uploaded = await uploadFile(
        req.file,
        'macdotcom/projects'
      );

      const oldThumbnail =
        project.thumbnail;

      projectData.thumbnail =
        uploaded.secure_url;

      if (oldThumbnail) {
        await deleteFile(oldThumbnail);
      }
    }

    // Replace gallery if gallery files were uploaded
    if (req.files) {
      const files =
        req.files as Express.Multer.File[];

      const uploadedFiles =
        await Promise.all(
          files.map((file) =>
            uploadFile(
              file,
              'macdotcom/projects/gallery'
            )
          )
        );

      const oldGallery =
        project.gallery || [];

      projectData.gallery =
        uploadedFiles.map(
          (file) => file.secure_url
        );

      await deleteFiles(oldGallery);
    }

    const updatedProject =
      await Project.findByIdAndUpdate(
        id,
        projectData,
        {
          new: true,
          runValidators: true,
        }
      );

    successResponse(
      res,
      'Project updated successfully',
      updatedProject,
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
// Delete project
// ============================================

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project =
      await Project.findById(id);

    if (!project) {
      errorResponse(
        res,
        'Project not found',
        404
      );
      return;
    }

    await Project.findByIdAndDelete(id);

    // Remove Cloudinary assets
    if (project.thumbnail) {
      await deleteFile(project.thumbnail);
    }

    if (project.gallery?.length) {
      await deleteFiles(project.gallery);
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
// Toggle featured
// ============================================

export const toggleFeatured = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project =
      await Project.findById(id);

    if (!project) {
      errorResponse(
        res,
        'Project not found',
        404
      );
      return;
    }

    project.featured =
      !project.featured;

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