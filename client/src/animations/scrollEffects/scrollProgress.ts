// ============================================
// SCROLL PROGRESS ANIMATION
// Progress indicators for scroll
// ============================================

import { Variants } from 'framer-motion';

// Progress bar
export const progressBar: Variants = {
  animate: {
    scaleX: [0, 1],
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },
};