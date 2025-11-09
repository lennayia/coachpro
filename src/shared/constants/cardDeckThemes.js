/**
 * Card Deck Themes - Barevná schémata pro koučovací karty
 *
 * 4 motivy: Člověk, Příroda, Abstrakt, Mix
 * Každý motiv má vlastní paletu, gradienty a efekty
 */

export const CARD_MOTIFS = {
  HUMAN: 'human',
  NATURE: 'nature',
  ABSTRACT: 'abstract',
  MIX: 'mix',
};

export const CARD_MOTIF_LABELS = {
  [CARD_MOTIFS.HUMAN]: 'Člověk',
  [CARD_MOTIFS.NATURE]: 'Příroda',
  [CARD_MOTIFS.ABSTRACT]: 'Abstrakt',
  [CARD_MOTIFS.MIX]: 'Mix',
};

export const CARD_MOTIF_ICONS = {
  [CARD_MOTIFS.HUMAN]: '👤',
  [CARD_MOTIFS.NATURE]: '🌿',
  [CARD_MOTIFS.ABSTRACT]: '🎨',
  [CARD_MOTIFS.MIX]: '🔀',
};

export const CARD_MOTIF_DESCRIPTIONS = {
  [CARD_MOTIFS.HUMAN]: 'Teplé, lidské tóny pro osobní reflexi',
  [CARD_MOTIFS.NATURE]: 'Přirozené zelené tóny spojení s přírodou',
  [CARD_MOTIFS.ABSTRACT]: 'Živé, moderní barvy pro kreativní myšlení',
  [CARD_MOTIFS.MIX]: 'Kombinace všech motivů pro rozmanitost',
};

// Barevná paleta pro každý motiv (light + dark mode)
export const CARD_THEMES = {
  [CARD_MOTIFS.HUMAN]: {
    light: {
      primary: '#E07A5F',
      secondary: '#F4A261',
      accent: '#3D405B',
      background: 'linear-gradient(135deg, #F4E8DC 0%, #E8D5C4 100%)',
      cardBg: 'rgba(244, 232, 220, 0.9)',
      cardBorder: 'rgba(224, 122, 95, 0.3)',
      text: '#3D405B',
      textSecondary: 'rgba(61, 64, 91, 0.7)',
      hover: 'rgba(224, 122, 95, 0.15)',
      glow: 'rgba(224, 122, 95, 0.4)',
    },
    dark: {
      primary: '#E07A5F',
      secondary: '#F4A261',
      accent: '#B8B8D1',
      background: 'linear-gradient(135deg, #2A2520 0%, #3D3530 100%)',
      cardBg: 'rgba(42, 37, 32, 0.9)',
      cardBorder: 'rgba(224, 122, 95, 0.4)',
      text: '#F4E8DC',
      textSecondary: 'rgba(244, 232, 220, 0.7)',
      hover: 'rgba(224, 122, 95, 0.25)',
      glow: 'rgba(224, 122, 95, 0.6)',
    },
  },
  [CARD_MOTIFS.NATURE]: {
    light: {
      primary: '#52B788',
      secondary: '#74C69D',
      accent: '#40916C',
      background: 'linear-gradient(135deg, #D8F3DC 0%, #B7E4C7 100%)',
      cardBg: 'rgba(216, 243, 220, 0.9)',
      cardBorder: 'rgba(82, 183, 136, 0.3)',
      text: '#2D6A4F',
      textSecondary: 'rgba(45, 106, 79, 0.7)',
      hover: 'rgba(82, 183, 136, 0.15)',
      glow: 'rgba(82, 183, 136, 0.4)',
    },
    dark: {
      primary: '#52B788',
      secondary: '#74C69D',
      accent: '#95D5B2',
      background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
      cardBg: 'rgba(27, 67, 50, 0.9)',
      cardBorder: 'rgba(82, 183, 136, 0.4)',
      text: '#D8F3DC',
      textSecondary: 'rgba(216, 243, 220, 0.7)',
      hover: 'rgba(82, 183, 136, 0.25)',
      glow: 'rgba(82, 183, 136, 0.6)',
    },
  },
  [CARD_MOTIFS.ABSTRACT]: {
    light: {
      primary: '#B185DB',
      secondary: '#E76F51',
      accent: '#2A9D8F',
      background: 'linear-gradient(135deg, #F4E8FF 0%, #E5D4FF 100%)',
      cardBg: 'rgba(244, 232, 255, 0.9)',
      cardBorder: 'rgba(177, 133, 219, 0.3)',
      text: '#5B2A86',
      textSecondary: 'rgba(91, 42, 134, 0.7)',
      hover: 'rgba(177, 133, 219, 0.15)',
      glow: 'rgba(177, 133, 219, 0.4)',
    },
    dark: {
      primary: '#B185DB',
      secondary: '#E76F51',
      accent: '#2A9D8F',
      background: 'linear-gradient(135deg, #3D2A54 0%, #5B2A86 100%)',
      cardBg: 'rgba(61, 42, 84, 0.9)',
      cardBorder: 'rgba(177, 133, 219, 0.4)',
      text: '#F4E8FF',
      textSecondary: 'rgba(244, 232, 255, 0.7)',
      hover: 'rgba(177, 133, 219, 0.25)',
      glow: 'rgba(177, 133, 219, 0.6)',
    },
  },
  [CARD_MOTIFS.MIX]: {
    light: {
      primary: 'linear-gradient(135deg, #52B788 0%, #E07A5F 50%, #B185DB 100%)',
      secondary: 'linear-gradient(90deg, #F4A261 0%, #74C69D 50%, #E76F51 100%)',
      accent: '#2A9D8F',
      background: 'linear-gradient(135deg, #F4E8DC 0%, #D8F3DC 33%, #F4E8FF 66%, #FFE5EC 100%)',
      cardBg: 'rgba(255, 255, 255, 0.9)',
      cardBorder: 'rgba(177, 133, 219, 0.3)',
      text: '#2D3748',
      textSecondary: 'rgba(45, 55, 72, 0.7)',
      hover: 'rgba(177, 133, 219, 0.15)',
      glow: 'rgba(82, 183, 136, 0.4)',
    },
    dark: {
      primary: 'linear-gradient(135deg, #52B788 0%, #E07A5F 50%, #B185DB 100%)',
      secondary: 'linear-gradient(90deg, #F4A261 0%, #74C69D 50%, #E76F51 100%)',
      accent: '#2A9D8F',
      background: 'linear-gradient(135deg, #2A2520 0%, #1B4332 33%, #3D2A54 66%, #3D2A3D 100%)',
      cardBg: 'rgba(42, 37, 32, 0.9)',
      cardBorder: 'rgba(177, 133, 219, 0.4)',
      text: '#F4F4F4',
      textSecondary: 'rgba(244, 244, 244, 0.7)',
      hover: 'rgba(177, 133, 219, 0.25)',
      glow: 'rgba(82, 183, 136, 0.6)',
    },
  },
};

