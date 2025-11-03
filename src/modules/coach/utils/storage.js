// 💾 Supabase Database utilities pro CoachPro
// Migrated from localStorage to Supabase PostgreSQL (3.11.2025)

import { supabase } from '@shared/config/supabase';

// Keys (kept for backwards compatibility with session storage)
export const STORAGE_KEYS = {
  COACHES: 'coachpro_coaches', // ⚠️ Now using Supabase table, not localStorage
  MATERIALS: 'coachpro_materials', // ⚠️ Now using Supabase table
  PROGRAMS: 'coachpro_programs', // ⚠️ Now using Supabase table
  CLIENTS: 'coachpro_clients', // ⚠️ Now using Supabase table
  SHARED_MATERIALS: 'coachpro_shared_materials', // ⚠️ Now using Supabase table
  CURRENT_USER: 'coachpro_currentUser', // ✅ Still localStorage (session management)
};

// Generic save/load functions
export const saveToStorage = (key, data) => {
  try {
    const jsonString = JSON.stringify(data);

    // Check size (localStorage limit is typically 5-10 MB)
    const sizeInMB = new Blob([jsonString]).size / 1024 / 1024;
    if (sizeInMB > 8) {
      throw new Error(`Data je příliš velká (${sizeInMB.toFixed(2)} MB). Maximální velikost je 8 MB. Zkus menší soubor.`);
    }

    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);

    // Throw error so it can be caught by caller
    if (error.name === 'QuotaExceededError') {
      throw new Error('Úložiště je plné. Smaž některé staré materiály nebo použij menší soubory.');
    }
    throw error;
  }
};

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

// ===== COACHES =====
export const getCoaches = async () => {
  try {
    const { data, error } = await supabase
      .from('coachpro_coaches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching coaches from Supabase:', error);
    // Fallback to localStorage
    return loadFromStorage(STORAGE_KEYS.COACHES, []);
  }
};

export const saveCoach = async (coach) => {
  try {
    // Prepare data - remove any undefined fields
    const coachData = {
      id: coach.id,
      name: coach.name,
      email: coach.email,
      phone: coach.phone || null,
      is_admin: coach.isAdmin || false,
      is_tester: coach.isTester || false,
      tester_id: coach.testerId || null,
      access_code: coach.accessCode || null,
      created_at: coach.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('🔵 Pokouším se uložit coach do Supabase:', coachData);

    const { data, error } = await supabase
      .from('coachpro_coaches')
      .upsert(coachData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error details (saveCoach):', error);
      throw error;
    }

    console.log('✅ Coach úspěšně uložen do Supabase:', data);
    return data;
  } catch (error) {
    console.error('❌ Error saving coach to Supabase:', error);
    // Fallback to localStorage
    const coaches = loadFromStorage(STORAGE_KEYS.COACHES, []);
    const existingIndex = coaches.findIndex(c => c.id === coach.id);
    if (existingIndex >= 0) {
      coaches[existingIndex] = coach;
    } else {
      coaches.push(coach);
    }
    return saveToStorage(STORAGE_KEYS.COACHES, coaches);
  }
};

export const getCoachById = async (id) => {
  // Guard: Return null if ID is undefined or null
  if (!id) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('coachpro_coaches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching coach by ID from Supabase:', error);
    // Fallback to localStorage
    const coaches = loadFromStorage(STORAGE_KEYS.COACHES, []);
    return coaches.find(c => c.id === id);
  }
};

// ===== MATERIALS =====

