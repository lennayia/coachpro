/**
 * Card Image Filters - Barevné filtry pro minimalistické ČB karty
 *
 * Transformuje ČB obrázky pomocí barevných overlayů podle motivu
 */

import { CARD_MOTIFS } from './cardDeckThemes';

/**
 * CSS filtry pro různé efekty na ČB obrázcích
 */
export const IMAGE_FILTERS = {
  // Základní duotone efekty
  SEPIA_WARM: 'sepia(0.5) saturate(1.2) hue-rotate(-10deg)',
  GREEN_NATURE: 'sepia(0.3) saturate(1.5) hue-rotate(60deg)',
  PURPLE_ABSTRACT: 'sepia(0.4) saturate(1.3) hue-rotate(240deg)',
  RAINBOW_MIX: 'saturate(1.5) contrast(1.1)',

  // Pokročilé efekty
  SOFT_CONTRAST: 'contrast(1.15) brightness(1.05)',
  SHARP_DETAIL: 'contrast(1.2) sharpen(0.3)',
  DREAMY: 'blur(0.5px) brightness(1.1) saturate(0.9)',
};

/**
 * Vrátí CSS filter pro daný motiv
 */
export const getMotifFilter = (motif) => {
  switch (motif) {
    case CARD_MOTIFS.HUMAN:
      return IMAGE_FILTERS.SEPIA_WARM;
    case CARD_MOTIFS.NATURE:
      return IMAGE_FILTERS.GREEN_NATURE;
    case CARD_MOTIFS.ABSTRACT:
      return IMAGE_FILTERS.PURPLE_ABSTRACT;
    case CARD_MOTIFS.MIX:
      return IMAGE_FILTERS.RAINBOW_MIX;
    default:
      return 'none';
  }
};

/**
 * Overlay opacity podle motivu (pro mix-blend-mode multiply)
 */
export const getMotifOverlayOpacity = (motif) => {
  switch (motif) {
    case CARD_MOTIFS.HUMAN:
      return 0.18; // Jemnější pro teplé tóny
    case CARD_MOTIFS.NATURE:
      return 0.15; // Přirozená zelená
    case CARD_MOTIFS.ABSTRACT:
      return 0.2; // Výraznější fialová
    case CARD_MOTIFS.MIX:
      return 0.12; // Subtilní pro rainbow
    default:
      return 0.15;
  }
};

/**
 * Gradient overlay pro Mix motiv (rainbow efekt)
 */
export const getMixGradientOverlay = (isDark = false) => {
  return isDark
    ? 'linear-gradient(135deg, rgba(82, 183, 136, 0.15) 0%, rgba(224, 122, 95, 0.15) 50%, rgba(177, 133, 219, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(82, 183, 136, 0.12) 0%, rgba(224, 122, 95, 0.12) 50%, rgba(177, 133, 219, 0.12) 100%)';
};

/**
 * Pokročilé nastavení filtru pro grid vs full-screen
 */
export const getCardImageStyles = (motif, isFullScreen = false, isDark = false) => {
  const baseFilter = getMotifFilter(motif);
  const overlayOpacity = getMotifOverlayOpacity(motif);

  return {
    // CSS filter na samotný obrázek
    filter: isFullScreen
      ? `${baseFilter} ${IMAGE_FILTERS.SOFT_CONTRAST}` // Více detailů v full-screen
      : baseFilter,

    // Overlay background (pro mix-blend-mode)
    overlayOpacity: isFullScreen ? overlayOpacity * 1.2 : overlayOpacity,

    // Gradient pro Mix motiv
    overlayBackground:
      motif === CARD_MOTIFS.MIX ? getMixGradientOverlay(isDark) : null,
  };
};

export default {
  IMAGE_FILTERS,
  getMotifFilter,
  getMotifOverlayOpacity,
  getMixGradientOverlay,
  getCardImageStyles,
};
