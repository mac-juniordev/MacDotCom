// ============================================
// TIMELINE COMPONENT - CONNECTED TO API
// Theme aware + real data
// ============================================

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import axios from 'axios';

interface TimelineEntry {
  _id: string;
  year: string;
  title: string;
  description: string;
  type: string;
  isVisible: boolean;
}

const API_URL = 'http://localhost:5000/api';

const Timeline = () => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await axios.get(`${API_URL}/timeline`);

        setEntries(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  // Sort by year descending
  const sortedEntries = [...entries].sort(
    (a, b) => parseInt(b.year, 10) - parseInt(a.year, 10)
  );

  return (
    <section className="relative py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary">
            <span className="bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
              Our Journey
            </span>
          </h2>
        </motion.div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full"
            />
          </div>
        ) : sortedEntries.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />

            <p className="text-secondary">
              No timeline entries yet.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Animated vertical line */}
            <motion.div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 2,
                ease: 'easeOut',
              }}
              style={{
                transformOrigin: 'top',
              }}
            />

            {sortedEntries.map((entry, index) => (
              <motion.div
                key={entry._id}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -100 : 100,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.3,
                  type: 'spring',
                  bounce: 0.3,
                }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0
                    ? 'md:flex-row'
                    : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-1/2 z-10"
                  animate={{
                    scale: [1, 1.5, 1],
                    boxShadow: [
                      '0 0 0px rgba(59,130,246,0)',
                      '0 0 20px rgba(59,130,246,0.8)',
                      '0 0 0px rgba(59,130,246,0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: 'easeInOut',
                  }}
                />

                {/* Timeline content */}
                <motion.div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0
                      ? 'md:pr-12'
                      : 'md:pl-12'
                  }`}
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div className="glass rounded-2xl p-6">
                    {/* Year */}
                    <motion.span
                      className="text-2xl font-black text-blue-500 inline-block"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {entry.year}
                    </motion.span>

                    {/* Title */}
                    <h3 className="text-xl font-bold mt-2 text-primary">
                      {entry.title}
                    </h3>

                    {/* Description */}
                    <p className="text-secondary mt-2">
                      {entry.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Timeline;