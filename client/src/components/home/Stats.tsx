// ============================================
// STATS COMPONENT - CONNECTED TO API
// Lucide icons + theme aware + real data
// React 19 compliant
// ============================================

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  Rocket,
  Lightbulb,
  Heart,
  Zap,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import axios from 'axios';

interface Stat {
  _id: string;
  label: string;
  value: number;
  suffix: string;
  prefix: string;
}

const API_URL = 'http://localhost:5000/api';

// ============================================
// Icon mapping
// ============================================

const iconMap: Record<string, LucideIcon> = {
  Projects: Rocket,
  Products: Lightbulb,
  Clients: Heart,
  Experience: Zap,
};

// ============================================
// Color mapping
// ============================================

const colorMap: Record<string, string> = {
  Projects: '#3b82f6',
  Products: '#10b981',
  Clients: '#f59e0b',
  Experience: '#ef4444',
};

// ============================================
// STATS COMPONENT
// ============================================

const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  });

  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState<number[]>([]);

  // ============================================
  // FETCH STATISTICS
  // ============================================

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/statistics`);

        if (cancelled) {
          return;
        }

        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        setStats(data);
        setCounters(data.map(() => 0));
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error('Failed to fetch statistics:', error);

        setStats([]);
        setCounters([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================
  // ANIMATE COUNTERS
  // ============================================

  useEffect(() => {
    if (!isInView || stats.length === 0) {
      return;
    }

    const timers: ReturnType<typeof setInterval>[] = [];

    stats.forEach((stat, index) => {
      let current = 0;

      const target = Math.max(
        0,
        Number(stat.value) || 0
      );

      const duration = 2000;
      const interval = 16;
      const steps = duration / interval;

      const increment = target / steps;

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

    return () => {
      timers.forEach((timer) => {
        clearInterval(timer);
      });
    };
  }, [isInView, stats]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <section className="relative py-20 overflow-hidden">
      {/* ============================================
          BACKGROUND GLOW
      ============================================ */}

      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
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
        {/* ============================================
            LOADING STATE
        ============================================ */}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : stats.length === 0 ? (
          /* ============================================
             EMPTY STATE
          ============================================ */

          <div className="text-center py-16">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />

            <p className="text-secondary">
              No statistics yet.
            </p>
          </div>
        ) : (
          /* ============================================
             STATS GRID
          ============================================ */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon =
                iconMap[stat.label] || BarChart3;

              const color =
                colorMap[stat.label] || '#3b82f6';

              const counterValue =
                counters[index] ?? 0;

              return (
                <motion.div
                  key={stat._id}
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
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  className="relative glass rounded-2xl p-6 text-center group overflow-hidden"
                >
                  {/* ============================================
                      HOVER GLOW
                  ============================================ */}

                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(
                        circle at center,
                        ${color}20 0%,
                        transparent 70%
                      )`,
                    }}
                  />

                  {/* ============================================
                      ICON
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
                        color,
                      }}
                    />
                  </motion.div>

                  {/* ============================================
                      COUNTER
                  ============================================ */}

                  <motion.div
                    className="relative text-4xl font-black"
                    style={{
                      color,
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
                    {stat.prefix}
                    {counterValue}

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
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl origin-left"
                    style={{
                      background: color,
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
        )}
      </div>
    </section>
  );
};

export default Stats;