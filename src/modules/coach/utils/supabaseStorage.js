import { supabase } from '@shared/config/supabase';
import { generateUUID } from './generateCode';

/**
 * Sanitize filename for storage
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  // Remove file extension
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;

  // Transliterate Czech characters
  const translitMap = {
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n',
    'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
    'Á': 'a', 'Č': 'c', 'Ď': 'd', 'É': 'e', 'Ě': 'e', 'Í': 'i', 'Ň': 'n',
    'Ó': 'o', 'Ř': 'r', 'Š': 's', 'Ť': 't', 'Ú': 'u', 'Ů': 'u', 'Ý': 'y', 'Ž': 'z'
  };

  let sanitized = nameWithoutExt
    .split('')
    .map(char => translitMap[char] || char)
    .join('');

  // Convert to lowercase, replace spaces and underscores with dashes
  sanitized = sanitized.toLowerCase().replace(/[\s_]+/g, '-');

  // Remove all non-alphanumeric characters except dashes
  sanitized = sanitized.replace(/[^a-z0-9-]/g, '');

  // Remove multiple consecutive dashes
  sanitized = sanitized.replace(/-+/g, '-');

  // Remove leading/trailing dashes
  sanitized = sanitized.replace(/^-+|-+$/g, '');

  // Limit length
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }

  return sanitized || 'file';
};

/**
 * Upload file to Supabase Storage
 * @param {File} file - File to upload
 * @param {string} coachId - Coach ID for folder organization
 * @param {string} type - Material type (audio, pdf, document, etc.)
 * @returns {Promise<{path: string, url: string}>}
 */
export const uploadFileToSupabase = async (file, coachId, type) => {
  try {
    const fileExt = file.name.split('.').pop();
    const sanitizedName = sanitizeFilename(file.name);
    const uuid = generateUUID();
    const shortHash = uuid.substring(0, 8);
    const fileName = `${sanitizedName}-${shortHash}.${fileExt}`;
    const filePath = `${coachId}/${type}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('materials-coach')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('materials-coach')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - Path to file in storage
 */
export const deleteFileFromSupabase = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('materials-coach')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    // Don't throw - just log, so we don't block material deletion
  }
};

/**
 * Get public URL for a file
 * @param {string} filePath - Path to file in storage
 * @returns {string}
 */
export const getFileUrl = (filePath) => {
  const { data } = supabase.storage
    .from('materials-coach')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url !== 'https://your-project.supabase.co' && key !== 'your-anon-key-here');
};

export default {
  uploadFileToSupabase,
  deleteFileFromSupabase,
  getFileUrl,
  isSupabaseConfigured
};
