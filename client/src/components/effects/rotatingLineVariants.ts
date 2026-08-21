// ============================================
// ROTATING LINE ANIMATION PRESETS
// Framer Motion variants for rotating effects
// ============================================

import type { Variants } from 'framer-motion';

// ============================================
// Continuous rotation
// ============================================

export const continuousRotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================
// Reverse rotation
// ============================================

export const reverseRotate: Variants = {
  animate: {
    rotate: -360,
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================
// Rotating with pulse
// ============================================

export const rotatePulse: Variants = {
  animate: {
    rotate: 360,
    scale: [1, 1.1, 1],
    transition: {
      rotate: {
        duration: 10,
        repeat: Infinity,
        ease: 'linear',
      },
      scale: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
}