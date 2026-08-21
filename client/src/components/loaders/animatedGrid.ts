// ============================================
// ANIMATED GRID ANIMATION
// Presets for grid backgrounds
// ============================================

import { Variants } from 'framer-motion';

// Moving grid
export const movingGrid: Variants = {
  animate: {
    backgroundPosition: ['0px 0px', '50px 50px'],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Pulsing grid
export const pulsingGrid: Variants = {
  animate: {
    opacity: [0.05, 0.15, 0.05],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};