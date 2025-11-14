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

/**
 * Update client's assigned coach
 * @param {string} clientId - Client profile ID
 * @param {string} coachId - Coach ID to assign
 * @returns {Promise<Object>} Updated client profile
 */
export async function updateClientCoach(clientId, coachId) {
  try {
    const { data, error } = await supabase
      .from('coachpro_client_profiles')
      .update({ coach_id: coachId })
      .eq('id', clientId)
      .select('*')
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('Nepodařilo se aktualizovat profil klientky');
    }

    return data[0];
  } catch (error) {
    console.error('Error updating client coach:', error);
    throw error;
  }
}

/**
 * Auto-assign coach to client if they don't have one yet
 * Called when client uses a share code (material/program/cards)
 * @param {string} clientId - Client profile ID
 * @param {string} coachId - Coach ID from the shared content
 * @returns {Promise<boolean>} True if assigned, false if already had a coach
 */
export async function autoAssignCoachIfNeeded(clientId, coachId) {
  if (!clientId || !coachId) return false;

  try {
    // Check if client already has a coach
    const { data: profile, error: fetchError } = await supabase
      .from('coachpro_client_profiles')
      .select('coach_id')
      .eq('id', clientId)
      .limit(1);

    if (fetchError) throw fetchError;

    if (!profile || profile.length === 0) {
      console.warn('Client profile not found:', clientId);
      return false;
    }

    // If client already has a coach, don't override
    if (profile[0].coach_id) {
      return false;
    }

    // Assign coach
    await updateClientCoach(clientId, coachId);
    return true;
  } catch (error) {
    console.error('Error auto-assigning coach:', error);
    return false;
  }
}

/**
 * Get all coaches working with a client (from sessions, materials, programs)
 * @param {string} clientId - Client profile ID
 * @returns {Promise<Array>} Array of coaches with activity context
 */
export async function getClientCoaches(clientId) {
  if (!clientId) return [];

  try {
    const coachesMap = new Map();

    // 1. Load coaches from scheduled sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('coachpro_sessions')
      .select('coach_id')
      .eq('client_id', clientId)
      .eq('status', 'scheduled');

    if (!sessionsError && sessions) {
      sessions.forEach(session => {
        if (session.coach_id) {
          if (!coachesMap.has(session.coach_id)) {
            coachesMap.set(session.coach_id, { hasSessions: false, hasMaterials: false, hasPrograms: false });
          }
          coachesMap.get(session.coach_id).hasSessions = true;
        }
      });
    }

    // 2. Load coaches from shared materials
    const { data: materials, error: materialsError } = await supabase
      .from('coachpro_shared_materials')
      .select('coach_id')
      .eq('client_id', clientId);

    if (!materialsError && materials) {
      materials.forEach(material => {
        if (material.coach_id) {
          if (!coachesMap.has(material.coach_id)) {
            coachesMap.set(material.coach_id, { hasSessions: false, hasMaterials: false, hasPrograms: false });
          }
          coachesMap.get(material.coach_id).hasMaterials = true;
        }
      });
    }

    // 3. Load coaches from programs (future - add when programs table exists)
    // TODO: Add programs query when implemented

    // 4. Fetch full coach details for all unique coach IDs
    const coachIds = Array.from(coachesMap.keys());
    if (coachIds.length === 0) {
      return [];
    }

    const { data: coaches, error: coachesError } = await supabase
      .from('coachpro_coaches')
      .select('*')
      .in('id', coachIds);

    if (coachesError) throw coachesError;

    // 5. Combine coach data with activity context
    return (coaches || []).map(coach => ({
      ...coach,
      activities: coachesMap.get(coach.id),
    }));

  } catch (error) {
    console.error('Error fetching client coaches:', error);
    return [];
  }
}
