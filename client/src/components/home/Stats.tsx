// ============================================
// STATS COMPONENT
// Animated statistics counter
// ============================================

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Stat {
  id: number;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
}

const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);

  const stats: Stat[] = [
    { id: 1, label: 'Projects Completed', value: 25, suffix: '+', icon: '🚀', color: '#3b82f6' },
    { id: 2, label: 'Products Built', value: 5, suffix: '+', icon: '💡', color: '#10b981' },
    { id: 3, label: 'Happy Clients', value: 15, suffix: '+', icon: '❤️', color: '#f59e0b' },
    { id: 4, label: 'Years Experience', value: 3, suffix: '+', icon: '⚡', color: '#ef4444' },
  ];

  // Animate counters when in view
  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        let current = 0;
        const target = stat.value;
        const duration = 2000;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(current);
            return newCounters;
          });
        }, 16);
      });
    }
  }, [isInView]);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(16,185,129,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: 'spring',
                bounce: 0.4,
              }}
              className="relative glass rounded-2xl p-6 text-center group"
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `radial-gradient(circle at center, ${stat.color}20 0%, transparent 70%)`,
                }}
              />

              {/* Floating icon */}
              <motion.div
                className="relative text-4xl mb-4 inline-block"
                animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {stat.icon}
              </motion.div>

              {/* Counter */}
              <motion.div
                className="relative text-4xl font-black"
                style={{ color: stat.color }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                {counters[index]}
                <span className="text-2xl">{stat.suffix}</span>
              </motion.div>

              {/* Label */}
              <p className="relative mt-2 text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>

              {/* Animated border */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                style={{ background: stat.color }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;