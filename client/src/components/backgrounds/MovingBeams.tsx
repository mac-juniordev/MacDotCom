// ============================================
// MOVING BEAMS ANIMATION
// Presets for light beam effects
// ============================================

import { Variants } from 'framer-motion';

// Scanning beam
export const scanningBeam: Variants = {
  animate: {
    x: ['-100%', '100%'],
    opacity: [0, 1, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Rotating beam
export const rotatingBeam: Variants = {
  animate: {
    rotate: 360,
    opacity: [0.3, 0.8, 0.3],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};