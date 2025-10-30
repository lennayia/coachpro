// Modern design effects - glassmorphism, animations, hover states
// Centralizovaný systém pro moderní efekty

const modernEffects = {
  // Glassmorphism efekty
  glassmorphism: {
    light: {
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    },
    dark: {
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      backgroundColor: 'rgba(26, 26, 26, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    }
  },

  // Smoke overlay efekt
  smokeOverlay: {
    light: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(139, 188, 143, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(188, 143, 143, 0.15) 0%, transparent 50%)',
        opacity: 0.6,
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 1,
      }
    },
    dark: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(139, 188, 143, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(188, 143, 143, 0.1) 0%, transparent 50%)',
        opacity: 0.6,
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 1,
      }
    }
  },

  // Animations
  animations: {
    fadeIn: {
      '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      animation: 'fadeIn 0.3s ease-in-out'
    },
    slideUp: {
      '@keyframes slideUp': {
        from: { transform: 'translateY(20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 }
      },
      animation: 'slideUp 0.3s ease-in-out'
    },
    scaleIn: {
      '@keyframes scaleIn': {
        from: { transform: 'scale(0.95)', opacity: 0 },
        to: { transform: 'scale(1)', opacity: 1 }
      },
      animation: 'scaleIn 0.3s ease-in-out'
    }
  },

  // Hover efekty
  hoverEffects: {
    lift: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
      }
    },
    glow: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        boxShadow: '0 8px 32px rgba(139, 188, 143, 0.4)',
      }
    },
    scale: {
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.02)',
      }
    }
  }
};

// Helper funkce pro vytváření glassmorphism efektů
export const createGlass = (intensity = 'normal', isDark = false) => {
  const baseStyle = isDark ? modernEffects.glassmorphism.dark : modernEffects.glassmorphism.light;
  
  const intensityMap = {
    subtle: { blur: '20px', opacity: isDark ? 0.3 : 0.7 },
    normal: { blur: '40px', opacity: isDark ? 0.5 : 0.5 },
    strong: { blur: '60px', opacity: isDark ? 0.7 : 0.3 }
  };

  const config = intensityMap[intensity] || intensityMap.normal;

  return {
    backdropFilter: `blur(${config.blur}) saturate(180%)`,
    WebkitBackdropFilter: `blur(${config.blur}) saturate(180%)`,
    backgroundColor: isDark 
      ? `rgba(26, 26, 26, ${config.opacity})`
      : `rgba(255, 255, 255, ${config.opacity})`,
    border: baseStyle.border,
    boxShadow: baseStyle.boxShadow,
  };
};

// Helper funkce pro hover efekty
export const createHover = (type = 'lift') => {
  return modernEffects.hoverEffects[type] || modernEffects.hoverEffects.lift;
};

// Helper funkce pro vytvoření backdrop blur efektu (pro Dialog backdrop)
export const createBackdrop = () => ({
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
});

// Helper funkce pro vytvoření glassmorphism Dialog Paper props
export const createGlassDialog = (isDark = false, borderRadius = '20px') => ({
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  backgroundColor: isDark 
    ? 'rgba(26, 26, 26, 0.85)'
    : 'rgba(255, 255, 255, 0.85)',
  borderRadius,
  boxShadow: isDark
    ? '0 8px 32px rgba(139, 188, 143, 0.2), 0 4px 16px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(85, 107, 47, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
});

// Helper funkce pro moderní karty
export const createModernCard = (isDark = false, borderRadius = '20px') => ({
  elevation: 0,
  sx: {
    borderRadius,
    backgroundColor: isDark 
      ? 'rgba(26, 26, 26, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.08)',
    ...modernEffects.hoverEffects.lift,
  }
});

// Helper funkce pro transitions
export const createTransition = (properties = ['all'], duration = 0.3, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') => ({
  transition: properties.map(prop => `${prop} ${duration}s ${easing}`).join(', ')
});

// Export všeho
export const glassmorphism = modernEffects.glassmorphism.light;
export const glassmorphismDark = modernEffects.glassmorphism.dark;
export const animations = modernEffects.animations;
export const hoverEffects = modernEffects.hoverEffects;
// Helper funkce pro glow efekt (pro selected karty)
export const createGlow = (isSelected = false, color = 'rgba(139, 188, 143, 0.6)') => ({
  boxShadow: isSelected 
    ? `0 0 12px 2px ${color}`
    : '0 2px 8px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.2s',
});

export default {
  glassmorphism,
  glassmorphismDark,
  animations,
  hoverEffects,
  createGlass,
  createHover,
  createBackdrop,        // ← NOVÉ
  createGlassDialog,     // ← NOVÉ
  createModernCard,
  createTransition,
  createGlow,
};