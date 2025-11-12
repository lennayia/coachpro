// @digipro/design-system/themes/colorSchemes.js
// Enhanced color schemes system from DigiPro - Multiple themed palettes

export const colorSchemes = {
  // 🌈 Rainbow - Duha + Modro-fialová (DigiPro signature)
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Design',
    description: 'Originální DigiPro barevné schéma',
    gradient: 'linear-gradient(135deg, #082DC5 0%, #10b981 100%)',
    
    // Per-page theming for different modules
    pages: {
      dashboard:    { primary: '#f50076', secondary: '#f50076' }, // Růžová
      payments:     { primary: '#082DC5', secondary: '#4704A9' }, // Modrá → Fialová
      reserve:      { primary: '#00B449', secondary: '#10b981' }, // Zelená
      statistics:   { primary: '#f97316', secondary: '#EAD408' }, // Oranžová → Žlutá
      settings:     { primary: '#400064', secondary: '#6366f1' }, // Tmavě fialová
    },
    
    // Global colors
    utilities: { primary: '#6366f1' },
    sidebar: { gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
    
    // Status colors
    status: {
      success: '#00B449',
      warning: '#EAD408', 
      error: '#f50076',
      info: '#082DC5',
    }
  },

  // 🌿 Nature - Přírodní tóny
  nature: {
    id: 'nature',
    name: 'Nature Tones',
    description: 'Zemité a přírodní barvy',
    gradient: 'linear-gradient(135deg, #065f46 0%, #134e4a 100%)',
    
    pages: {
      dashboard:    { primary: '#BC8F8F', secondary: '#A0522D' }, // dustyRose
      payments:     { primary: '#556B2F', secondary: '#2F4F4F' }, // forest → navy
      reserve:      { primary: '#8FBC8F', secondary: '#065f46' }, // sage → dark green
      statistics:   { primary: '#B87333', secondary: '#DAA520' }, // terracotta → mustard
      settings:     { primary: '#708090', secondary: '#483D8B' }, // slate
    },
    
    utilities: { primary: '#483D8B' },
    sidebar: { gradient: 'linear-gradient(135deg, #483D8B 0%, #2F4F4F 100%)' },
    
    status: {
      success: '#8FBC8F',
      warning: '#DAA520',
      error: '#BC8F8F',
      info: '#556B2F',
    }
  },

  // ☁️ Flow - Pastelové nebe
  flow: {
    id: 'flow',
    name: 'Pastel Sky',
    description: 'Jemné pastelové odstíny',
    gradient: 'linear-gradient(135deg, #a5b4fc 0%, #fbcfe8 100%)',
    
    pages: {
      dashboard:    { primary: '#C7B9FF', secondary: '#A9D6FF' }, // levandulová
      payments:     { primary: '#A9D6FF', secondary: '#D4ADFC' }, // nebesky modrá → šeříková
      reserve:      { primary: '#A3E4D7', secondary: '#C7B9FF' }, // mátová
      statistics:   { primary: '#FFC8A2', secondary: '#FFF6A5' }, // broskvová → žlutá
      settings:     { primary: '#FFB3E6', secondary: '#D4ADFC' }, // pudrově růžová
    },
    
    utilities: { primary: '#A9D6FF' },
    sidebar: { gradient: 'linear-gradient(135deg, #A9D6FF 0%, #FFB3E6 100%)' },
    
    status: {
      success: '#A3E4D7',
      warning: '#FFF6A5',
      error: '#FFB3E6',
      info: '#A9D6FF',
    }
  },

  // ⚡ Cyber - Neonové barvy
  cyber: {
    id: 'cyber',
    name: 'Cyber Green',
    description: 'Futuristické neonové barvy',
    gradient: 'linear-gradient(135deg, #279521 0%, #000000 100%)',
    
    pages: {
      dashboard:    { primary: '#279521', secondary: '#00BFFF' }, // neonová zelená
      payments:     { primary: '#00BFFF', secondary: '#FF00FF' }, // elektrická modrá → magenta
      reserve:      { primary: '#00FFFF', secondary: '#7FFF00' }, // azurová → U.F.O. zelená
      statistics:   { primary: '#F7FF00', secondary: '#279521' }, // kyber žlutá
      settings:     { primary: '#A72795', secondary: '#FF00FF' }, // fialový neon
    },
    
    utilities: { primary: '#00BFFF' },
    sidebar: { gradient: 'linear-gradient(135deg, #279521 0%, #00BFFF 100%)' },
    
    status: {
      success: '#7FFF00',
      warning: '#F7FF00',
      error: '#FF00FF',
      info: '#00BFFF',
    }
  },

  // 🖤 Minimalist - White & Bordeaux
  minimalist: {
    id: 'minimalist',
    name: 'Minimal Bordeaux',
    description: 'Elegantní minimalistické tóny',
    gradient: 'linear-gradient(135deg, #900000 0%, #2F4F4F 100%)',
    
    pages: {
      dashboard:    { primary: '#900000', secondary: '#7A0000' }, // vínová
      payments:     { primary: '#36454F', secondary: '#2F4F4F' }, // tmavě šedá → antracitová
      reserve:      { primary: '#7A0000', secondary: '#900000' }, // tmavší vínová
      statistics:   { primary: '#808080', secondary: '#D3D3D3' }, // středně šedá → světlá
      settings:     { primary: '#000000', secondary: '#36454F' }, // černá
    },
    
    utilities: { primary: '#900000' },
    sidebar: { gradient: 'linear-gradient(135deg, #36454F 0%, #000000 100%)' },
    
    status: {
      success: '#7A0000',
      warning: '#D3D3D3',
      error: '#900000',
      info: '#36454F',
    }
  },

  // 💎 PaymentsPro - Speciální schéma pro payments
  paymentspro: {
    id: 'paymentspro',
    name: 'PaymentsPro Professional',
    description: 'Specializované schéma pro finanční aplikace',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)',
    
    pages: {
      dashboard:    { primary: '#3b82f6', secondary: '#1e40af' }, // modrá
      payments:     { primary: '#059669', secondary: '#047857' }, // zelená (příjmy)
      reserve:      { primary: '#dc2626', secondary: '#b91c1c' }, // červená (výdaje)
      statistics:   { primary: '#7c3aed', secondary: '#6d28d9' }, // fialová (analytika)
      settings:     { primary: '#64748b', secondary: '#475569' }, // šedá (nastavení)
    },
    
    utilities: { primary: '#6366f1' },
    sidebar: { gradient: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)' },
    
    status: {
      success: '#059669',    // Zelená pro úspěch/příjmy
      warning: '#f59e0b',    // Oranžová pro varování/čekající
      error: '#dc2626',      // Červená pro chyby/výdaje
      info: '#3b82f6',       // Modrá pro info
    }
  }
};

