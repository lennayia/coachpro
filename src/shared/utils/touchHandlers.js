// Cesta: src/shared/utils/touchHandlers.js
// Touch handling utilities pro mobilní zařízení

/**
 * Detekce touch zařízení
 */
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Hook pro detekci swipe gestures
 * Vrací směr swipe: 'left', 'right', 'up', 'down', nebo null
 */
export const useSwipe = (threshold = 50) => {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e, onSwipe) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        const direction = deltaX > 0 ? 'right' : 'left';
        if (onSwipe) onSwipe(direction);
        return direction;
      }
    }
    // Vertical swipe is dominant
    else {
      if (Math.abs(deltaY) > threshold) {
        const direction = deltaY > 0 ? 'down' : 'up';
        if (onSwipe) onSwipe(direction);
        return direction;
      }
    }

    return null;
  };

  return {
    handleTouchStart,
    handleTouchEnd,
  };
};

/**
 * Touch event handlers pro React komponenty
 * Použití:
 *   const swipe = createSwipeHandlers({
 *     onSwipeLeft: () => console.log('Swipe left'),
 *     onSwipeRight: () => console.log('Swipe right')
 *   });
 *
 *   <div {...swipe}>Swipeable content</div>
 */
export const createSwipeHandlers = (options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
  } = options;

  let touchStartX = 0;
  let touchStartY = 0;

  return {
    onTouchStart: (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },

    onTouchEnd: (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        }
      }
      // Vertical swipe
      else {
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }
    },
  };
};

/**
 * Long press handler
 * Použití:
 *   const longPress = createLongPressHandler({
 *     onLongPress: () => console.log('Long press detected'),
 *     delay: 500
 *   });
 *
 *   <button {...longPress}>Press me</button>
 */
export const createLongPressHandler = (options = {}) => {
  const { onLongPress, delay = 500 } = options;

  let timeout;

  return {
    onTouchStart: () => {
      timeout = setTimeout(() => {
        if (onLongPress) onLongPress();
      }, delay);
    },

    onTouchEnd: () => {
      if (timeout) clearTimeout(timeout);
    },

    onTouchMove: () => {
      if (timeout) clearTimeout(timeout);
    },
  };
};

/**
 * Prevence double-tap zoom na mobilních zařízeních
 */
export const preventDoubleTapZoom = (element) => {
  let lastTouchEnd = 0;

  element.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
};
