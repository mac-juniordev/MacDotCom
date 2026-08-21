// ============================================
// SKILL CONTROLLER
// Manages technical skills
// ============================================

import { Request, Response } from 'express';
import Skill from '../models/Skill';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Get all skills (public)
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    // Build filter
    const filter: any = { isVisible: true };

    // Filter by category if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Find skills sorted by order
    const skills = await Skill.find(filter).sort({ order: 1, name: 1 });

    // Send skills
    successResponse(res, 'Skills fetched successfully', skills, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch skills', 500, error);
  }
};

// Get all skills including hidden (admin only)
export const getAllSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find all skills sorted by order
    const skills = await Skill.find().sort({ order: 1, name: 1 });

    // Send skills
    successResponse(res, 'All skills fetched successfully', skills, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch skills', 500, error);
  }
};

// Create skill (admin only)
export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skillData = req.body;

    // Add icon if uploaded
    if (req.file) {
      skillData.icon = `/uploads/skills/${req.file.filename}`;
    }

    // Create skill
    const skill = await Skill.create(skillData);

    // Send created skill
    successResponse(res, 'Skill created successfully', skill, 201);
  } catch (error) {
    errorResponse(res, 'Failed to create skill', 500, error);
  }
};

// Update skill (admin only)
export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const skillData = req.body;

    // Add icon if uploaded
    if (req.file) {
      skillData.icon = `/uploads/skills/${req.file.filename}`;
    }

    // Find and update skill
    const skill = await Skill.findByIdAndUpdate(
      id,
      skillData,
      { new: true, runValidators: true }
    );

    // Check if skill exists
    if (!skill) {
      errorResponse(res, 'Skill not found', 404);
      return;
    }

    // Send updated skill
    successResponse(res, 'Skill updated successfully', skill, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update skill', 500, error);
  }
};

// Delete skill (admin only)
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete skill
    const skill = await Skill.findByIdAndDelete(id);

    // Check if skill exists
    if (!skill) {
      errorResponse(res, 'Skill not found', 404);
      return;
    }

    // Send success response
    successResponse(res, 'Skill deleted successfully', null, 200);
  } catch (error) {
    errorResponse(res, 'Failed to delete skill', 500, error);
  }
};

// Reorder skills (admin only)
export const reorderSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skills } = req.body;

    // Update order for each skill
    for (const skill of skills) {
      await Skill.findByIdAndUpdate(skill.id, { order: skill.order });
    }

    // Fetch updated skills
    const updatedSkills = await Skill.find().sort({ order: 1 });

    // Send updated skills
    successResponse(res, 'Skills reordered successfully', updatedSkills, 200);
  } catch (error) {
    errorResponse(res, 'Failed to reorder skills', 500, error);
  }
};