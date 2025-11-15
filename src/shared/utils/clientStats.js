/**
 * Client Statistics Utilities
 * Functions to fetch statistics for client dashboards
 */

import { supabase } from '@shared/config/supabase';

/**
 * Get count of shared materials for a client by their email
 * @param {string} clientEmail - Client email address
 * @returns {Promise<number>} Count of shared materials
 */
export async function getClientMaterialsCount(clientEmail) {
  if (!clientEmail) return 0;

  try {
    const { count, error } = await supabase
      .from('coachpro_shared_materials')
      .select('*', { count: 'exact', head: true })
      .eq('client_email', clientEmail.toLowerCase());

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error fetching client materials count:', error);
    return 0;
  }
}

/**
 * Get count of shared programs for a client by their email
 * @param {string} clientEmail - Client email address
 * @returns {Promise<number>} Count of shared programs
 */
export async function getClientProgramsCount(clientEmail) {
  if (!clientEmail) return 0;

  try {
    const { count, error } = await supabase
      .from('coachpro_shared_programs')
      .select('*', { count: 'exact', head: true })
      .eq('client_email', clientEmail.toLowerCase());

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error fetching client programs count:', error);
    return 0;
  }
}

/**
 * Get count of scheduled sessions for a client
 * @param {string} clientId - Client profile ID
 * @returns {Promise<number>} Count of scheduled sessions
 */
export async function getClientScheduledSessionsCount(clientId) {
  if (!clientId) return 0;

  try {
    const { count, error } = await supabase
      .from('coachpro_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('status', 'scheduled');

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error fetching client scheduled sessions count:', error);
    return 0;
  }
}

/**
 * Get count of completed sessions for a client
 * @param {string} clientId - Client profile ID
 * @returns {Promise<number>} Count of completed sessions
 */
export async function getClientCompletedSessionsCount(clientId) {
  if (!clientId) return 0;

  try {
    const { count, error } = await supabase
      .from('coachpro_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('status', 'completed');

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error fetching client completed sessions count:', error);
    return 0;
  }
}

/**
 * Get all client statistics at once (optimized single call)
 * @param {string} clientId - Client profile ID
 * @param {string} clientEmail - Client email address
 * @returns {Promise<Object>} Object with all counts
 */
export async function getClientStats(clientId, clientEmail) {
  if (!clientId && !clientEmail) {
    return {
      materialsCount: 0,
      programsCount: 0,
      scheduledSessionsCount: 0,
      completedSessionsCount: 0,
    };
  }

  try {
    // Run all queries in parallel for better performance
    const [materialsCount, programsCount, scheduledSessionsCount, completedSessionsCount] = await Promise.all([
      clientEmail ? getClientMaterialsCount(clientEmail) : Promise.resolve(0),
      clientEmail ? getClientProgramsCount(clientEmail) : Promise.resolve(0),
      clientId ? getClientScheduledSessionsCount(clientId) : Promise.resolve(0),
      clientId ? getClientCompletedSessionsCount(clientId) : Promise.resolve(0),
    ]);

    return {
      materialsCount,
      programsCount,
      scheduledSessionsCount,
      completedSessionsCount,
    };
  } catch (error) {
    console.error('Error fetching client stats:', error);
    return {
      materialsCount: 0,
      programsCount: 0,
      scheduledSessionsCount: 0,
      completedSessionsCount: 0,
    };
  }
}
