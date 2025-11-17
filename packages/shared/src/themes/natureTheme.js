import { createTheme } from '@mui/material/styles';
import { createBorderRadiusTheme } from '../styles/borderRadius.js';

// 🌿 Nature theme zkopírováno z PaymentsPro
const natureColors = {
  light: {
    primary: '#556B2F',      // Lesní zelená
    secondary: '#BC8F8F',    // Dusty rose
    accent: '#8FBC8F',       // Sage
    success: '#228B22',
    warning: '#DAA520',
    error: '#CD5C5C',
    info: '#4682B4',
    background: {
      default: '#fafafa',
      paper: 'rgba(255, 255, 255, 0.95)',
      overlay: 'rgba(255, 255, 255, 0.8)'
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      disabled: '#a1a1aa'
    },
    border: 'rgba(0, 0, 0, 0.1)',
    gradient: 'linear-gradient(135deg, #065f46 0%, #134e4a 100%)'
  },
  dark: {
    primary: '#8FBC8F',      // Světlejší sage pro dark mode
    secondary: '#BC8F8F',    // Dusty rose
    accent: '#556B2F',       // Forest green jako accent
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    background: {
      default: '#0f0f0f',
      paper: 'rgba(26, 26, 26, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.8)'
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
      disabled: '#71717a'
    },
    border: 'rgba(255, 255, 255, 0.1)',
    gradient: 'linear-gradient(135deg, #065f46 0%, #134e4a 100%)'
  }
};

export const createNatureTheme = (mode = 'light') => {
  const colors = natureColors[mode];

  const baseTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        xsm: 500,    // ← Custom breakpoint pro 2 karty
        sm: 600,    // 
        md: 1000,    // ← Custom breakpoint pro 3 karty
        lg: 1300,    // ← Custom breakpoint pro 4 karty
        xl: 1536,    
      },
    },
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: mode === 'light' ? '#7a8e52' : '#a8c7a8',
        dark: mode === 'light' ? '#3d4f21' : '#556B2F',
      },
      secondary: {
        main: colors.secondary,
        light: '#d4b4b4',
        dark: '#946969',
      },
      success: {
        main: colors.success,
        light: mode === 'light' ? '#32cd32' : '#4ade80',
        dark: mode === 'light' ? '#006400' : '#22c55e',
      },
      warning: {
        main: colors.warning,
        light: '#ffd700',
        dark: '#b8860b',
      },
      error: {
        main: colors.error,
        light: '#ff6b6b',
        dark: '#c23030',
      },
      info: {
        main: colors.info,
        light: '#87ceeb',
        dark: '#4169e1',
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.disabled,
      },
      divider: colors.border,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.6,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0 1px 3px rgba(0, 0, 0, 0.05)',
      '0 4px 12px rgba(0, 0, 0, 0.1)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 1px 3px rgba(0, 0, 0, 0.05)',
      '0 1px 3px rgba(0, 0, 0, 0.05)',
      '0 4px 12px rgba(0, 0, 0, 0.1)',
      '0 4px 12px rgba(0, 0, 0, 0.1)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
      '0 8px 32px rgba(0, 0, 0, 0.15)',
    ],
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(10px)',
            backgroundColor: mode === 'dark'
              ? 'rgba(26, 26, 26, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          },
          contained: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.9)',
              '& fieldset': {
                borderColor: colors.border,
              },
              '&:hover fieldset': {
                borderColor: colors.primary,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backdropFilter: 'blur(10px)',
            backgroundColor: mode === 'dark'
              ? 'rgba(26, 26, 26, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 16,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backdropFilter: 'blur(10px)',
            backgroundColor: mode === 'dark'
              ? 'rgba(15, 15, 15, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          },
        },
      },
    },
  });

  // Apply border radius overrides from PaymentsPro
  return createBorderRadiusTheme(baseTheme);
};

export default createNatureTheme;
