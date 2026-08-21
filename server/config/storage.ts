// ============================================
// STORAGE CONFIGURATION
// Cloudinary-based file storage
// ============================================

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ============================================
// ALLOWED IMAGE TYPES
// ============================================

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

// ============================================
// ALLOWED DOCUMENT TYPES
// ============================================

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// ============================================
// ALL ALLOWED FILE TYPES
// ============================================

export const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
];

// ============================================
// FILE TYPE CHECK
// ============================================

export const isAllowedFileType = (
  mimetype: string
): boolean => {
  return ALLOWED_FILE_TYPES.includes(mimetype);
};

// ============================================
// IMAGE TYPE CHECK
// ============================================

export const isAllowedImageType = (
  mimetype: string
): boolean => {
  return ALLOWED_IMAGE_TYPES.includes(mimetype);
};

// ============================================
// DOCUMENT TYPE CHECK
// ============================================

export const isAllowedDocumentType = (
  mimetype: string
): boolean => {
  return ALLOWED_DOCUMENT_TYPES.includes(mimetype);
};

// ============================================
// EXPORT
// ============================================

export default {
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_FILE_TYPES,
  isAllowedFileType,
  isAllowedImageType,
  isAllowedDocumentType,
};