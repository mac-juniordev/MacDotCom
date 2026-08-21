// ============================================
// AUTH SERVICE
// Authentication helper functions
// ============================================

import User from '../models/User';
import { generateToken } from '../utils/generateToken';

// Create token for user
export const createUserToken = (user: any): string => {
  // Generate JWT token with user info
  return generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
};

// Sanitize user object (remove sensitive data)
export const sanitizeUser = (user: any): any => {
  // Return only safe fields
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    bio: user.bio,
    location: user.location,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
};

// Check if email exists
export const emailExists = async (email: string): Promise<boolean> => {
  // Find user by email
  const user = await User.findOne({ email });
  
  // Return true if user exists
  return !!user;
};

// Get user by email with password
export const getUserWithPassword = async (email: string): Promise<any> => {
  // Find user and include password field
  return await User.findOne({ email }).select('+password');
};