// ============================================
// PARTICLE FIELD COMPONENT
// Animated particle system
// ============================================

import { motion } from 'framer-motion';

interface ParticleFieldProps {
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  moveX: number;
  moveY: number;
  duration: number;
  delay: number;
  size: number;
}

// Create deterministic particles.
// No Math.random() during render.
const createParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    x: (i * 37 + 13) % 100,
    y: (i * 61 + 7) % 100,
    moveX: ((i * 43) % 100) - 50,
    moveY: -50 - ((i * 29) % 100),
    duration: 3 + ((i * 17) % 50) / 10,
    delay: ((i * 19) % 50) / 10,
    size: 2 + (i % 3),
  }));
};

const ParticleField = ({
  count = 30,
}: ParticleFieldProps) => {
  const particles = createParticles(count);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-blue-500"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [0, particle.moveX],
            y: [0, particle.moveY],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;