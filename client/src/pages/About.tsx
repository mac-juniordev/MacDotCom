// ============================================
// ABOUT PAGE
// About page with skills and timeline
// ============================================

import { motion } from 'framer-motion';
import SkillsOverview from '../components/home/SkillsOverview';
import Timeline from '../components/home/Timeline';
import RotatingLines from '../components/effects/RotatingLines';
import ParticleField from '../components/effects/ParticleField';

const About = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-20">
      {/* Background effects */}
      <ParticleField count={30} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl sm:text-6xl font-black mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                About MacDotCom
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              We are a software company focused on building digital experiences
              that transform businesses and delight users.
            </motion.p>
            
            <motion.p
              className="text-gray-600 dark:text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Founded in 2026, MacDotCom has been dedicated to creating premium
              software solutions. Our mission is to help businesses succeed through
              innovative technology and exceptional design.
            </motion.p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '3+', label: 'Years' },
                { value: '25+', label: 'Projects' },
                { value: '5+', label: 'Products' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.2, type: 'spring' }}
                  className="text-center glass rounded-xl p-4"
                >
                  <motion.span
                    className="text-3xl font-black text-blue-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {stat.value}
                  </motion.span>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rotating lines with center content */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            className="relative flex items-center justify-center"
          >
            <RotatingLines size={400} color="#3b82f6" speed={25} lines={16} />
            
            {/* Center content */}
            <motion.div
              className="absolute text-center"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              <span className="text-7xl font-black text-blue-500">M</span>
              <p className="text-sm text-gray-500 mt-2">MacDotCom</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Skills section */}
        <SkillsOverview />

        {/* Timeline section */}
        <Timeline />
      </div>
    </section>
  );
};

export default About;