// ============================================
// ROTATING LINES COMPONENT
// Animated lines rotating around elements
// ============================================

import { motion } from 'framer-motion';

interface RotatingLinesProps {
  size?: number;
  color?: string;
  speed?: number;
  lines?: number;
}

const RotatingLines = ({
  size = 300,
  color = '#3b82f6',
  speed = 20,
  lines = 8,
}: RotatingLinesProps) => {
  // Make sure the number is a valid positive integer.
  const safeLines = Math.max(1, Math.floor(lines));

  // Inner ring uses half the number of lines.
  const innerLines = Math.max(1, Math.floor(safeLines / 2));

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* ============================================ */}
      {/* Outer rotating container */}
      {/* ============================================ */}

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {Array.from({ length: safeLines }, (_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: 2,
              height: size / 2,
              backgroundColor: color,
              transform: `rotate(${(i * 360) / safeLines}deg)`,
              transformOrigin: 'top center',
              marginLeft: -1,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scaleY: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* ============================================ */}
      {/* Inner rotating container */}
      {/* ============================================ */}

      <motion.div
        className="absolute inset-8"
        animate={{ rotate: -360 }}
        transition={{
          duration: speed * 0.7,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {Array.from({ length: innerLines }, (_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: 1,
              height: Math.max(0, (size - 64) / 2),
              backgroundColor: color,
              transform: `rotate(${(i * 360) / innerLines}deg)`,
              transformOrigin: 'top center',
              marginLeft: -0.5,
              opacity: 0.5,
            }}
            animate={{
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* ============================================ */}
      {/* Center glow */}
      {/* ============================================ */}

      <motion.div
        className="absolute inset-1/4 rounded-full"
        style={{
          backgroundColor: color,
        }}
        animate={{
          scale: [0.5, 1, 0.5],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default RotatingLines;
