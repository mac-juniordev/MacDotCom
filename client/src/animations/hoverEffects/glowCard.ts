// ============================================
// GLOW CARD ANIMATION
// Glowing card hover effect
// ============================================

import { Variants } from 'framer-motion';

// Glow card
export const glowCard: Variants = {
  initial: { boxShadow: '0 0 0px rgba(59, 130, 246, 0)' },
  hover: {
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
    transition: {
      duration: 0.3,
    },
  },
};