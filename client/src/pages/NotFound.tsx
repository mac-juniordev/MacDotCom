// ============================================
// NOT FOUND PAGE
// 404 page with animations
// ============================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleField from '../components/effects/ParticleField';

const NotFound = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <ParticleField count={30} />

      <div className="text-center relative z-10 px-4">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="mb-8"
        >
          <motion.h1
            className="text-9xl font-black"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
              404
            </span>
          </motion.h1>
        </motion.div>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Back home button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
              whileTap={{ scale: 0.9 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold"
            >
              Go Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${20 * i}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {['🚀', '💻', '⚡', '🎯', '🔧'][i]}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NotFound;