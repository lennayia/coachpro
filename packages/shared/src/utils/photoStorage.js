/**
 * photoStorage.js - Supabase Storage utilities for photos
 *
 * Factory function that creates photo storage utilities
 * Module must provide supabaseClient
 *
 * Features:
 * - Upload photos to specific buckets
 * - Delete photos from storage
 * - Get public URLs
 * - Generate unique file names
 *
 * @param {object} supabaseClient - Supabase client instance
 * @returns {object} Photo storage utilities
 *
 * @example
 * import { supabase } from '@/config/supabase';
 * import { createPhotoStorage } from '@proapp/shared/utils';
 *
 * const { uploadPhoto, deletePhoto, PHOTO_BUCKETS } = createPhotoStorage(supabaseClient);
 *
 * const { url } = await uploadPhoto(file, {
 *   bucket: PHOTO_BUCKETS.CLIENT_PHOTOS,
 *   userId: profile.id
 * });
 */
export function createPhotoStorage(supabaseClient) {
  if (!supabaseClient) {
    throw new Error('createPhotoStorage: supabaseClient is required');
  }

  /**
   * Upload photo to Supabase Storage
   *
   * @param {Blob|File} file - Photo file to upload (preferably WebP)
   * @param {Object} options - Upload options
   * @param {string} options.bucket - Storage bucket name (e.g., 'client-photos')
   * @param {string} options.userId - User ID for folder organization
   * @param {string} options.fileName - Optional custom file name
   * @param {boolean} options.upsert - Allow overwriting existing files (default: true)
   * @returns {Promise<{url: string, path: string}>} - Public URL and storage path
   */
  const uploadPhoto = async (file, options = {}) => {
    const {
      bucket,
      userId,
      fileName,
      upsert = true,
    } = options;

    if (!bucket) {
      throw new Error('Bucket name is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Generate file path
    const timestamp = Date.now();
    const extension = file.name?.split('.').pop() || 'webp';
    const finalFileName = fileName || `photo-${timestamp}.${extension}`;
    const filePath = `${userId}/${finalFileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
    };
  };

  /**
   * Delete photo from Supabase Storage
   *
   * @param {string} photoUrl - Full public URL of the photo
   * @param {string} bucket - Storage bucket name
   * @returns {Promise<void>}
   */
  const deletePhoto = async (photoUrl, bucket) => {
    if (!photoUrl) {
      throw new Error('Photo URL is required');
    }

    if (!bucket) {
      throw new Error('Bucket name is required');
    }

    // Extract file path from URL
    const urlParts = photoUrl.split(`/${bucket}/`);

    if (urlParts.length < 2) {
      throw new Error('Invalid photo URL format');
    }

    const filePath = urlParts[1];

    // Delete from Supabase Storage
    const { error } = await supabaseClient.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  };

  /**
   * Update photo (delete old, upload new)
   *
   * @param {Blob|File} newFile - New photo file
   * @param {string} oldPhotoUrl - URL of old photo to delete (can be null)
   * @param {Object} options - Upload options (same as uploadPhoto)
   * @returns {Promise<{url: string, path: string}>}
   */
  const updatePhoto = async (newFile, oldPhotoUrl, options) => {
    const { bucket } = options;

    // Delete old photo if exists
    if (oldPhotoUrl) {
      try {
        await deletePhoto(oldPhotoUrl, bucket);
      } catch (err) {
        console.warn('Failed to delete old photo:', err);
        // Continue with upload even if delete fails
      }
    }

    // Upload new photo
    return await uploadPhoto(newFile, options);
  };

  /**
   * Get photo URL from storage path
   *
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path in storage
   * @returns {string} - Public URL
   */
  const getPhotoUrl = (bucket, path) => {
    if (!bucket || !path) {
      return null;
    }

    const { data: { publicUrl } } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  };

  /**
   * Check if photo exists in storage
   *
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path in storage
   * @returns {Promise<boolean>}
   */
  const photoExists = async (bucket, path) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .list(path.split('/')[0], {
          search: path.split('/')[1],
        });

      if (error) return false;

      return data && data.length > 0;
    } catch (err) {
      return false;
    }
  };

  return {
    uploadPhoto,
    deletePhoto,
    updatePhoto,
    getPhotoUrl,
    photoExists,
  };
}

/**
 * Common bucket names (for reference)
 * Note: These are CoachPro-specific. Other modules should define their own.
 */
export const PHOTO_BUCKETS = {
  CLIENT_PHOTOS: 'client-photos',
  COACH_PHOTOS: 'coach-photos',
  MATERIAL_IMAGES: 'material-images',
  PROGRAM_IMAGES: 'program-images',
};
