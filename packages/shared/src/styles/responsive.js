// Responsive utility funkce pro layout a text
// Plain JavaScript funkce (ne React hooks) pro responsive design patterns

/**
 * Border radius constants - imported from CoachPro
 * Centralizované nastavení border radius pro celou ProApp ekosystém
 */
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

  // Glassmorphism elementy
  glassPanel: '40px',  // Velké glassmorphism panely
  dayHeader: '36px',   // Day header v DailyView
  streakBox: '33px',   // Streak box v completion screen
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

/**
 * Responsive spacing pro Layout a Page komponenty
 *
 * Centralizované responsive padding hodnoty pro konzistentní spacing napříč aplikací.
 * Všechny komponenty by měly používat tyto konstanty místo hardcoded hodnot.
 */
export const PAGE_PADDING = {
  px: { xs: 1.75, xsm: 1.875, md: 3 },  // 10px, 15px, 24px
  py: 3,  // 24px všude
};

export const SECTION_PADDING = {
  px: { xs: 0.5, sm: 1, md: 2 },  // 4px, 8px, 16px (navíc k PAGE_PADDING)
};

export const CARD_PADDING = {
       p: { xs: 1.5, sm: 2.5 },    // 12px na mobilu, 20px na desktopu
       pr: { xs: 1.25, sm: 2 },    // 10px na mobilu, 16px na desktopu (right redukováno kvůli ikonám)
};

/**
 * Line clamping s ellipsis (...) - používá WebKit line-clamp
 *
 * Řeší overflow dlouhých textů na malých obrazovkách pomocí ellipsis.
 * Podporuje multi-line ellipsis (ne jen single-line).
 *
 * @param {number} lines - Počet řádků před ellipsis (1, 2, 3, atd.)
 * @returns {object} - MUI sx object
 *
 * @example
 * // 1 řádek s ellipsis (URL, soubor)
 * <Typography sx={{ ...createTextEllipsis(1) }}>
 *
 * // 2 řádky s ellipsis (název)
 * <Typography sx={{ ...createTextEllipsis(2) }}>
 *
 * // 3 řádky s ellipsis (popis)
 * <Typography sx={{ ...createTextEllipsis(3) }}>
 */
export const createTextEllipsis = (lines = 1) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  minWidth: 0,
});

export default {
  BORDER_RADIUS,
  PAGE_PADDING,
  SECTION_PADDING,
  CARD_PADDING,
  createTextEllipsis,
};
