// ============================================
// JWT TOKEN GENERATOR
// Creates secure tokens for authentication
// ============================================

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get JWT secret and expiry from .env
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_this';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

// Interface for token payload
interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

// Function to generate JWT token
export const generateToken = (payload: TokenPayload): string => {
  // Create token with payload
  const token = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE } as jwt.SignOptions
  );
  
  // Return the token
  return token;
};

// Function to verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    // Verify token and return payload
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    // Return null if token is invalid
    return null;
  }
};

// Function to decode token without verification
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    // Decode token without verifying signature
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Function to create refresh token (longer expiry)
export const generateRefreshToken = (payload: TokenPayload): string => {
  // Refresh tokens last longer (60 days)
  const refreshToken = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '60d' } as jwt.SignOptions
  );
  
  return refreshToken;
};

// Function to extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  // Check if header exists
  if (!authHeader) {
    return null;
  }
  
  // Check if header starts with "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];
  
  return token;
};

// Export default
export default generateToken;