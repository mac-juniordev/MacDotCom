// ============================================
// SHINE BUTTON ANIMATION
// Shine effect on buttons
// ============================================

import { Variants } from 'framer-motion';

// Shine effect
export const shineEffect: Variants = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: 1,
      ease: 'linear',
    },
  },
};