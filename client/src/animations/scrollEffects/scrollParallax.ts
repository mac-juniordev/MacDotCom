// ============================================
// SCROLL PARALLAX ANIMATION
// Parallax effects on scroll
// ============================================

import { Variants } from 'framer-motion';

// Parallax image
export const parallaxImage: Variants = {
  animate: {
    y: ['-20%', '20%'],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'linear',
    },
  },
};