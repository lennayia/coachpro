/**
 * Coaches Utilities
 * Modular functions for fetching and managing coaches data
 */

import { supabase } from '@shared/config/supabase';

/**
 * Get all coaches from the database
 * @returns {Promise<Array>} Array of coach objects
 */
export async function getAllCoaches() {
  try {
    const { data, error } = await supabase
      .from('coachpro_coaches')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching coaches:', error);
    throw error;
  }
}

/**
 * Get a single coach by ID
 * @param {string} coachId - Coach ID
 * @returns {Promise<Object|null>} Coach object or null
 */
export async function getCoachById(coachId) {
  try {
    const { data, error } = await supabase
      .from('coachpro_coaches')
      .select('*')
      .eq('id', coachId)
      .limit(1);

    if (error) throw error;

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching coach:', error);
    throw error;
  }
}

/**
 * Get active coaches (non-testers, can be filtered)
 * @param {Object} options - Filter options
 * @param {boolean} options.excludeTesters - Exclude testers from results (default: true)
 * @returns {Promise<Array>} Array of active coach objects
 */
export async function getActiveCoaches({ excludeTesters = true } = {}) {
  try {
    let query = supabase
      .from('coachpro_coaches')
      .select('*')
      .order('name', { ascending: true });

    if (excludeTesters) {
      query = query.eq('is_tester', false);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching active coaches:', error);
    throw error;
  }
}

/**
 * Format phone number for display (Czech format)
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';

  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');

  // Format as +420 XXX XXX XXX
  if (cleaned.startsWith('+420')) {
    const digits = cleaned.substring(4);
    return `+420 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }

  return phone;
}

/**
 * Get coach's initials for avatar
 * @param {string} name - Coach name
 * @returns {string} Initials (max 2 characters)
 */
export function getCoachInitials(name) {
  if (!name) return '';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
