// ============================================
// FLOATING OBJECTS COMPONENT
// Floating tech icons and elements
// ============================================

import { motion } from 'framer-motion';

interface FloatingObject {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  type: string;
  color: string;
}

const FloatingObjects = () => {
  // Define floating objects
  const objects: FloatingObject[] = [
    { id: 1, x: 10, y: 20, size: 40, duration: 6, delay: 0, rotation: 360, type: 'react', color: '#61dafb' },
    { id: 2, x: 80, y: 15, size: 35, duration: 7, delay: 1, rotation: -360, type: 'node', color: '#68a063' },
    { id: 3, x: 70, y: 70, size: 45, duration: 5, delay: 0.5, rotation: 360, type: 'ts', color: '#3178c6' },
    { id: 4, x: 20, y: 75, size: 30, duration: 8, delay: 2, rotation: -360, type: 'mongo', color: '#47a248' },
    { id: 5, x: 50, y: 10, size: 25, duration: 4, delay: 1.5, rotation: 360, type: 'git', color: '#f05032' },
    { id: 6, x: 90, y: 50, size: 38, duration: 6.5, delay: 0.8, rotation: -360, type: 'docker', color: '#2496ed' },
    { id: 7, x: 30, y: 45, size: 32, duration: 5.5, delay: 2.5, rotation: 360, type: 'express', color: '#ffffff' },
    { id: 8, x: 60, y: 85, size: 28, duration: 7.5, delay: 1.2, rotation: -360, type: 'aws', color: '#ff9900' },
  ];

  // Get icon for each type
  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'react':
        return (
          <div className="relative">
            <motion.div
              className="w-full h-full rounded-full border-2"
              style={{ borderColor: color }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-2 rounded-full border" style={{ borderColor: color }} />
            <div className="absolute inset-1/3 rounded-full" style={{ backgroundColor: color }} />
          </div>
        );
      case 'node':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center text-xs font-bold"
            style={{ color }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            NODE
          </motion.div>
        );
      case 'ts':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center text-lg font-bold"
            style={{ color }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            TS
          </motion.div>
        );
      case 'mongo':
        return (
          <motion.div
            className="w-full h-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg viewBox="0 0 24 24" fill={color}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8z"/>
            </svg>
          </motion.div>
        );
      case 'git':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <svg viewBox="0 0 24 24" fill={color}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 12c-2.76 0-5-2.24-5-5 0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2 0 2.76-2.24 5-5 5z"/>
            </svg>
          </motion.div>
        );
      case 'docker':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center text-xs font-bold"
            style={{ color }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            DOCKER
          </motion.div>
        );
      case 'express':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center text-xs font-bold"
            style={{ color }}
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            EXPRESS
          </motion.div>
        );
      case 'aws':
        return (
          <motion.div
            className="w-full h-full flex items-center justify-center text-xs font-bold"
            style={{ color }}
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AWS
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {objects.map((obj) => (
        <motion.div
          key={obj.id}
          className="absolute"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: obj.size,
            height: obj.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: obj.rotation,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: obj.duration,
            delay: obj.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {getIcon(obj.type, obj.color)}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingObjects;