// ============================================
// ANIMATED BACKGROUND
// Layered background with moving elements
// ============================================

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  targetY: number;
  targetX: number;
  duration: number;
  delay: number;
}

// Deterministic particle configuration.
// Keeping this outside the component prevents
// impure calculations during React rendering.
const particles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 37 + 13) % 100,
  y: (i * 61 + 7) % 100,
  targetY: -50 - ((i * 29) % 100),
  targetX: ((i * 43) % 100) - 50,
  duration: 3 + ((i * 17) % 50) / 10,
  delay: ((i * 19) % 50) / 10,
}));

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  // Track mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">

      {/* ============================================ */}
      {/* Animated grid */}
      {/* ============================================ */}

      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* ============================================ */}
      {/* Glowing orb 1 */}
      {/* ============================================ */}

      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* ============================================ */}
      {/* Glowing orb 2 */}
      {/* ============================================ */}

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0, 80, 0],
          y: [0, -100, -50, -100, 0],
          scale: [1, 0.8, 1.2, 1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* ============================================ */}
      {/* Glowing orb 3 */}
      {/* ============================================ */}

      <motion.div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* ============================================ */}
      {/* Floating particles */}
      {/* ============================================ */}

      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500 rounded-full"
          initial={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, particle.targetY],
            x: [0, particle.targetX],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ============================================ */}
      {/* Mouse follow spotlight */}
      {/* ============================================ */}

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          x: mousePosition.x * 100,
          y: mousePosition.y * 100,
        }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20,
        }}
      />

      {/* ============================================ */}
      {/* Connection lines */}
      {/* ============================================ */}

      <svg className="absolute inset-0 w-full h-full opacity-20">
        <motion.line
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          stroke="#3b82f6"
          strokeWidth="0.5"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        <motion.line
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
          stroke="#10b981"
          strokeWidth="0.5"
          animate={{
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </svg>
    </div>
  );
};

export default AnimatedBackground

