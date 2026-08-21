// ============================================
// AUTH MIDDLEWARE
// Protects admin routes
// ============================================

import {
  Request,
  Response,
  NextFunction,
} from 'express';

import {
  verifyToken,
  extractTokenFromHeader,
} from '../utils/generateToken';

import User from '../models/User';

import { errorResponse } from '../utils/apiResponse';

// ============================================
// Protect routes
// Requires a valid JWT token
// ============================================

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const token = extractTokenFromHeader(
      req.headers.authorization
    );

    if (!token) {
      errorResponse(
        res,
        'Not authorized, no token provided',
        401
      );
      return;
    }

    // Verify JWT
    const decoded = verifyToken(token);

    if (!decoded) {
      errorResponse(
        res,
        'Not authorized, invalid token',
        401
      );
      return;
    }

    // Find user in database
    const user = await User.findById(decoded.id);

    if (!user) {
      errorResponse(
        res,
        'Not authorized, user not found',
        401
      );
      return;
    }

    // Attach authenticated user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    errorResponse(
      res,
      'Not authorized',
      401
    );
  }
};

// ============================================
// Check owner access
// ============================================

export const isOwner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === 'owner') {
    next();
    return;
  }

  errorResponse(
    res,
    'Not authorized, owner access only',
    403
  );
};