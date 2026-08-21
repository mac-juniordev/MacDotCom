// ============================================
// MAIN LOADER COMPONENT
// Full screen loader with awesome animation
// ============================================

import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  targetY: number;
  scale: number;
  duration: number;
  delay: number;
}

// Generate deterministic particle values.
// No Math.random() during render.
const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 100,
  targetY: -100 - ((i * 47) % 200),
  scale: 0.5 + ((i * 17) % 15) / 10,
  duration: 2 + ((i * 23) % 30) / 10,
  delay: ((i * 13) % 20) / 10,
}));

const MainLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, #3b82f6 0%, #000000 100%)',
            'radial-gradient(circle at 50% 50%, #10b981 0%, #000000 100%)',
            'radial-gradient(circle at 50% 50%, #3b82f6 0%, #000000 100%)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, particle.targetY],
            opacity: [0, 1, 0],
            scale: [0, particle.scale, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Center logo */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 1,
          type: 'spring',
          bounce: 0.5,
        }}
      >
        {/* Rotating rings */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-500"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ borderStyle: 'dashed' }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-green-500"
            animate={{
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-4 rounded-full border border-yellow-500"
            animate={{
              rotate: 360,
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Center M */}
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-5xl font-black text-white"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            M
          </motion.span>
        </div>

        {/* Loading title */}
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          MacDotCom
        </motion.h1>

        {/* Loading bar */}
        <motion.div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Loading message */}
        <motion.p
          className="mt-4 text-sm text-gray-400"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        >
          Loading Experience...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default MainLoader;