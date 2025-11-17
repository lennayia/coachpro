/**
 * Public Catalog Utils
 * Functions for accessing coach's public materials/programs
 *
 * @created 16.11.2025
 */

import { supabase } from '@shared/config/supabase';

/**
 * Get all public materials from a coach
 * @param {string} coachId - Coach ID
 * @returns {Promise<Array>} Public materials (lead magnets + paid)
 */
export async function getCoachPublicMaterials(coachId) {
  try {
    const { data, error } = await supabase
      .from('coachpro_materials')
      .select('*')
      .eq('coach_id', coachId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching public materials:', error);
    return [];
  }
}

/**
 * Get all public programs from a coach
 * @param {string} coachId - Coach ID
 * @returns {Promise<Array>} Public programs
 */
export async function getCoachPublicPrograms(coachId) {
  try {
    const { data, error } = await supabase
      .from('coachpro_programs')
      .select('*')
      .eq('coach_id', coachId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching public programs:', error);
    return [];
  }
}

/**
 * Check if client already has access to an item
 * (via share, purchase, or code entry)
 *
 * @param {string} clientEmail - Client email
 * @param {string} itemType - 'material' | 'program'
 * @param {string} itemId - Item ID
 * @returns {Promise<boolean>} True if client has access
 */
export async function hasAccess(clientEmail, itemType, itemId) {
  if (!clientEmail) return false;

  try {
    // Check shared materials/programs
    if (itemType === 'material') {
      const { data } = await supabase
        .from('coachpro_shared_materials')
        .select('id')
        .eq('client_email', clientEmail)
        .eq('material_id', itemId)
        .maybeSingle();

      if (data) return true;
    }

    if (itemType === 'program') {
      const { data } = await supabase
        .from('coachpro_shared_programs')
        .select('id')
        .eq('client_email', clientEmail)
        .eq('program_id', itemId)
        .maybeSingle();

      if (data) return true;
    }

    // Check purchases (lead magnet or paid)
    const { data: purchase } = await supabase
      .from('coachpro_purchases')
      .select('id, access_granted')
      .eq('client_email', clientEmail)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .maybeSingle();

    if (purchase && purchase.access_granted) return true;

    return false;
  } catch (error) {
    console.error('Error checking access:', error);
    return false;
  }
}

/**
 * Get enriched catalog for a coach
 * Combines public materials/programs with access status for current client
 *
 * @param {string} coachId - Coach ID
 * @param {string} clientEmail - Client email (to check access)
 * @returns {Promise<Object>} { materials: [...], programs: [...] }
 */
export async function getEnrichedCatalog(coachId, clientEmail) {
  try {
    // Get public materials & programs
    const [materials, programs] = await Promise.all([
      getCoachPublicMaterials(coachId),
      getCoachPublicPrograms(coachId),
    ]);

    // Check access for each item
    const enrichedMaterials = await Promise.all(
      materials.map(async (material) => ({
        ...material,
        hasAccess: await hasAccess(clientEmail, 'material', material.id),
      }))
    );

    const enrichedPrograms = await Promise.all(
      programs.map(async (program) => ({
        ...program,
        hasAccess: await hasAccess(clientEmail, 'program', program.id),
      }))
    );

    return {
      materials: enrichedMaterials,
      programs: enrichedPrograms,
    };
  } catch (error) {
    console.error('Error getting enriched catalog:', error);
    return { materials: [], programs: [] };
  }
}

/**
 * Format price for display
 * @param {number} price - Price
 * @param {string} currency - Currency code
 * @returns {string} Formatted price (e.g., "299 Kč")
 */
export function formatPrice(price, currency = 'CZK') {
  if (price === null || price === undefined || price === 0) {
    return 'Zdarma';
  }

  const currencySymbols = {
    CZK: 'Kč',
    EUR: '€',
    USD: '$',
  };

  const symbol = currencySymbols[currency] || currency;
  return `${price} ${symbol}`;
}
