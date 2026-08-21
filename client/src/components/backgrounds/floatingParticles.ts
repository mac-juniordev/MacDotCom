// ============================================
// FLOATING PARTICLES ANIMATION
// Presets for particle backgrounds
// ============================================

import { Variants } from 'framer-motion';

// Drifting particles
export const driftParticles: Variants = {
  animate: {
    x: [0, 50, 0],
    y: [0, -100, 0],
    opacity: [0, 1, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

// Swirling particles
export const swirlParticles: Variants = {
  animate: {
    rotate: 360,
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};