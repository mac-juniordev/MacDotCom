// ============================================
// UPLOAD SERVICE
// Helper functions for file management
// ============================================

import fs from 'fs-extra';
import path from 'path';
import { UPLOAD_DIR } from '../config/storage';

// Delete a file from uploads folder
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    // Build full file path
    const fullPath = path.join(UPLOAD_DIR, filePath.replace('/uploads/', ''));
    
    // Check if file exists
    if (await fs.pathExists(fullPath)) {
      // Delete file
      await fs.remove(fullPath);
      console.log(`File deleted: ${filePath}`);
    }
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
  }
};

// Delete multiple files
export const deleteFiles = async (filePaths: string[]): Promise<void> => {
  try {
    // Delete each file
    for (const filePath of filePaths) {
      await deleteFile(filePath);
    }
  } catch (error) {
    console.error('Failed to delete files', error);
  }
};

// Get file info
export const getFileInfo = async (filePath: string): Promise<any> => {
  try {
    // Build full file path
    const fullPath = path.join(UPLOAD_DIR, filePath.replace('/uploads/', ''));
    
    // Check if file exists
    if (await fs.pathExists(fullPath)) {
      // Get file stats
      const stats = await fs.stat(fullPath);
      
      return {
        exists: true,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error(`Failed to get file info: ${filePath}`, error);
    return { exists: false };
  }
};

// Clean temp files older than 1 hour
export const cleanTempFiles = async (): Promise<void> => {
  try {
    const tempDir = path.join(UPLOAD_DIR, 'temp');
    
    // Check if temp directory exists
    if (await fs.pathExists(tempDir)) {
      // Read all files in temp directory
      const files = await fs.readdir(tempDir);
      
      // Get current time
      const now = Date.now();
      
      // Check each file
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        // Delete if older than 1 hour
        if (now - stats.mtime.getTime() > 3600000) {
          await fs.remove(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Failed to clean temp files', error);
  }
};