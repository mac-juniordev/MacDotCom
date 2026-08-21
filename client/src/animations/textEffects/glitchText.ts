// ============================================
// GLITCH TEXT ANIMATION
// Glitch text effect
// ============================================

import { Variants } from 'framer-motion';

// Glitch effect
export const glitchText: Variants = {
  animate: {
    x: [0, -2, 2, 0],
    textShadow: [
      '0 0 0 transparent',
      '2px 0 0 #ff0000, -2px 0 0 #00ff00',
      '-2px 0 0 #ff0000, 2px 0 0 #00ff00',
      '0 0 0 transparent',
    ],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};