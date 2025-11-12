/**
 * Avatar Helper - Get user's display photo
 *
 * Priority:
 * 1. Custom uploaded photo (profile.photo_url)
 * 2. Google OAuth photo (user.user_metadata.avatar_url)
 * 3. null (fallback to initials/placeholder)
 *
 * @param {Object} profile - User profile object
 * @param {Object} user - Supabase auth user object
 * @returns {string|null} - Photo URL or null
 */
export const getUserPhotoUrl = (profile, user) => {
  // Priority 1: Custom uploaded photo
  if (profile?.photo_url) {
    return profile.photo_url;
  }

  // Priority 2: Google OAuth photo
  if (user?.user_metadata?.avatar_url) {
    return user.user_metadata.avatar_url;
  }

  // Priority 3: No photo
  return null;
};

/**
 * Get user's initials for avatar placeholder
 * @param {string} name - User's full name
 * @returns {string} - Initials (e.g., "JD" for "John Doe")
 */
export const getUserInitials = (name) => {
  if (!name) return '?';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
