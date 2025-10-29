// Cesta: src/shared/utils/animations.js
// Předpřipravené animace pro framer-motion

/**
 * Fade in animace
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

/**
 * Slide in zprava
 */
export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

/**
 * Slide in zleva
 */
export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

/**
 * Slide in shora
 */
export const slideInTop = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

/**
 * Slide in zdola
 */
export const slideInBottom = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 100, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

/**
 * Scale in (zoom)
 */
export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

/**
 * Stagger container - pro seznamy
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Stagger item - jednotlivé položky v seznamu
 */
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Hover scale efekt
 */
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

/**
 * Button press efekt
 */
export const buttonPress = {
  whileTap: { scale: 0.95 },
  transition: { duration: 0.1 },
};

/**
 * Card hover efekt
 */
export const cardHover = {
  whileHover: {
    y: -5,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  },
  transition: { duration: 0.2 },
};

/**
 * Shake animace (pro errory)
 */
export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

/**
 * Bounce animace
 */
export const bounce = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/**
 * Pulse animace
 */
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/**
 * Rotate animace
 */
export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Helper funkce pro vytvoření custom stagger efektu
 */
export const createStaggerContainer = (staggerDelay = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

/**
 * Helper funkce pro vytvoření custom fade in
 */
export const createFadeIn = (duration = 0.3, delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration, delay },
});

/**
 * Page transition - pro celé stránky
 */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

/**
 * Modal overlay animace
 */
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

/**
 * Modal content animace
 */
export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.2, ease: 'easeOut' },
};
