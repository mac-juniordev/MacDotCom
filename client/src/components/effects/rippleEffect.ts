// ============================================
// RIPPLE EFFECT ANIMATION
// Presets for ripple effects
// ============================================

import { Variants } from 'framer-motion';

// Expanding ripple
export const expandingRipple: Variants = {
  animate: {
    scale: [0, 2],
    opacity: [1, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

// Multiple ripples
export const multipleRipples: Variants = {
  animate: {
    scale: [0, 1.5],
    opacity: [0.6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};