// Deck identifiers (A, B, C, D)
export const CARD_DECKS = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
};

export const CARD_DECK_LABELS = {
  [CARD_DECKS.A]: 'Balíček A',
  [CARD_DECKS.B]: 'Balíček B',
  [CARD_DECKS.C]: 'Balíček C',
  [CARD_DECKS.D]: 'Balíček D',
};

export const CARD_DECK_DESCRIPTIONS = {
  [CARD_DECKS.A]: 'Základní kolekce pro začátečníky',
  [CARD_DECKS.B]: 'Pokročilá reflexe a sebepoznání',
  [CARD_DECKS.C]: 'Kreativní průzkum a experimenty',
  [CARD_DECKS.D]: 'Hluboká introspekce a transformace',
};

// Helper funkce pro získání theme podle motivu a módu
export const getCardTheme = (motif, isDark = false) => {
  const mode = isDark ? 'dark' : 'light';
  return CARD_THEMES[motif]?.[mode] || CARD_THEMES[CARD_MOTIFS.NATURE][mode];
};

// Helper funkce pro vytvoření glassmorphism efektu s theme barvami
export const createCardGlassEffect = (motif, isDark = false) => {
  const theme = getCardTheme(motif, isDark);

  return {
    background: theme.cardBg,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${theme.cardBorder}`,
    boxShadow: isDark
      ? `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${theme.cardBorder}`
      : `0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px ${theme.cardBorder}`,
  };
};

// Helper funkce pro hover efekt
export const createCardHoverEffect = (motif, isDark = false) => {
  const theme = getCardTheme(motif, isDark);

  return {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${theme.glow}, 0 0 0 2px ${theme.primary}`,
  };
};

export default {
  CARD_MOTIFS,
  CARD_MOTIF_LABELS,
  CARD_MOTIF_ICONS,
  CARD_MOTIF_DESCRIPTIONS,
  CARD_THEMES,
  CARD_DECKS,
  CARD_DECK_LABELS,
  CARD_DECK_DESCRIPTIONS,
  getCardTheme,
  createCardGlassEffect,
  createCardHoverEffect,
};