/**
 * Material Object Schema
 *
 * @typedef {Object} Material
 * @property {string} id - UUID
 * @property {string} coachId - ID kouče
 * @property {string} type - 'audio' | 'video' | 'pdf' | 'image' | 'document' | 'text' | 'link'
 * @property {string} title - Název materiálu
 * @property {string} description - Popis materiálu
 * @property {string} content - Base64 string, Supabase URL nebo link URL
 * @property {string} category - 'meditation' | 'affirmation' | 'exercise' | 'reflection' | 'other'
 *
 * // Coaching Taxonomy (NOVÉ od Session 12):
 * @property {string} coachingArea - Oblast koučinku (POVINNÉ) - 'life' | 'career' | 'relationship' | 'health' | 'financial' | 'spiritual' | 'parenting' | 'other'
 * @property {string[]} [topics] - Témata (VOLITELNÉ, doporučeno 3-5) - např. ['Sebevědomí', 'Motivace']
 * @property {string} [coachingStyle] - Škola/přístup (VOLITELNÉ) - 'icf' | 'nlp' | 'ontological' | 'positive' | 'mindfulness' | 'systemic' | 'integrative' | 'general'
 * @property {string} [coachingAuthority] - Koučovací škola/certifikace (VOLITELNÉ) - 'icf' | 'emcc' | 'ac' | 'erickson' | 'cti' | 'nlp-university' | 'ipec' | 'coaching-center' | 'institut-systemickeho-koucovani' | 'other' | 'none'
 *
 * // File-based materials:
 * @property {number} [duration] - Délka v sekundách (audio/video)
 * @property {number} [fileSize] - Velikost v bytes
 * @property {string} [fileName] - Původní název souboru
 * @property {number} [pageCount] - Počet stran (PDF/text)
 * @property {string} [storagePath] - Supabase storage path
 *
 * // Link-specific:
 * @property {string} [linkType] - 'youtube' | 'spotify' | 'google-drive' | ...
 * @property {Object} [linkMeta] - { icon, label, color, embedSupport }
 * @property {string} [thumbnail] - URL náhledu (YouTube)
 *
 * @property {string} createdAt - ISO timestamp
 * @property {string} [updatedAt] - ISO timestamp (při editaci)
 */

// Helper: Convert material from DB (snake_case) to JS (camelCase)
const convertMaterialFromDB = (dbMaterial) => {
  if (!dbMaterial) return null;
  return {
    id: dbMaterial.id,
    coachId: dbMaterial.coach_id,
    type: dbMaterial.type,
    title: dbMaterial.title,
    description: dbMaterial.description,
    content: dbMaterial.content,
    category: dbMaterial.category,
    fileName: dbMaterial.file_name,
    fileSize: dbMaterial.file_size,
    pageCount: dbMaterial.page_count,
    duration: dbMaterial.duration,
    storagePath: dbMaterial.storage_path,
    linkType: dbMaterial.link_type,
    linkMeta: dbMaterial.link_meta,
    thumbnail: dbMaterial.thumbnail,
    coachingArea: dbMaterial.coaching_area,
    topics: dbMaterial.topics,
    coachingStyle: dbMaterial.coaching_style,
    coachingAuthority: dbMaterial.coaching_authority,
    createdAt: dbMaterial.created_at,
    updatedAt: dbMaterial.updated_at,
  };
};

