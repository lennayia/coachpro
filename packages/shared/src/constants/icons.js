/**
 * Centralized Icon Configuration
 *
 * Single source of truth for all icons used across the application.
 * Use Lucide React icons for consistency.
 *
 * @created 10.11.2025
 * @updated 10.11.2025 - Changed materials to Library, programs to Folder, cards to Layers
 */

import {
  Home,
  Calendar,
  Library,
  Folder,
  Layers,
  Users,
  User,
  UserCheck,
  Settings,
  Sun,
  Moon,
  Info,
  HelpCircle,
  LogOut,
  X,
  Signpost,
} from 'lucide-react';

/**
 * Navigation Icons - used in NavigationFloatingMenu
 */
export const NAVIGATION_ICONS = {
  dashboard: Home,
  sessions: Calendar,
  materials: Library,      // Knihovna materiálů
  programs: Folder,        // Programy
  cards: Layers,           // Koučovací karty
  clients: Users,
  testers: UserCheck,
};

/**
 * Settings Menu Icons - used in FloatingMenu
 */
export const SETTINGS_ICONS = {
  profile: User,
  welcome: Signpost,
  lightMode: Sun,
  darkMode: Moon,
  betaInfo: Info,
  help: HelpCircle,
  logout: LogOut,
  settings: Settings,
  close: X,
};

/**
 * Dashboard Icons - used in dashboard components
 * Maps to the same icons as navigation for consistency
 */
export const DASHBOARD_ICONS = {
  sessions: Calendar,
  materials: Library,      // Knihovna materiálů
  programs: Folder,        // Programy
  cards: Layers,           // Koučovací karty
  clients: Users,
  profile: User,
  help: HelpCircle,
};

/**
 * Stats Card Icons - used in stats/overview cards
 * Same as dashboard icons for consistency
 */
export const STATS_ICONS = {
  sessions: Calendar,
  materials: Library,      // Knihovna materiálů
  programs: Folder,        // Programy (v budoucnu možná balíčky/kurzy)
  cards: Layers,           // Koučovací karty
  clients: Users,
};

/**
 * Helper: Get icon for a specific feature
 * @param {string} feature - Feature name (e.g., 'sessions', 'materials')
 * @returns {React.Component} Lucide icon component
 */
export const getFeatureIcon = (feature) => {
  return DASHBOARD_ICONS[feature] || Home;
};
