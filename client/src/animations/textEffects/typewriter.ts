// ============================================
// TYPEWRITER ANIMATION
// Typewriter text effect
// ============================================

import { Variants } from 'framer-motion';

// Cursor blink
export const cursorBlink: Variants = {
  animate: {
    opacity: [1, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};