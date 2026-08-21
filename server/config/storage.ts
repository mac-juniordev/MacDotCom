// ============================================
// STORAGE CONFIGURATION
// This file sets up local file storage settings
// ============================================

import path from 'path';
import fs from 'fs-extra';

// Get the root directory of our server
const rootDir = path.resolve(__dirname, '..');

// Define where uploads will be stored
export const UPLOAD_DIR = path.join(rootDir, 'uploads');

// Define subdirectories for different upload types
export const UPLOAD_PATHS = {
  projects: path.join(UPLOAD_DIR, 'projects'),
  products: path.join(UPLOAD_DIR, 'products'),
  skills: path.join(UPLOAD_DIR, 'skills'),
  resume: path.join(UPLOAD_DIR, 'resume'),
  testimonials: path.join(UPLOAD_DIR, 'testimonials'),
  temp: path.join(UPLOAD_DIR, 'temp'),
};

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

// Allowed document types
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// All allowed types combined
export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
];

// Function to ensure all upload directories exist
export const ensureUploadDirectories = (): void => {
  // Loop through all upload paths
  Object.values(UPLOAD_PATHS).forEach((dir) => {
    // Create directory if it doesn't exist
    fs.ensureDirSync(dir);
  });
  console.log('Upload directories ready');
};

// Function to get public URL for a file
export const getFileUrl = (filePath: string): string => {
  // Remove the root directory from path
  const relativePath = filePath.replace(rootDir, '');
  
  // Convert backslashes to forward slashes (for Windows)
  const normalizedPath = relativePath.replace(/\\/g, '/');
  
  // Return URL path
  return normalizedPath;
};

// Function to generate unique filename
export const generateUniqueFilename = (originalName: string): string => {
  // Get file extension
  const extension = path.extname(originalName);
  
  // Generate timestamp
  const timestamp = Date.now();
  
  // Generate random string
  const randomString = Math.random().toString(36).substring(2, 10);
  
  // Return unique filename
  return `${timestamp}-${randomString}${extension}`;
};

// Export default object with all functions
export default {
  UPLOAD_DIR,
  UPLOAD_PATHS,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_FILE_TYPES,
  ensureUploadDirectories,
  getFileUrl,
  generateUniqueFilename,
};
