// ============================================
// INFINITE MARQUEE ANIMATION
// Infinite scrolling marquee
// ============================================

import { Variants } from 'framer-motion';

// Marquee left
export const marqueeLeft: Variants = {
  animate: {
    x: [0, '-50%'],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Marquee right
export const marqueeRight: Variants = {
  animate: {
    x: ['-50%', 0],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};