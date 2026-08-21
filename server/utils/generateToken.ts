// ============================================
// JWT TOKEN UTILITIES
// Creates and verifies authentication tokens
// ============================================

import jwt from 'jsonwebtoken';

// ============================================
// Token payload
// ============================================

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

// ============================================
// JWT configuration
// ============================================

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is not configured'
    );
  }

  return secret;
};

const JWT_EXPIRE =
  process.env.JWT_EXPIRE || '30d';

// ============================================
// Generate access token
// ============================================

export const generateToken = (
  payload: TokenPayload
): string => {
  const token = jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn: JWT_EXPIRE,
    } as jwt.SignOptions
  );

  return token;
};

// ============================================
// Verify access token
// ============================================

export const verifyToken = (
  token: string
): TokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      getJwtSecret()
    );

    if (
      typeof decoded !== 'object' ||
      decoded === null
    ) {
      return null;
    }

    if (
      typeof decoded.id !== 'string' ||
      typeof decoded.email !== 'string' ||
      typeof decoded.role !== 'string'
    ) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

// ============================================
// Decode token without verification
// ============================================
//
// WARNING:
// This function must NEVER be used for
// authorization decisions.
//

export const decodeToken = (
  token: string
): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token);

    if (
      typeof decoded !== 'object' ||
      decoded === null
    ) {
      return null;
    }

    if (
      typeof decoded.id !== 'string' ||
      typeof decoded.email !== 'string' ||
      typeof decoded.role !== 'string'
    ) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

// ============================================
// Generate refresh token
// ============================================

export const generateRefreshToken = (
  payload: TokenPayload
): string => {
  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn: '60d',
    } as jwt.SignOptions
  );
};

// ============================================
// Extract Bearer token
// ============================================

export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader
    .slice(7)
    .trim();

  return token || null;
};

// ============================================
// Default export
// ============================================

export default generateToken;