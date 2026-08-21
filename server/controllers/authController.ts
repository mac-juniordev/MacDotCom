// ============================================
// AUTH CONTROLLER
// Handles login and profile management
// ============================================

import { Request, Response } from 'express';

import User from '../models/User';

import { generateToken } from '../utils/generateToken';

import {
  successResponse,
  errorResponse,
} from '../utils/apiResponse';

// ============================================
// Login user
// ============================================

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password
    const user = await User.findOne({
      email,
    }).select('+password');

    if (!user) {
      errorResponse(
        res,
        'Invalid email or password',
        401
      );
      return;
    }

    // Check password
    const isPasswordMatch =
      await user.comparePassword(password);

    if (!isPasswordMatch) {
      errorResponse(
        res,
        'Invalid email or password',
        401
      );
      return;
    }

    // Generate JWT
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return authenticated user
    successResponse(
      res,
      'Login successful',
      {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          bio: user.bio,
          location: user.location,
          avatar: user.avatar,
        },
      },
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Login failed',
      500,
      error
    );
  }
};

// ============================================
// Get current user profile
// ============================================

export const getMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(
        res,
        'Not authorized',
        401
      );
      return;
    }

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      errorResponse(
        res,
        'User not found',
        404
      );
      return;
    }

    successResponse(
      res,
      'Profile fetched successfully',
      user,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to fetch profile',
      500,
      error
    );
  }
};

// ============================================
// Update current user profile
// ============================================

export const updateMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(
        res,
        'Not authorized',
        401
      );
      return;
    }

    const {
      name,
      email,
      title,
      bio,
      location,
      avatar,
    } = req.body;

    const updateData: Record<string, string> = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (title !== undefined) {
      updateData.title = title;
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    if (location !== undefined) {
      updateData.location = location;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      errorResponse(
        res,
        'User not found',
        404
      );
      return;
    }

    successResponse(
      res,
      'Profile updated successfully',
      user,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to update profile',
      500,
      error
    );
  }
};

// ============================================
// Change password
// ============================================

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(
        res,
        'Not authorized',
        401
      );
      return;
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      ).select('+password');

    if (!user) {
      errorResponse(
        res,
        'User not found',
        404
      );
      return;
    }

    // Verify current password
    const isPasswordMatch =
      await user.comparePassword(
        currentPassword
      );

    if (!isPasswordMatch) {
      errorResponse(
        res,
        'Current password is incorrect',
        401
      );
      return;
    }

    // Save new password.
    // The User model's pre-save hook
    // will hash it automatically.
    user.password = newPassword;

    await user.save();

    successResponse(
      res,
      'Password changed successfully',
      null,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Failed to change password',
      500,
      error
    );
  }
};

// ============================================
// Logout user
// ============================================
//
// JWT is stateless. The client removes the
// stored token.
//

export const logout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    successResponse(
      res,
      'Logout successful',
      null,
      200
    );
  } catch (error) {
    errorResponse(
      res,
      'Logout failed',
      500,
      error
    );
  }
};