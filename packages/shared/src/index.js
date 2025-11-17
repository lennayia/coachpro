// @proapp/shared
// Main entry point for ProApp shared package

// Re-export everything from submodules
export * from './styles/index.js';
export * from './components/index.js';
export * from './hooks/index.js';
export * from './constants/index.js';
export * from './utils/index.js';
export * from './context/index.js';
export * from './themes/index.js';

// Note: Config exports are kept separate for explicit imports
// Each module needs its own supabase config with module-specific schema
// Example: import { supabase } from '@/config/supabase';
