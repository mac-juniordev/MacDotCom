// ============================================
// HERO COMPONENT
// Full screen hero with maximum animations
// ============================================

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import RotatingLines from '../effects/RotatingLines';
import MagneticWrapper from '../effects/MagneticWrapper';
import FloatingObjects from '../effects/FloatingObjects';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const fullText = 'Building Digital Experiences';
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating tech objects */}
      <FloatingObjects />

      {/* Mouse follow glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          x: mousePosition.x * 200,
          y: mousePosition.y * 200,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
          className="inline-block mb-8"
        >
          <motion.div
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm font-medium text-blue-500">
              ✦ Available for new projects
            </span>
          </motion.div>
        </motion.div>

        {/* Main heading with letter animation */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight">
            {typedText.split('').map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="inline-block"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
            {/* Blinking cursor */}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-1 h-12 bg-blue-500 ml-2"
            />
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12"
        >
          We craft premium software solutions and digital experiences
          that transform businesses and delight users.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <MagneticWrapper>
            <motion.a
              href="/projects"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.3, duration: 0.5 }}
              whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-500 text-white rounded-full font-semibold relative overflow-hidden group"
            >
              <span className="relative z-10">View Projects</span>
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity, delay: 1 }}
              />
            </motion.a>
          </MagneticWrapper>

          <MagneticWrapper>
            <motion.a
              href="/contact"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              whileHover={{ scale: 1.1, borderColor: '#10b981' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-full font-semibold"
            >
              Contact Us
            </motion.a>
          </MagneticWrapper>
        </div>

        {/* Rotating lines around stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="relative w-[300px] h-[300px] mx-auto"
        >
          <RotatingLines size={300} color="#3b82f6" speed={20} lines={12} />
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.span
                className="text-5xl font-black text-blue-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                M
              </motion.span>
              <p className="text-sm text-gray-500 mt-2">MacDotCom</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;