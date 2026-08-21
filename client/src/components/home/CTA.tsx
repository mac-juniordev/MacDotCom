// ============================================
// CTA COMPONENT - FIXED
// Theme aware
// ============================================

import { motion } from 'framer-motion';
import MagneticWrapper from '../effects/MagneticWrapper';

const CTA = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(59,130,246,0.2) 0%, rgba(16,185,129,0.2) 100%)',
            'linear-gradient(-45deg, rgba(59,130,246,0.3) 0%, rgba(16,185,129,0.3) 100%)',
            'linear-gradient(45deg, rgba(59,130,246,0.2) 0%, rgba(16,185,129,0.2) 100%)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Floating shapes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? '#3b82f6' : '#10b981',
            left: `${20 * i}%`,
          }}
          animate={{
            y: [0, -100, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.h2
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-4xl sm:text-6xl font-black mb-6 text-primary"
        >
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
            Ready to Build Something Amazing?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-secondary mb-8"
        >
          Let's discuss your project and bring your vision to life.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <MagneticWrapper>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold text-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.a>
          </MagneticWrapper>

          <MagneticWrapper>
            <motion.a
              href="/projects"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-full font-semibold text-lg text-primary"
            >
              View Work
            </motion.a>
          </MagneticWrapper>
        </div>
      </div>
    </section>
  );
};

export default CTA;
