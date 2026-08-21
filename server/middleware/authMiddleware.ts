// ============================================
// AUTH MIDDLEWARE
// Protects admin routes
// ============================================

import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/generateToken';
import User from '../models/User';
import { errorResponse } from '../utils/apiResponse';

// Protect routes - requires valid JWT token
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    // Check if token exists
    if (!token) {
      errorResponse(res, 'Not authorized, no token provided', 401);
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if token is valid
    if (!decoded) {
      errorResponse(res, 'Not authorized, invalid token', 401);
      return;
    }

    // Find user from token
    const user = await User.findById(decoded.id);

    // Check if user exists
    if (!user) {
      errorResponse(res, 'Not authorized, user not found', 401);
      return;
    }

    // Attach user to request object
    (req as any).user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Continue to next middleware/controller
    next();
  } catch (error) {
    errorResponse(res, 'Not authorized', 401);
  }
};

// Check if user is owner
export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user exists and role is owner
    if ((req as any).user && (req as any).user.role === 'owner') {
      next();
    } else {
      errorResponse(res, 'Not authorized, owner access only', 403);
    }
  } catch (error) {
    errorResponse(res, 'Authorization failed', 500);
  }
};