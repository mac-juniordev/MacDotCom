// ============================================
// PARTICLE SYSTEM ANIMATION
// Presets for particle effects
// ============================================

import { Variants } from 'framer-motion';

// Rising particles
export const riseParticles: Variants = {
  animate: {
    y: [-100, 100],
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

// Floating particles
export const floatParticles: Variants = {
  animate: {
    x: [0, 20, -20, 0],
    y: [0, -30, 0],
    opacity: [0.3, 0.8, 0.3],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Exploding particles
export const explodeParticles: Variants = {
  animate: {
    scale: [0, 1.5, 0],
    opacity: [1, 0.5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};