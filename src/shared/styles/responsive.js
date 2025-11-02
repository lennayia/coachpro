// Responsive utility funkce pro layout a text
// Plain JavaScript funkce (ne React hooks) pro responsive design patterns

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
  createTextEllipsis,
};
