// ============================================
// CONNECTION LINES ANIMATION
// Presets for connecting line effects
// ============================================

import { Variants } from 'framer-motion';

// Drawing lines
export const drawLines: Variants = {
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Pulsing lines
export const pulseLines: Variants = {
  animate: {
    opacity: [0.2, 0.8, 0.2],
    strokeWidth: [0.5, 2, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};