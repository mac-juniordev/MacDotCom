// ============================================
// TIMELINE COMPONENT - FIXED
// Theme aware
// ============================================

import { motion } from 'framer-motion';

interface TimelineEntry {
  id: number;
  year: string;
  title: string;
  description: string;
  type: string;
}

const Timeline = () => {
  const entries: TimelineEntry[] = [
    {
      id: 1,
      year: '2024',
      title: 'Started MERN Development',
      description: 'Began building full-stack applications with MongoDB, Express, React, and Node.js',
      type: 'experience',
    },
    {
      id: 2,
      year: '2025',
      title: 'Built TradeMirror',
      description: 'Created real-time trading analytics platform with AI predictions',
      type: 'achievement',
    },
    {
      id: 3,
      year: '2026',
      title: 'Founded MacDotCom',
      description: 'Launched software company focused on digital experiences',
      type: 'milestone',
    },
  ];

  return (
    <section className="relative py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary">
            <span className="bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
              Our Journey
            </span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Animated vertical line */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.3,
                type: 'spring',
                bounce: 0.3,
              }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <motion.div
                className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-1/2"
                animate={{ scale: [1, 1.5, 1], boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 20px rgba(59,130,246,0.8)', '0 0 0px rgba(59,130,246,0)'] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              />

              {/* Content */}
              <motion.div
                className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="glass rounded-2xl p-6">
                  <motion.span
                    className="text-2xl font-black text-blue-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {entry.year}
                  </motion.span>
                  <h3 className="text-xl font-bold mt-2 text-primary">{entry.title}</h3>
                  <p className="text-secondary mt-2">
                    {entry.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;