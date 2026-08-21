// ============================================
// TRANSITION PRESETS
// Common transition configurations
// ============================================

import { Transition } from 'framer-motion';

// Smooth transition
export const smoothTransition: Transition = {
  duration: 0.8,
  ease: [0.6, -0.05, 0.01, 0.99],
};

// Spring transition
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
};

// Bouncy transition
export const bouncyTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 10,
  mass: 0.5,
};

// Fast transition
export const fastTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
};

// Slow transition
export const slowTransition: Transition = {
  duration: 1.5,
  ease: 'easeInOut',
};

// Stagger transition
export const staggerTransition: Transition = {
  staggerChildren: 0.1,
  delayChildren: 0.3,
};