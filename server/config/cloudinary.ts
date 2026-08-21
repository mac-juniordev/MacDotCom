// ============================================
// CLOUDINARY CONFIGURATION
// Cloudinary is used for persistent file storage
// ============================================

import { v2 as cloudinary } from 'cloudinary';

// ============================================
// Validate required environment variables
// ============================================

const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY;

const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET;

if (
  !CLOUDINARY_CLOUD_NAME ||
  !CLOUDINARY_API_KEY ||
  !CLOUDINARY_API_SECRET
) {
  throw new Error(
    'Cloudinary environment variables are not configured'
  );
}

// ============================================
// Configure Cloudinary
// ============================================

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// ============================================
// Export
// ============================================

export default cloudinary;