// Utility funkce pro práci s color schemes
export const buildFullThemeProps = (color) => ({
  primary: color,
  secondary: color,
  gradient: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
  background: `linear-gradient(180deg, ${color}05 0%, ${color}15 100%)`,
  hover: `${color}20`,
  active: `${color}30`,
});

// Získání theme pro specifickou stránku a schéma
export const getPageTheme = (pageId = 'dashboard', schemeId = 'rainbow') => {
  const scheme = colorSchemes[schemeId] || colorSchemes.rainbow;
  const pageColor = scheme.pages[pageId]?.primary || scheme.pages.dashboard.primary;
  
  return {
    ...buildFullThemeProps(pageColor),
    scheme: scheme,
    pageId: pageId,
  };
};

// Získání aktuálního color scheme
export const getColorScheme = (schemeId = 'rainbow') => {
  return colorSchemes[schemeId] || colorSchemes.rainbow;
};

// Všechny dostupné schémata pro UI picker
export const getAllSchemes = () => {
  return Object.values(colorSchemes);
};

// Kontrola, jestli je schéma dark nebo light friendly
export const isDarkFriendlyScheme = (schemeId) => {
  const darkFriendly = ['cyber', 'minimalist'];
  return darkFriendly.includes(schemeId);
};

// Doporučené schéma pro specifický typ aplikace
export const getRecommendedScheme = (appType = 'general') => {
  const recommendations = {
    'payments': 'paymentspro',
    'analytics': 'cyber',
    'creative': 'rainbow',
    'corporate': 'minimalist',
    'wellness': 'nature',
    'general': 'flow',
  };
  
  return recommendations[appType] || 'rainbow';
};

export default colorSchemes;