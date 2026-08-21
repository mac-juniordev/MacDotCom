// ============================================
// GRADIENT TEXT ANIMATION
// Animated gradient text effects
// ============================================

import { Variants } from 'framer-motion';

// Moving gradient
export const movingGradient: Variants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Color shift
export const colorShift: Variants = {
  animate: {
    color: ['#3b82f6', '#10b981', '#f59e0b', '#3b82f6'],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};