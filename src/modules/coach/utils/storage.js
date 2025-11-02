// 💾 LocalStorage utilities pro CoachPro

// Keys
export const STORAGE_KEYS = {
  COACHES: 'coachpro_coaches',
  MATERIALS: 'coachpro_materials',
  PROGRAMS: 'coachpro_programs',
  CLIENTS: 'coachpro_clients',
  SHARED_MATERIALS: 'coachpro_shared_materials',
  CURRENT_USER: 'coachpro_currentUser',
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
export const getCoaches = () => {
  return loadFromStorage(STORAGE_KEYS.COACHES, []);
};

export const saveCoach = (coach) => {
  const coaches = getCoaches();
  const existingIndex = coaches.findIndex(c => c.id === coach.id);

  if (existingIndex >= 0) {
    coaches[existingIndex] = coach;
  } else {
    coaches.push(coach);
  }

  return saveToStorage(STORAGE_KEYS.COACHES, coaches);
};

export const getCoachById = (id) => {
  const coaches = getCoaches();
  return coaches.find(c => c.id === id);
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

export const getMaterials = (coachId = null) => {
  const materials = loadFromStorage(STORAGE_KEYS.MATERIALS, []);
  return coachId ? materials.filter(m => m.coachId === coachId) : materials;
};

export const saveMaterial = (material) => {
  const materials = getMaterials();
  const existingIndex = materials.findIndex(m => m.id === material.id);

  if (existingIndex >= 0) {
    materials[existingIndex] = material;
  } else {
    materials.push(material);
  }

  // saveToStorage now throws errors, so they will propagate up
  saveToStorage(STORAGE_KEYS.MATERIALS, materials);
  return material;
};

export const getMaterialById = (id) => {
  const materials = getMaterials();
  return materials.find(m => m.id === id);
};

export const deleteMaterial = async (id) => {
  const materials = getMaterials();
  const material = materials.find(m => m.id === id);

  // Delete from Supabase if storagePath exists
  if (material?.storagePath) {
    try {
      const { deleteFileFromSupabase } = await import('./supabaseStorage');
      await deleteFileFromSupabase(material.storagePath);
    } catch (error) {
      console.error('Failed to delete from Supabase:', error);
      // Continue with local deletion even if Supabase deletion fails
    }
  }

  const filtered = materials.filter(m => m.id !== id);
  return saveToStorage(STORAGE_KEYS.MATERIALS, filtered);
};

// ===== PROGRAMS =====
export const getPrograms = (coachId = null) => {
  const programs = loadFromStorage(STORAGE_KEYS.PROGRAMS, []);
  return coachId ? programs.filter(p => p.coachId === coachId) : programs;
};

export const saveProgram = (program) => {
  const programs = getPrograms();
  const existingIndex = programs.findIndex(p => p.id === program.id);

  if (existingIndex >= 0) {
    programs[existingIndex] = program;
  } else {
    programs.push(program);
  }

  return saveToStorage(STORAGE_KEYS.PROGRAMS, programs);
};

export const getProgramById = (id) => {
  const programs = getPrograms();
  return programs.find(p => p.id === id);
};

export const getProgramByCode = (code) => {
  const programs = getPrograms();
  return programs.find(p => p.shareCode === code.toUpperCase());
};

export const deleteProgram = (id) => {
  const programs = getPrograms();
  const filtered = programs.filter(p => p.id !== id);
  return saveToStorage(STORAGE_KEYS.PROGRAMS, filtered);
};

// ===== CLIENTS =====
export const getClients = (programCode = null) => {
  const clients = loadFromStorage(STORAGE_KEYS.CLIENTS, []);
  return programCode ? clients.filter(c => c.programCode === programCode) : clients;
};

export const saveClient = (client) => {
  const clients = getClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);

  if (existingIndex >= 0) {
    clients[existingIndex] = client;
  } else {
    clients.push(client);
  }

  return saveToStorage(STORAGE_KEYS.CLIENTS, clients);
};

export const getClientById = (id) => {
  const clients = getClients();
  return clients.find(c => c.id === id);
};

export const getClientByProgramCode = (code) => {
  const clients = getClients();
  return clients.find(c => c.programCode === code.toUpperCase());
};

export const getClientsByCoachId = (coachId) => {
  const programs = getPrograms(coachId);
  const programCodes = programs.map(p => p.shareCode);
  const allClients = getClients();
  return allClients.filter(c => programCodes.includes(c.programCode));
};

// ===== SHARED MATERIALS =====
export const getSharedMaterials = (coachId = null) => {
  const sharedMaterials = loadFromStorage(STORAGE_KEYS.SHARED_MATERIALS, []);
  return coachId ? sharedMaterials.filter(sm => sm.coachId === coachId) : sharedMaterials;
};

export const createSharedMaterial = async (material, coachId) => {
  const { generateShareCode, generateQRCode } = await import('./generateCode.js');

  const shareCode = generateShareCode();
  const qrCode = await generateQRCode(shareCode);

  const sharedMaterial = {
    id: material.id + '-shared-' + Date.now(),
    materialId: material.id,
    material: material,
    shareCode: shareCode,
    qrCode: qrCode,
    coachId: coachId,
    createdAt: new Date().toISOString(),
  };

  const sharedMaterials = getSharedMaterials();
  sharedMaterials.push(sharedMaterial);
  saveToStorage(STORAGE_KEYS.SHARED_MATERIALS, sharedMaterials);

  return sharedMaterial;
};

export const getSharedMaterialByCode = (shareCode) => {
  const sharedMaterials = getSharedMaterials();
  return sharedMaterials.find(sm => sm.shareCode === shareCode.toUpperCase());
};

export const deleteSharedMaterial = (id) => {
  const sharedMaterials = getSharedMaterials();
  const filtered = sharedMaterials.filter(sm => sm.id !== id);
  return saveToStorage(STORAGE_KEYS.SHARED_MATERIALS, filtered);
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
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
  clearCurrentClient();
};

// Initialize demo data
export const initializeDemoData = () => {
  // Check if demo coach already exists
  const coaches = getCoaches();
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

  saveCoach(demoCoach);
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
