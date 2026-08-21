// ============================================
// GLOW EFFECT ANIMATION
// Presets for glow effects
// ============================================

import { Variants } from 'framer-motion';

// Pulsing glow
export const pulsingGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(59, 130, 246, 0)',
      '0 0 30px rgba(59, 130, 246, 0.5)',
      '0 0 0px rgba(59, 130, 246, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Strong glow
export const strongGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 10px rgba(59, 130, 246, 0.3)',
      '0 0 50px rgba(59, 130, 246, 0.8)',
      '0 0 10px rgba(59, 130, 246, 0.3)',
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};