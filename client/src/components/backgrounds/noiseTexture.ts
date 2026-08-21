// ============================================
// NOISE TEXTURE ANIMATION
// Presets for noise effects
// ============================================

import { Variants } from 'framer-motion';

// Shifting noise
export const shiftingNoise: Variants = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 100%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};