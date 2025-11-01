// src/styles/borderRadius.js
// Centralizované nastavení border radius pro celou CoachPro aplikaci
// Zkopírováno z PaymentsPro - zajišťuje konzistentní zakulacení všech UI elementů

export const BORDER_RADIUS = {
  // Základní hodnoty
  standard: '20px',    // Hlavní containery, panely
  compact: '16px',     // Kompaktní tlačítka, menší prvky
  premium: '24px',     // Premium varianty, větší elementy
  small: '12px',       // Malé prvky, chips
  minimal: '8px',      // Nejmenší prvky

  // Specifické komponenty
  input: '16px',       // Všechny input fieldy (TextField, Select, Autocomplete)
  button: '18px',      // Všechna tlačítka
  card: '20px',        // Karty, Papers, kontejnery
  toggle: '20px',      // Toggle tlačítka
  select: '16px',      // Select fieldy a dropdowny
  dialog: '20px',      // Dialogy a modaly
  filter: '16px',      // Filter komponenty
  search: '16px',      // Search bary

  // Glassmorphism elementy (Sprint 6.9)
  glassPanel: '40px',  // Velké glassmorphism panely (completion screen, ProgressGarden)
  dayHeader: '36px',   // Day header v DailyView (kompaktní výška)
  streakBox: '33px',   // Streak box v completion screen (menší výška)
  modal: '32px',       // Glassmorphism modaly

  // Pro responsive design
  mobile: {
    standard: '16px',
    compact: '12px',
    premium: '20px',
    input: '12px',
    button: '12px',
    card: '16px',
    dialog: '16px'
  }
};

// Helper funkce pro získání správného border radius
export const getBorderRadius = (variant = 'standard', isMobile = false) => {
  if (isMobile && BORDER_RADIUS.mobile[variant]) {
    return BORDER_RADIUS.mobile[variant];
  }
  return BORDER_RADIUS[variant] || BORDER_RADIUS.standard;
};

// Helper funkce pro responsive border radius
export const getResponsiveBorderRadius = (variant = 'standard') => {
  return {
    xs: BORDER_RADIUS.mobile[variant] || BORDER_RADIUS.mobile.standard,
    sm: BORDER_RADIUS[variant] || BORDER_RADIUS.standard,
    md: BORDER_RADIUS[variant] || BORDER_RADIUS.standard
  };
};

// Predefinované CSS objekty pro časté použití
export const BORDER_RADIUS_STYLES = {
  // Pro glassmorphism input fieldy
  glassmorphismInput: {
    borderRadius: BORDER_RADIUS.input,
    '& .MuiOutlinedInput-root': {
      borderRadius: `${BORDER_RADIUS.input} !important`,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: `${BORDER_RADIUS.input} !important`,
    }
  },

  // Pro standardní tlačítka
  button: {
    borderRadius: BORDER_RADIUS.button,
  },

  // Pro karty a panely
  card: {
    borderRadius: BORDER_RADIUS.card,
  },

  // Pro dialogy
  dialog: {
    borderRadius: BORDER_RADIUS.dialog,
  },

  // Pro mobile responsive
  mobileCard: {
    borderRadius: {
      xs: BORDER_RADIUS.mobile.card,
      sm: BORDER_RADIUS.card
    }
  }
};

// Theme override pro Material-UI - aplikuje globálně na celý theme
export const createBorderRadiusTheme = (theme) => ({
  ...theme,
  shape: {
    ...theme.shape,
    borderRadius: parseInt(BORDER_RADIUS.standard.replace('px', ''))
  },
  components: {
    ...theme.components,

    // Tlačítka - proporcionální podle velikosti
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.button,
        },
        sizeSmall: {
          borderRadius: BORDER_RADIUS.small, // 12px pro malá tlačítka
        },
        sizeMedium: {
          borderRadius: BORDER_RADIUS.compact, // 16px pro střední tlačítka
        },
        sizeLarge: {
          borderRadius: BORDER_RADIUS.standard, // 20px pro velká tlačítka
        }
      }
    },

    // Input fieldy - TextField proporcionální
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: BORDER_RADIUS.input,
          },
          '& .MuiInputBase-sizeSmall': {
            borderRadius: BORDER_RADIUS.small,
          }
        }
      }
    },

    // Input fieldy - OutlinedInput
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.input,
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: BORDER_RADIUS.input,
          }
        }
      }
    },

    // Select fieldy
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.select,
        }
      }
    },

    // FormControl
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: BORDER_RADIUS.input,
          }
        }
      }
    },

    // Autocomplete
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          borderRadius: BORDER_RADIUS.input,
        }
      }
    },

    // Toggle Button Group
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.toggle,
          '& .MuiToggleButton-root': {
            borderRadius: BORDER_RADIUS.compact,
          }
        }
      }
    },

    // Papers a karty
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.card,
        }
      }
    },

    // Dialogy
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: BORDER_RADIUS.dialog,
        }
      }
    },

    // Chips - proporcionální podle velikosti
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.small,
        },
        sizeSmall: {
          borderRadius: BORDER_RADIUS.minimal, // 8px pro malé chipy
        },
        sizeMedium: {
          borderRadius: BORDER_RADIUS.small, // 12px pro střední chipy
        }
      }
    },

    // IconButton - proporcionální
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.compact,
        },
        sizeSmall: {
          borderRadius: BORDER_RADIUS.small,
        },
        sizeMedium: {
          borderRadius: BORDER_RADIUS.compact,
        },
        sizeLarge: {
          borderRadius: BORDER_RADIUS.standard,
        }
      }
    },

    // Menu - zakulacené rohy + první a poslední položka
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: BORDER_RADIUS.compact, // 16px pro samotné menu
        },
        list: {
          padding: '8px', // Odsazení pro hezčí vzhled
        }
      }
    },

    // MenuItem - zakulacené individuálně
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.small, // 12px pro jednotlivé položky
          margin: '2px 0', // Malá mezera mezi položkami
          '&:first-of-type': {
            marginTop: 0,
          },
          '&:last-of-type': {
            marginBottom: 0,
          }
        }
      }
    },

    // Popover
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: BORDER_RADIUS.compact,
        }
      }
    },

    // Alert
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.small,
        }
      }
    },

    // Card
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.card,
        }
      }
    }
  }
});

// Utility funkce pro rychlé použití v sx prop
export const borderRadius = (variant = 'standard') => ({
  borderRadius: BORDER_RADIUS[variant] || BORDER_RADIUS.standard
});

// Utility pro responsive border radius v sx prop
export const responsiveBorderRadius = (variant = 'standard') => ({
  borderRadius: {
    xs: BORDER_RADIUS.mobile[variant] || BORDER_RADIUS.mobile.standard,
    sm: BORDER_RADIUS[variant] || BORDER_RADIUS.standard
  }
});

// Utility pro proporcionální border radius podle size
export const getSizeBorderRadius = (size = 'medium') => {
  switch (size) {
    case 'small':
      return BORDER_RADIUS.small; // 12px
    case 'medium':
      return BORDER_RADIUS.compact; // 16px
    case 'large':
      return BORDER_RADIUS.standard; // 20px
    default:
      return BORDER_RADIUS.compact;
  }
};

// Export default pro easy import
export default BORDER_RADIUS;
