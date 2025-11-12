// @digipro/design-system/themes/colors.js
// Unified color system extracted from DigiPro

export const colors = {
  // Neutral palette - modern, minimalistic
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },

  // Primary (blue-slate) - professional, non-intrusive
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Accent (soft purple) - elegant, gentle
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  // Status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },

  // Payment-specific colors
  payments: {
    income: '#059669',      // Green for income
    expense: '#dc2626',     // Red for expenses
    pending: '#f59e0b',     // Orange for pending
    overdue: '#ef4444',     // Red for overdue
    completed: '#22c55e',   // Green for completed
  }
};

// Semantic color mapping for different themes
export const semanticColors = {
  light: {
    background: colors.neutral[50],
    surface: '#ffffff',
    surfaceElevated: colors.neutral[100],
    surfaceHover: colors.neutral[100],
    
    textPrimary: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textTertiary: colors.neutral[400],
    textDisabled: colors.neutral[300],
    
    borderLight: colors.neutral[200],
    borderMedium: colors.neutral[300],
    borderStrong: colors.neutral[400],

    // Progress tracking colors
    progressCreative: colors.primary[500],
    progressCreativeBg: colors.primary[100],
    progressPractical: colors.accent[500],
    progressPracticalBg: colors.accent[100],

    // Button system
    buttonPrimaryBg: colors.neutral[900],
    buttonPrimaryHover: colors.neutral[800],
    buttonPrimaryText: '#ffffff',
    
    buttonSecondaryBg: 'transparent',
    buttonSecondaryBorder: colors.neutral[300],
    buttonSecondaryHover: colors.neutral[50],
    buttonSecondaryText: colors.neutral[700],
  },

  dark: {
    background: colors.neutral[900],
    surface: colors.neutral[800],
    surfaceElevated: colors.neutral[700],
    surfaceHover: colors.neutral[700],
    
    textPrimary: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textTertiary: colors.neutral[500],
    textDisabled: colors.neutral[600],
    
    borderLight: colors.neutral[700],
    borderMedium: colors.neutral[600],
    borderStrong: colors.neutral[500],

    // Progress tracking colors (adapted for dark)
    progressCreative: colors.primary[400],
    progressCreativeBg: colors.primary[900],
    progressPractical: colors.accent[400],
    progressPracticalBg: colors.accent[900],

    // Button system (adapted for dark)
    buttonPrimaryBg: colors.accent[600],
    buttonPrimaryHover: colors.accent[500],
    buttonPrimaryText: '#ffffff',
    
    buttonSecondaryBg: 'transparent',
    buttonSecondaryBorder: colors.neutral[600],
    buttonSecondaryHover: colors.neutral[800],
    buttonSecondaryText: colors.neutral[300],
  }
};

// CSS Variables generator
export const generateCSSVariables = (theme = 'light') => {
  const themeColors = semanticColors[theme];
  
  return Object.entries(themeColors).reduce((acc, [key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    acc[cssVarName] = value;
    return acc;
  }, {});
};

export default colors;