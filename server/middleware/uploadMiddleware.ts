// ============================================
// UPLOAD MIDDLEWARE
// Handles file uploads using memory storage
// for Cloudinary / Vercel
// ============================================

import multer from 'multer';
import {
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from '../config/storage';

// ============================================
// Memory storage
// ============================================
//
// IMPORTANT:
// Do NOT use diskStorage() on Vercel.
//
// Vercel serverless functions have an ephemeral
// filesystem. Files uploaded with multer are
// therefore kept in memory and then sent directly
// to Cloudinary.
//

const storage = multer.memoryStorage();

// ============================================
// File filter
// ============================================

const fileFilter: multer.Options['fileFilter'] = (
  _req,
  file,
  cb
) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      `File type ${file.mimetype} is not allowed`
    )
  );
};

// ============================================
// Multer instance
// ============================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// ============================================
// Upload one file
// ============================================

export const uploadSingle = (fieldName: string) => {
  return upload.single(fieldName);
};

// ============================================
// Upload multiple files
// ============================================

export const uploadMultiple = (
  fieldName: string,
  maxCount: number = 5
) => {
  return upload.array(fieldName, maxCount);
};

// ============================================
// Upload multiple named fields
// ============================================

export const uploadFields = (
  fields: {
    name: string;
    maxCount: number;
  }[]
) => {
  return upload.fields(fields);
};

// ============================================
// Default export
// ============================================

export default upload;