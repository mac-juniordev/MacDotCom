// ============================================
// LETTER BY LETTER ANIMATION
// Text reveal letter by letter
// ============================================

import { Variants } from 'framer-motion';

// Letter reveal
export const letterReveal: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

// Letter fade
export const letterFade: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.2,
    },
  }),
};