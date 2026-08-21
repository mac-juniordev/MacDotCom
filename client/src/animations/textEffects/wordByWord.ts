// ============================================
// WORD BY WORD ANIMATION
// Text reveal word by word
// ============================================

import { Variants } from 'framer-motion';

// Word reveal
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
    },
  }),
};

// Word scale
export const wordScale: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      type: 'spring',
    },
  }),
};