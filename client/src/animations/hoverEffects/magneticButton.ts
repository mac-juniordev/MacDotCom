// ============================================
// MAGNETIC BUTTON ANIMATION
// Magnetic button hover effects
// ============================================

import { Variants } from 'framer-motion';

// Magnetic button
export const magneticButton: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.1,
    },
  },
};