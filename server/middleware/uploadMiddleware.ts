// ============================================
// UPLOAD MIDDLEWARE
// Handles file uploads with Multer
// ============================================

import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { UPLOAD_PATHS, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../config/storage';

// Configure storage for different upload types
const storage = multer.diskStorage({
  // Set destination folder
  destination: (req, file, cb) => {
    let uploadPath = UPLOAD_PATHS.temp;

    // Determine folder based on route
    if (req.originalUrl.includes('/projects')) {
      uploadPath = UPLOAD_PATHS.projects;
    } else if (req.originalUrl.includes('/products')) {
      uploadPath = UPLOAD_PATHS.products;
    } else if (req.originalUrl.includes('/skills')) {
      uploadPath = UPLOAD_PATHS.skills;
    } else if (req.originalUrl.includes('/resume')) {
      uploadPath = UPLOAD_PATHS.resume;
    } else if (req.originalUrl.includes('/testimonials')) {
      uploadPath = UPLOAD_PATHS.testimonials;
    }

    // Ensure directory exists
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },

  // Set filename
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// File filter to check file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file type is allowed
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Export different upload middleware
export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => upload.array(fieldName, maxCount);
export const uploadFields = (fields: { name: string; maxCount: number }[]) => upload.fields(fields);

// Export default upload
export default upload;