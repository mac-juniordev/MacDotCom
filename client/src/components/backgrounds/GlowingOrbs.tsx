// ============================================
// GLOWING ORBS ANIMATION
// Presets for glowing orb backgrounds
// ============================================

import { Variants } from 'framer-motion';

// Floating orbs
export const floatingOrbs: Variants = {
  animate: {
    x: [0, 100, 0, -100, 0],
    y: [0, 50, 100, 50, 0],
    scale: [1, 1.2, 1, 0.8, 1],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Pulsing orbs
export const pulsingOrbs: Variants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};