export const getMaterials = async (coachId = null) => {
  try {
    let query = supabase
      .from('coachpro_materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (coachId) {
      query = query.eq('coach_id', coachId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(convertMaterialFromDB);
  } catch (error) {
    console.error('Error fetching materials from Supabase:', error);
    // Fallback to localStorage
    const materials = loadFromStorage(STORAGE_KEYS.MATERIALS, []);
    return coachId ? materials.filter(m => m.coachId === coachId) : materials;
  }
};

export const saveMaterial = async (material) => {
  try {
    // Prepare data - convert camelCase to snake_case for DB
    const materialData = {
      id: material.id,
      coach_id: material.coachId,
      type: material.type,
      title: material.title,
      description: material.description || null,
      content: material.content,
      category: material.category || null,
      file_name: material.fileName || null,
      file_size: material.fileSize || null,
      page_count: material.pageCount || null,
      duration: material.duration || null,
      storage_path: material.storagePath || null,
      link_type: material.linkType || null,
      link_meta: material.linkMeta || null,
      thumbnail: material.thumbnail || null,
      coaching_area: material.coachingArea || 'life',
      topics: material.topics || [],
      coaching_style: material.coachingStyle || null,
      coaching_authority: material.coachingAuthority || null,
      created_at: material.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('coachpro_materials')
      .upsert(materialData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error saving material to Supabase:', error);
    // Fallback to localStorage
    const materials = loadFromStorage(STORAGE_KEYS.MATERIALS, []);
    const existingIndex = materials.findIndex(m => m.id === material.id);
    if (existingIndex >= 0) {
      materials[existingIndex] = material;
    } else {
      materials.push(material);
    }
    saveToStorage(STORAGE_KEYS.MATERIALS, materials);
    return material;
  }
};

export const getMaterialById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_materials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return convertMaterialFromDB(data);
  } catch (error) {
    console.error('Error fetching material by ID from Supabase:', error);
    // Fallback to localStorage
    const materials = loadFromStorage(STORAGE_KEYS.MATERIALS, []);
    return materials.find(m => m.id === id);
  }
};

export const deleteMaterial = async (id) => {
  try {
    // First get the material to check for Supabase Storage files
    const material = await getMaterialById(id);

    // Delete from Supabase Storage if storagePath exists
    if (material?.storage_path || material?.storagePath) {
      try {
        const { deleteFileFromSupabase } = await import('./supabaseStorage');
        await deleteFileFromSupabase(material.storage_path || material.storagePath);
      } catch (error) {
        console.error('Failed to delete from Supabase Storage:', error);
        // Continue with DB deletion even if Storage deletion fails
      }
    }

    // Delete from Supabase database
    const { error } = await supabase
      .from('coachpro_materials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting material from Supabase:', error);
    // Fallback to localStorage
    const materials = loadFromStorage(STORAGE_KEYS.MATERIALS, []);
    const filtered = materials.filter(m => m.id !== id);
    return saveToStorage(STORAGE_KEYS.MATERIALS, filtered);
  }
};

// ===== PROGRAMS =====
export const getPrograms = async (coachId = null) => {
  try {
    let query = supabase
      .from('coachpro_programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (coachId) {
      query = query.eq('coach_id', coachId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(convertProgramFromDB);
  } catch (error) {
    console.error('Error fetching programs from Supabase:', error);
    // Fallback to localStorage
    const programs = loadFromStorage(STORAGE_KEYS.PROGRAMS, []);
    return coachId ? programs.filter(p => p.coachId === coachId) : programs;
  }
};

// =====================
// PROGRAMS
// =====================

// Helper: Convert program from DB (snake_case) to JS (camelCase)
const convertProgramFromDB = (dbProgram) => {
  if (!dbProgram) return null;
  return {
    id: dbProgram.id,
    coachId: dbProgram.coach_id,
    coachName: dbProgram.coach_name,
    title: dbProgram.title,
    description: dbProgram.description,
    duration: dbProgram.duration,
    shareCode: dbProgram.share_code,
    qrCode: dbProgram.qr_code,
    isActive: dbProgram.is_active,
    days: dbProgram.days,
    createdAt: dbProgram.created_at,
    updatedAt: dbProgram.updated_at,
  };
};

export const saveProgram = async (program) => {
  try {
    // Get coach name for faster loading (no need for JOIN later)
    const coach = await getCoachById(program.coachId);
    const coachName = coach?.name || 'Neznámá koučka';

    // Prepare data - convert camelCase to snake_case for DB
    const programData = {
      id: program.id,
      coach_id: program.coachId,
      coach_name: coachName,
      title: program.title,
      description: program.description || null,
      duration: program.duration,
      share_code: program.shareCode,
      qr_code: program.qrCode || null,
      is_active: program.isActive !== undefined ? program.isActive : true,
      days: program.days, // JSONB column - Supabase handles this
    };

    const { data, error } = await supabase
      .from('coachpro_programs')
      .upsert(programData, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving program to Supabase:', error);

    // Get coach name for localStorage fallback
    const coach = await getCoachById(program.coachId);
    const coachName = coach?.name || 'Neznámá koučka';

    // Fallback to localStorage
    const programs = loadFromStorage(STORAGE_KEYS.PROGRAMS, []);
    const programWithCoachName = { ...program, coachName };
    const existingIndex = programs.findIndex(p => p.id === program.id);
    if (existingIndex >= 0) {
      programs[existingIndex] = programWithCoachName;
    } else {
      programs.push(programWithCoachName);
    }
    return saveToStorage(STORAGE_KEYS.PROGRAMS, programs);
  }
};

export const getProgramById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_programs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return convertProgramFromDB(data);
  } catch (error) {
    console.error('Error fetching program by ID from Supabase:', error);
    // Fallback to localStorage
    const programs = loadFromStorage(STORAGE_KEYS.PROGRAMS, []);
    return programs.find(p => p.id === id);
  }
};

export const getProgramByCode = async (code) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_programs')
      .select('*')
      .eq('share_code', code.toUpperCase())
      .single();

    if (error) throw error;
    return convertProgramFromDB(data);
  } catch (error) {
    console.error('Error fetching program by code from Supabase:', error);
    // Fallback to localStorage
    const programs = loadFromStorage(STORAGE_KEYS.PROGRAMS, []);
    return programs.find(p => p.shareCode === code.toUpperCase());
  }
};

export const deleteProgram = async (id) => {
  try {
    const { error } = await supabase
      .from('coachpro_programs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting program from Supabase:', error);
    // Fallback to localStorage
    const programs = loadFromStorage(STORAGE_KEYS.PROGRAMS, []);
    const filtered = programs.filter(p => p.id !== id);
    return saveToStorage(STORAGE_KEYS.PROGRAMS, filtered);
  }
};

// ===== CLIENTS =====
// Helper: Convert client from DB (snake_case) to JS (camelCase)
const convertClientFromDB = (dbClient) => {
  if (!dbClient) return null;
  return {
    id: dbClient.id,
    name: dbClient.name,
    programCode: dbClient.program_code,
    programId: dbClient.program_id,
    currentDay: dbClient.current_day,
    completedDays: dbClient.completed_days,
    moodChecks: dbClient.mood_checks,
    streak: dbClient.streak,
    longestStreak: dbClient.longest_streak,
    startedAt: dbClient.started_at,
    completedAt: dbClient.completed_at,
    certificateGenerated: dbClient.certificate_generated,
  };
};

export const getClients = async (programCode = null) => {
  try {
    let query = supabase
      .from('coachpro_clients')
      .select('*')
      .order('started_at', { ascending: false });

    if (programCode) {
      query = query.eq('program_code', programCode);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(convertClientFromDB);
  } catch (error) {
    console.error('Error fetching clients from Supabase:', error);
    // Fallback to localStorage
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS, []);
    return programCode ? clients.filter(c => c.programCode === programCode) : clients;
  }
};

export const saveClient = async (client) => {
  try {
    // Prepare data - convert camelCase to snake_case for DB
    const clientData = {
      id: client.id,
      name: client.name,
      program_code: client.programCode,
      program_id: client.programId || null,
      current_day: client.currentDay || 1,
      completed_days: client.completedDays || [],
      mood_checks: client.moodChecks || [],
      streak: client.streak || 0,
      longest_streak: client.longestStreak || 0,
      started_at: client.startedAt || new Date().toISOString(),
      completed_at: client.completedAt || null,
      certificate_generated: client.certificateGenerated || false,
    };

    const { data, error } = await supabase
      .from('coachpro_clients')
      .upsert(clientData, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving client to Supabase:', error);
    // Fallback to localStorage
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS, []);
    const existingIndex = clients.findIndex(c => c.id === client.id);
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }
    return saveToStorage(STORAGE_KEYS.CLIENTS, clients);
  }
};

