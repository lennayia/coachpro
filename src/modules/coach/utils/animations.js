// 🎨 Framer Motion animace pro CoachPro

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

// Fade in up animation
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Stagger container (pro postupné zobrazení dětí)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Stagger item (použít jako child staggerContainer)
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Scale up animation (pro modaly)
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// Slide in from right (pro drawers)
export const slideInRight = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    x: '100%',
    transition: { duration: 0.2 }
  }
};

// Card hover animation
export const cardHover = {
  rest: {
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  }
};

// Confetti trigger helper
export const triggerConfetti = () => {
  // Pro react-confetti komponentu
  // Tato funkce je placeholder - konfety se spustí přes state v komponentě
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('coachpro-confetti'));
  }
};

export default {
  fadeIn,
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleUp,
  slideInRight,
  cardHover,
  triggerConfetti
};
