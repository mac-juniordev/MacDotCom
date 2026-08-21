// ============================================
// AUTH CONTROLLER
// Handles login and profile management
// ============================================

import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      errorResponse(res, 'Invalid email or password', 401);
      return;
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      errorResponse(res, 'Invalid email or password', 401);
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Send success response with token and user data
    successResponse(res, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        bio: user.bio,
        location: user.location,
        avatar: user.avatar,
      },
    }, 200);
  } catch (error) {
    errorResponse(res, 'Login failed', 500, error);
  }
};

// Get current user profile
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by auth middleware
    const userId = (req as any).user.id;

    // Find user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    // Send user data
    successResponse(res, 'Profile fetched successfully', user, 200);
  } catch (error) {
    errorResponse(res, 'Failed to fetch profile', 500, error);
  }
};

// Update current user profile
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, email, title, bio, location, avatar } = req.body;

    // Create update object with only provided fields
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (title) updateData.title = title;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (avatar) updateData.avatar = avatar;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    // Check if user exists
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    // Send updated user data
    successResponse(res, 'Profile updated successfully', user, 200);
  } catch (error) {
    errorResponse(res, 'Failed to update profile', 500, error);
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    // Find user and include password
    const user = await User.findById(userId).select('+password');

    // Check if user exists
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      errorResponse(res, 'Current password is incorrect', 401);
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send success response
    successResponse(res, 'Password changed successfully', null, 200);
  } catch (error) {
    errorResponse(res, 'Failed to change password', 500, error);
  }
};

// Logout user (token will be invalidated client-side)
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // JWT is stateless, so logout is handled client-side
    // We just send success response
    successResponse(res, 'Logout successful', null, 200);
  } catch (error) {
    errorResponse(res, 'Logout failed', 500, error);
  }
};