export const getClientById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return convertClientFromDB(data);
  } catch (error) {
    console.error('Error fetching client by ID from Supabase:', error);
    // Fallback to localStorage
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS, []);
    return clients.find(c => c.id === id);
  }
};

export const getClientByProgramCode = async (code) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_clients')
      .select('*')
      .eq('program_code', code.toUpperCase())
      .single();

    if (error) throw error;
    return convertClientFromDB(data);
  } catch (error) {
    console.error('Error fetching client by program code from Supabase:', error);
    // Fallback to localStorage
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS, []);
    return clients.find(c => c.programCode === code.toUpperCase());
  }
};

export const getClientsByCoachId = async (coachId) => {
  try {
    // Get all programs for this coach
    const programs = await getPrograms(coachId);
    const programCodes = programs.map(p => p.shareCode);

    // Get all clients matching these program codes
    const { data, error } = await supabase
      .from('coachpro_clients')
      .select('*')
      .in('program_code', programCodes);

    if (error) throw error;
    return (data || []).map(convertClientFromDB);
  } catch (error) {
    console.error('Error fetching clients by coach ID from Supabase:', error);
    // Fallback to localStorage
    const programs = loadFromStorage(STORAGE_KEYS.PROGRAMS, []).filter(p => p.coachId === coachId);
    const programCodes = programs.map(p => p.shareCode);
    const allClients = loadFromStorage(STORAGE_KEYS.CLIENTS, []);
    return allClients.filter(c => programCodes.includes(c.programCode));
  }
};

