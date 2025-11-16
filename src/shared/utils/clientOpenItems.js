/**
 * Client Open Items Utilities
 * Functions to fetch "open" or "in-progress" items for client dashboard
 */

import { getSharedPrograms, getSharedMaterials } from '@modules/coach/utils/storage';
import { supabase } from '@shared/config/supabase';

/**
 * Get open (in-progress) programs for a client
 * Open = not completed, has some progress
 * @param {string} clientEmail - Client email address
 * @param {string} clientId - Client profile ID (for loading completion status)
 * @returns {Promise<Array>} Array of open programs
 */
export async function getOpenPrograms(clientEmail, clientId) {
  if (!clientEmail) return [];

  try {
    const sharedPrograms = await getSharedPrograms(null, clientEmail);

    // Deduplicate by program_id
    const uniquePrograms = [];
    const seenProgramIds = new Set();

    sharedPrograms.forEach((sharedProgram) => {
      const programId = sharedProgram.programId || sharedProgram.program?.id;
      if (programId && !seenProgramIds.has(programId)) {
        seenProgramIds.add(programId);
        uniquePrograms.push(sharedProgram);
      }
    });

    // Load all client records for this client from Supabase to check completion status
    let completedProgramCodes = new Set();

    if (clientId) {
      try {
        console.log('🔍 [getOpenPrograms] Checking completion status for clientId:', clientId);
        console.log('🔍 LIKE pattern:', `${clientId}_%`);

        // Since id is composite (clientId_programCode), we need to query using LIKE pattern
        const { data: clientRecords, error } = await supabase
          .from('coachpro_clients')
          .select('program_code, completed_at, id')
          .like('id', `${clientId}_%`)
          .not('completed_at', 'is', null);

        console.log('📊 Query result:', { clientRecords, error });

        if (!error && clientRecords) {
          clientRecords.forEach(record => {
            console.log('✅ Found completed program:', record.program_code, 'at', record.completed_at);
            if (record.program_code) {
              completedProgramCodes.add(record.program_code);
            }
          });
        }

        console.log('📋 All completed program codes:', Array.from(completedProgramCodes));
      } catch (err) {
        console.error('Error loading client completion status:', err);
      }
    }

    // Filter for "open" programs:
    // - Exclude programs that are marked as completed in coachpro_clients
    const openPrograms = uniquePrograms.filter((program) => {
      const isCompleted = completedProgramCodes.has(program.shareCode);
      console.log(`🔍 Program ${program.shareCode}: isCompleted=${isCompleted}`);
      return !isCompleted;
    });

    console.log(`📊 Filtered: ${uniquePrograms.length} total → ${openPrograms.length} open programs`);

    // Sort by most recent activity (or creation date)
    openPrograms.sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt || '';
      const dateB = b.updatedAt || b.createdAt || '';
      return dateB.localeCompare(dateA);
    });

    // Return max 3 most recent
    return openPrograms.slice(0, 3);
  } catch (error) {
    console.error('Error fetching open programs:', error);
    return [];
  }
}

/**
 * Get recently shared materials for a client
 * @param {string} clientEmail - Client email address
 * @returns {Promise<Array>} Array of recent materials (max 3)
 */
export async function getRecentMaterials(clientEmail) {
  if (!clientEmail) return [];

  try {
    const sharedMaterials = await getSharedMaterials(null, clientEmail);

    // Deduplicate by material_id
    const uniqueMaterials = [];
    const seenMaterialIds = new Set();

    sharedMaterials.forEach((sharedMaterial) => {
      const materialId = sharedMaterial.materialId || sharedMaterial.material?.id;
      if (materialId && !seenMaterialIds.has(materialId)) {
        seenMaterialIds.add(materialId);
        uniqueMaterials.push(sharedMaterial);
      }
    });

    // Sort by creation date (most recent first)
    uniqueMaterials.sort((a, b) => {
      const dateA = a.createdAt || '';
      const dateB = b.createdAt || '';
      return dateB.localeCompare(dateA);
    });

    // Return max 3 most recent
    return uniqueMaterials.slice(0, 3);
  } catch (error) {
    console.error('Error fetching recent materials:', error);
    return [];
  }
}

/**
 * Get upcoming sessions for a client
 * @param {string} clientId - Client profile ID
 * @returns {Promise<Array>} Array of upcoming sessions (max 3)
 */
export async function getUpcomingSessions(clientId) {
  if (!clientId) return [];

  try {
    const { data, error } = await supabase
      .from('coachpro_sessions')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'scheduled')
      .gte('session_date', new Date().toISOString())
      .order('session_date', { ascending: true })
      .limit(3);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    return [];
  }
}

/**
 * Get all "open" items for client dashboard
 * @param {string} clientId - Client profile ID
 * @param {string} clientEmail - Client email address
 * @returns {Promise<Object>} Object with arrays of open items
 */
export async function getClientOpenItems(clientId, clientEmail) {
  if (!clientId && !clientEmail) {
    return {
      openPrograms: [],
      recentMaterials: [],
      upcomingSessions: [],
    };
  }

  try {
    // Run all queries in parallel for better performance
    const [openPrograms, recentMaterials, upcomingSessions] = await Promise.all([
      clientEmail ? getOpenPrograms(clientEmail, clientId) : Promise.resolve([]),
      clientEmail ? getRecentMaterials(clientEmail) : Promise.resolve([]),
      clientId ? getUpcomingSessions(clientId) : Promise.resolve([]),
    ]);

    return {
      openPrograms,
      recentMaterials,
      upcomingSessions,
    };
  } catch (error) {
    console.error('Error fetching client open items:', error);
    return {
      openPrograms: [],
      recentMaterials: [],
      upcomingSessions: [],
    };
  }
}
