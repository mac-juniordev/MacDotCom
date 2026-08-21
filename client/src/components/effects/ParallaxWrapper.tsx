// ============================================
// PARALLAX EFFECT ANIMATION
// Presets for parallax scrolling
// ============================================

import { Variants } from 'framer-motion';

// Parallax up
export const parallaxUp: Variants = {
  animate: {
    y: [-50, 50],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

// Parallax down
export const parallaxDown: Variants = {
  animate: {
    y: [50, -50],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};