// ===== SHARED MATERIALS =====
// Helper: Convert shared material from DB (snake_case) to JS (camelCase)
const convertSharedMaterialFromDB = (dbSharedMaterial) => {
  if (!dbSharedMaterial) return null;
  return {
    id: dbSharedMaterial.id,
    materialId: dbSharedMaterial.material_id,
    material: dbSharedMaterial.material,
    shareCode: dbSharedMaterial.share_code,
    qrCode: dbSharedMaterial.qr_code,
    coachId: dbSharedMaterial.coach_id,
    coachName: dbSharedMaterial.coach_name,
    createdAt: dbSharedMaterial.created_at,
  };
};

export const getSharedMaterials = async (coachId = null) => {
  try {
    let query = supabase
      .from('coachpro_shared_materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (coachId) {
      query = query.eq('coach_id', coachId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(convertSharedMaterialFromDB);
  } catch (error) {
    console.error('Error fetching shared materials from Supabase:', error);
    // Fallback to localStorage
    const sharedMaterials = loadFromStorage(STORAGE_KEYS.SHARED_MATERIALS, []);
    return coachId ? sharedMaterials.filter(sm => sm.coachId === coachId) : sharedMaterials;
  }
};

export const createSharedMaterial = async (material, coachId) => {
  try {
    const { generateShareCode, generateQRCode } = await import('./generateCode.js');

    const shareCode = generateShareCode();
    const qrCode = await generateQRCode(shareCode);

    // Get coach name for faster loading (no need for JOIN later)
    const coach = await getCoachById(coachId);
    const coachName = coach?.name || 'Neznámá koučka';

    const sharedMaterialData = {
      id: material.id + '-shared-' + Date.now(),
      material_id: material.id,
      material: material, // JSONB column
      share_code: shareCode,
      qr_code: qrCode,
      coach_id: coachId,
      coach_name: coachName,
    };

    const { data, error } = await supabase
      .from('coachpro_shared_materials')
      .insert(sharedMaterialData)
      .select()
      .single();

    if (error) throw error;
    return convertSharedMaterialFromDB(data);
  } catch (error) {
    console.error('Error creating shared material in Supabase:', error);
    // Fallback to localStorage
    const { generateShareCode, generateQRCode } = await import('./generateCode.js');
    const shareCode = generateShareCode();
    const qrCode = await generateQRCode(shareCode);

    // Get coach name for localStorage fallback
    const coach = await getCoachById(coachId);
    const coachName = coach?.name || 'Neznámá koučka';

    const sharedMaterial = {
      id: material.id + '-shared-' + Date.now(),
      materialId: material.id,
      material: material,
      shareCode: shareCode,
      qrCode: qrCode,
      coachId: coachId,
      coachName: coachName,
      createdAt: new Date().toISOString(),
    };

    const sharedMaterials = loadFromStorage(STORAGE_KEYS.SHARED_MATERIALS, []);
    sharedMaterials.push(sharedMaterial);
    saveToStorage(STORAGE_KEYS.SHARED_MATERIALS, sharedMaterials);

    return sharedMaterial;
  }
};

export const getSharedMaterialByCode = async (shareCode) => {
  try {
    const { data, error } = await supabase
      .from('coachpro_shared_materials')
      .select('*')
      .eq('share_code', shareCode.toUpperCase())
      .single();

    if (error) throw error;
    return convertSharedMaterialFromDB(data);
  } catch (error) {
    console.error('Error fetching shared material by code from Supabase:', error);
    // Fallback to localStorage
    const sharedMaterials = loadFromStorage(STORAGE_KEYS.SHARED_MATERIALS, []);
    return sharedMaterials.find(sm => sm.shareCode === shareCode.toUpperCase());
  }
};

export const deleteSharedMaterial = async (id) => {
  try {
    const { error } = await supabase
      .from('coachpro_shared_materials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting shared material from Supabase:', error);
    // Fallback to localStorage
    const sharedMaterials = loadFromStorage(STORAGE_KEYS.SHARED_MATERIALS, []);
    const filtered = sharedMaterials.filter(sm => sm.id !== id);
    return saveToStorage(STORAGE_KEYS.SHARED_MATERIALS, filtered);
  }
};

// ===== CURRENT USER =====
export const getCurrentUser = () => {
  return loadFromStorage(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (user) => {
  return saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const clearCurrentUser = () => {
  return removeFromStorage(STORAGE_KEYS.CURRENT_USER);
};

// ===== CURRENT CLIENT (session storage) =====
export const getCurrentClient = () => {
  try {
    const item = sessionStorage.getItem('coachpro_currentClient');
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading current client:', error);
    return null;
  }
};

export const setCurrentClient = (client) => {
  try {
    sessionStorage.setItem('coachpro_currentClient', JSON.stringify(client));
    return true;
  } catch (error) {
    console.error('Error saving current client:', error);
    return false;
  }
};

export const clearCurrentClient = () => {
  try {
    sessionStorage.removeItem('coachpro_currentClient');
    return true;
  } catch (error) {
    console.error('Error clearing current client:', error);
    return false;
  }
};

// ===== UTILITY FUNCTIONS =====

// Clear all app data (for testing)
export const clearAllData = async () => {
  try {
    // Clear from Supabase database
    await supabase.from('coachpro_shared_materials').delete().neq('id', '');
    await supabase.from('coachpro_clients').delete().neq('id', '');
    await supabase.from('coachpro_programs').delete().neq('id', '');
    await supabase.from('coachpro_materials').delete().neq('id', '');
    await supabase.from('coachpro_coaches').delete().neq('id', '');
  } catch (error) {
    console.error('Error clearing Supabase data:', error);
  }

  // Clear localStorage as fallback/backup
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
  clearCurrentClient();
};

// Initialize demo data
export const initializeDemoData = async () => {
  // Check if demo coach already exists
  const coaches = await getCoaches();
  if (coaches.length > 0) return;

  const demoCoach = {
    id: 'demo-coach-1',
    name: 'Demo Koučka',
    email: 'demo@coachpro.cz',
    avatar: null,
    branding: {
      primaryColor: '#556B2F',
      logo: null
    },
    createdAt: new Date().toISOString()
  };

  await saveCoach(demoCoach);
};

export default {
  // Keys
  STORAGE_KEYS,

  // Generic
  saveToStorage,
  loadFromStorage,
  removeFromStorage,

  // Coaches
  getCoaches,
  saveCoach,
  getCoachById,

  // Materials
  getMaterials,
  saveMaterial,
  getMaterialById,
  deleteMaterial,

  // Programs
  getPrograms,
  saveProgram,
  getProgramById,
  getProgramByCode,
  deleteProgram,

  // Clients
  getClients,
  saveClient,
  getClientById,
  getClientByProgramCode,
  getClientsByCoachId,

  // Shared Materials
  getSharedMaterials,
  createSharedMaterial,
  getSharedMaterialByCode,
  deleteSharedMaterial,

  // Current user/client
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getCurrentClient,
  setCurrentClient,
  clearCurrentClient,

  // Utilities
  clearAllData,
  initializeDemoData
};
