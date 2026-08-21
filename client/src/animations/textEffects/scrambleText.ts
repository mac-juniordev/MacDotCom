// ============================================
// SCRAMBLE TEXT ANIMATION
// Text scramble effect
// ============================================

import { Variants } from 'framer-motion';

// Scramble effect
export const scrambleText: Variants = {
  animate: {
    opacity: [0, 1, 1, 1],
    transition: {
      duration: 2,
      times: [0, 0.3, 0.7, 1],
      ease: 'easeInOut',
    },
  },
};