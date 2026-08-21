// ============================================
// TILT CARD ANIMATION
// 3D tilt card effect
// ============================================

import { Variants } from 'framer-motion';

// Tilt card
export const tiltCard: Variants = {
  initial: { rotateX: 0, rotateY: 0 },
  hover: {
    rotateX: 10,
    rotateY: 10,
    transition: {
      duration: 0.3,
    },
  },
};