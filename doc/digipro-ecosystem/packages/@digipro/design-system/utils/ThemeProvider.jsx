// @digipro/design-system/utils/ThemeProvider.jsx
// Unified theme provider for DigiPro ecosystem

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';

import { colors, semanticColors } from '../themes/colors.js';
import { typography, textStyles } from '../themes/typography.js';
import { spacing, shadows, borderRadius } from '../themes/spacing.js';

// Theme Context
const DigiProThemeContext = createContext();

// Custom hook to use theme
export const useDigiProTheme = () => {
  const context = useContext(DigiProThemeContext);
  if (!context) {
    throw new Error('useDigiProTheme must be used within a DigiProThemeProvider');
  }
  return context;
};

// Theme configuration factory
const createDigiProTheme = (mode = 'light') => {
  const themeColors = semanticColors[mode];
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary[600],
        50: colors.primary[50],
        100: colors.primary[100],
        200: colors.primary[200],
        300: colors.primary[300],
        400: colors.primary[400],
        500: colors.primary[500],
        600: colors.primary[600],
        700: colors.primary[700],
        800: colors.primary[800],
        900: colors.primary[900],
      },
      secondary: {
        main: colors.accent[600],
        50: colors.accent[50],
        100: colors.accent[100],
        200: colors.accent[200],
        300: colors.accent[300],
        400: colors.accent[400],
        500: colors.accent[500],
        600: colors.accent[600],
        700: colors.accent[700],
        800: colors.accent[800],
        900: colors.accent[900],
      },
      error: {
        main: colors.error[500],
        light: colors.error[100],
        dark: colors.error[600],
      },
      warning: {
        main: colors.warning[500],
        light: colors.warning[100],
        dark: colors.warning[600],
      },
      success: {
        main: colors.success[500],
        light: colors.success[100],
        dark: colors.success[600],
      },
      background: {
        default: themeColors.background,
        paper: themeColors.surface,
      },
      text: {
        primary: themeColors.textPrimary,
        secondary: themeColors.textSecondary,
      },
    },

    typography: {
      fontFamily: typography.fonts.primary,
      h1: {
        ...textStyles.h1,
        color: themeColors.textPrimary,
      },
      h2: {
        ...textStyles.h2,
        color: themeColors.textPrimary,
      },
      h3: {
        ...textStyles.h3,
        color: themeColors.textPrimary,
      },
      h4: {
        ...textStyles.h4,
        color: themeColors.textPrimary,
      },
      body1: {
        ...textStyles.body,
        color: themeColors.textPrimary,
      },
      body2: {
        ...textStyles.bodySmall,
        color: themeColors.textSecondary,
      },
      button: textStyles.button,
      caption: {
        ...textStyles.caption,
        color: themeColors.textTertiary,
      },
    },

    spacing: (factor) => spacing[factor] || `${factor * 0.25}rem`,

    shape: {
      borderRadius: parseInt(borderRadius.base.replace('rem', '')) * 16, // Convert to px for MUI
    },

    shadows: Object.values(shadows),

    components: {
      // Button customization
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: borderRadius.md,
            fontWeight: typography.fontWeight.medium,
            boxShadow: shadows.none,
            '&:hover': {
              boxShadow: shadows.sm,
            },
          },
          contained: {
            backgroundColor: themeColors.buttonPrimaryBg,
            color: themeColors.buttonPrimaryText,
            '&:hover': {
              backgroundColor: themeColors.buttonPrimaryHover,
            },
          },
          outlined: {
            borderColor: themeColors.buttonSecondaryBorder,
            color: themeColors.buttonSecondaryText,
            '&:hover': {
              backgroundColor: themeColors.buttonSecondaryHover,
              borderColor: themeColors.buttonSecondaryBorder,
            },
          },
        },
      },

      // Card customization
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.lg,
            boxShadow: shadows.base,
            border: `1px solid ${themeColors.borderLight}`,
            '&:hover': {
              boxShadow: shadows.cardHover,
            },
          },
        },
      },

      // Table customization
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.lg,
            border: `1px solid ${themeColors.borderLight}`,
          },
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: themeColors.surfaceElevated,
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: themeColors.borderLight,
          },
          head: {
            ...textStyles.tableHeader,
            color: themeColors.textSecondary,
            backgroundColor: themeColors.surfaceElevated,
          },
        },
      },

      // Chip customization (for status indicators)
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.full,
            ...textStyles.statusChip,
          },
        },
      },
    },
  });
};

// Global styles for CSS variables
const createGlobalStyles = (mode) => {
  const themeColors = semanticColors[mode];
  
  return {
    ':root': {
      // Inject CSS variables for compatibility
      '--background': themeColors.background,
      '--surface': themeColors.surface,
      '--surface-elevated': themeColors.surfaceElevated,
      '--text-primary': themeColors.textPrimary,
      '--text-secondary': themeColors.textSecondary,
      '--border-light': themeColors.borderLight,
      '--progress-creative': themeColors.progressCreative,
      '--progress-practical': themeColors.progressPractical,
    },
    body: {
      backgroundColor: themeColors.background,
      color: themeColors.textPrimary,
      fontFamily: typography.fonts.primary,
    },
  };
};

// Main Theme Provider Component
export const DigiProThemeProvider = ({ 
  children, 
  initialMode = 'light',
  enableSystemTheme = true 
}) => {
  const [mode, setMode] = useState(() => {
    if (enableSystemTheme && typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('digipro-theme-mode');
      if (savedMode) return savedMode;
      
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return initialMode;
  });

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedMode = localStorage.getItem('digipro-theme-mode');
      if (!savedMode) { // Only auto-switch if user hasn't manually set preference
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystemTheme]);

  // Save theme preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('digipro-theme-mode', mode);
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode]);

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = createDigiProTheme(mode);
  const globalStyles = createGlobalStyles(mode);

  const contextValue = {
    mode,
    setMode,
    toggleMode,
    colors,
    spacing,
    typography,
    isLight: mode === 'light',
    isDark: mode === 'dark',
  };

  return (
    <DigiProThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        {children}
      </MuiThemeProvider>
    </DigiProThemeContext.Provider>
  );
};

export default DigiProThemeProvider;