// ============================================
// SPOTLIGHT CARD ANIMATION
// Spotlight following cursor effect
// ============================================

import { Variants } from 'framer-motion';

// Spotlight
export const spotlight: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};