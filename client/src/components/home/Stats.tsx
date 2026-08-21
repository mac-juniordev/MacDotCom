// ============================================
// STATS COMPONENT
// Lucide icons + theme aware
// Fixed TypeScript icon typing
// ============================================

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  Rocket,
  Lightbulb,
  Heart,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface Stat {
  id: number;
  label: string;
  value: number;
  suffix: string;
  icon: LucideIcon;
  color: string;
}

const stats: Stat[] = [
  {
    id: 1,
    label: 'Projects Completed',
    value: 25,
    suffix: '+',
    icon: Rocket,
    color: '#3b82f6',
  },
  {
    id: 2,
    label: 'Products Built',
    value: 5,
    suffix: '+',
    icon: Lightbulb,
    color: '#10b981',
  },
  {
    id: 3,
    label: 'Happy Clients',
    value: 15,
    suffix: '+',
    icon: Heart,
    color: '#f59e0b',
  },
  {
    id: 4,
    label: 'Years Experience',
    value: 3,
    suffix: '+',
    icon: Zap,
    color: '#ef4444',
  },
];

const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  });

  const [counters, setCounters] = useState<number[]>(
    stats.map(() => 0)
  );

  // ============================================
  // ANIMATE COUNTERS WHEN SECTION IS VISIBLE
  // ============================================

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const timers: ReturnType<typeof setInterval>[] = [];

    stats.forEach((stat, index) => {
      let current = 0;

      const target = stat.value;
      const duration = 2000;
      const interval = 16;

      const increment = target / (duration / interval);

      const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        setCounters((previous) => {
          const next = [...previous];

          next[index] = Math.floor(current);

          return next;
        });
      }, interval);

      timers.push(timer);
    });

    // ============================================
    // CLEAN UP ALL INTERVALS
    // ============================================

    return () => {
      timers.forEach((timer) => {
        clearInterval(timer);
      });
    };
  }, [isInView]);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* ============================================
          BACKGROUND GLOW
      ============================================ */}

      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(16,185,129,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      {/* ============================================
          CONTENT
      ============================================ */}

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.8,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: 'spring',
                  bounce: 0.4,
                }}
                className="relative glass rounded-2xl p-6 text-center group"
              >
                {/* ============================================
                    HOVER GLOW
                ============================================ */}

                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(
                      circle at center,
                      ${stat.color}20 0%,
                      transparent 70%
                    )`,
                  }}
                />

                {/* ============================================
                    FLOATING ICON
                ============================================ */}

                <motion.div
                  className="relative mb-4 inline-block"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  <Icon
                    className="w-10 h-10"
                    style={{
                      color: stat.color,
                    }}
                  />
                </motion.div>

                {/* ============================================
                    COUNTER
                ============================================ */}

                <motion.div
                  className="relative text-4xl font-black"
                  style={{
                    color: stat.color,
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  {counters[index]}

                  <span className="text-2xl">
                    {stat.suffix}
                  </span>
                </motion.div>

                {/* ============================================
                    LABEL
                ============================================ */}

                <p className="relative mt-2 text-secondary">
                  {stat.label}
                </p>

                {/* ============================================
                    ANIMATED BORDER
                ============================================ */}

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                  style={{
                    background: stat.color,
                  }}
                  initial={{
                    scaleX: 0,
                  }}
                  whileInView={{
                    scaleX: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1,
                    delay: index * 0.2,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;