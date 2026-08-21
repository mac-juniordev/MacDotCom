// ============================================
// UPLOAD SERVICE
// Cloudinary-based file management
// ============================================

import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

// ============================================
// Upload a file to Cloudinary
// ============================================

export const uploadFile = async (
  file: Express.Multer.File,
  folder: string = 'portfolio'
): Promise<UploadApiResponse> => {
  if (!file?.buffer) {
    throw new Error('No file buffer provided');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(
            new Error(
              'Cloudinary upload returned no result'
            )
          );
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};

// ============================================
// Extract Cloudinary public ID from URL
// ============================================

const getPublicIdFromUrl = (
  fileUrl: string
): string | null => {
  try {
    if (
      !fileUrl ||
      !fileUrl.includes('cloudinary.com')
    ) {
      return null;
    }

    const url = new URL(fileUrl);

    const uploadIndex =
      url.pathname.indexOf('/upload/');

    if (uploadIndex === -1) {
      return null;
    }

    let publicPath = url.pathname.substring(
      uploadIndex + '/upload/'.length
    );

    // Remove transformation segments.
    const segments = publicPath.split('/');

    while (
      segments.length > 0 &&
      (
        segments[0].startsWith('w_') ||
        segments[0].startsWith('h_') ||
        segments[0].startsWith('c_') ||
        segments[0].startsWith('q_') ||
        segments[0].startsWith('f_') ||
        segments[0].startsWith('g_') ||
        segments[0].startsWith('ar_') ||
        segments[0].startsWith('dpr_') ||
        segments[0].startsWith('e_')
      )
    ) {
      segments.shift();
    }

    publicPath = segments.join('/');

    // Remove Cloudinary version.
    publicPath = publicPath.replace(
      /^v\d+\//,
      ''
    );

    // Remove file extension.
    publicPath = publicPath.replace(
      /\.[^/.]+$/,
      ''
    );

    return publicPath || null;
  } catch (error) {
    console.error(
      'Failed to extract Cloudinary public ID:',
      error
    );

    return null;
  }
};

// ============================================
// Delete a Cloudinary resource
// ============================================

export const deleteFile = async (
  fileUrl: string,
  resourceType:
    | 'image'
    | 'raw'
    | 'video' = 'image'
): Promise<void> => {
  try {
    const publicId =
      getPublicIdFromUrl(fileUrl);

    if (!publicId) {
      console.warn(
        `Could not determine Cloudinary public ID: ${fileUrl}`
      );
      return;
    }

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
        invalidate: true,
      }
    );

    console.log(
      `Cloudinary file deleted: ${publicId}`
    );
  } catch (error) {
    console.error(
      `Failed to delete Cloudinary file: ${fileUrl}`,
      error
    );
  }
};

// ============================================
// Delete multiple Cloudinary files
// ============================================

export const deleteFiles = async (
  fileUrls: string[],
  resourceType:
    | 'image'
    | 'raw'
    | 'video' = 'image'
): Promise<void> => {
  await Promise.all(
    fileUrls.map((fileUrl) =>
      deleteFile(fileUrl, resourceType)
    )
  );
};

// ============================================
// Get Cloudinary file information
// ============================================

export const getFileInfo = async (
  fileUrl: string,
  resourceType:
    | 'image'
    | 'raw'
    | 'video' = 'image'
): Promise<{
  exists: boolean;
  publicId?: string;
  secureUrl?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  createdAt?: string;
}> => {
  try {
    const publicId =
      getPublicIdFromUrl(fileUrl);

    if (!publicId) {
      return { exists: false };
    }

    const resource =
      await cloudinary.api.resource(
        publicId,
        {
          resource_type: resourceType,
        }
      );

    return {
      exists: true,
      publicId: resource.public_id,
      secureUrl: resource.secure_url,
      format: resource.format,
      bytes: resource.bytes,
      width: resource.width,
      height: resource.height,
      createdAt: resource.created_at,
    };
  } catch (error: any) {
    if (error?.http_code === 404) {
      return { exists: false };
    }

    console.error(
      `Failed to get Cloudinary file info: ${fileUrl}`,
      error
    );

    return { exists: false };
  }
};

// ============================================
// Get Cloudinary public ID
// ============================================

export const getCloudinaryPublicId = (
  fileUrl: string
): string | null => {
  return getPublicIdFromUrl(fileUrl);
};

// ============================================
// Backwards-compatible cleanup function
// ============================================

export const cleanTempFiles =
  async (): Promise<void> => {
    // No local filesystem cleanup is required.
    // Cloudinary is the persistent file storage.
  };

// ============================================
// Export
// ============================================

export default {
  uploadFile,
  deleteFile,
  deleteFiles,
  getFileInfo,
  getCloudinaryPublicId,
  cleanTempFiles,
};