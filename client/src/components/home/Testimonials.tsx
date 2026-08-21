// ============================================
// TESTIMONIALS COMPONENT - CONNECTED TO API
// Auto-published reviews from real clients
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import axios from 'axios';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  createdAt: string;
}

const API_URL = 'http://localhost:5000/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);

  // ============================================
  // FETCH TESTIMONIALS
  // ============================================

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/testimonials`
        );

        setTestimonials(response.data.data || []);
      } catch (error) {
        console.error(
          'Failed to fetch testimonials:',
          error
        );

        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // ============================================
  // AUTO-ROTATE TESTIMONIALS
  // ============================================

  useEffect(() => {
    if (testimonials.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setDirection(1);

      setCurrentIndex(
        (prev) => (prev + 1) % testimonials.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // ============================================
  // CURRENT TESTIMONIAL
  // ============================================

  const currentTestimonial =
    testimonials[currentIndex];

  // ============================================
  // GET INITIALS
  // ============================================

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // ============================================
  // GET AVATAR COLOR
  // ============================================

  const getAvatarColor = (name: string) => {
    const colors = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#ec4899',
    ];

    const firstCharacter =
      name.trim().charCodeAt(0) || 0;

    return colors[firstCharacter % colors.length];
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* ========================================
          ANIMATED BACKGROUND
      ======================================== */}

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ========================================
            SECTION HEADER
        ======================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Client Reviews
            </span>
          </h2>

          <motion.p
            className="text-secondary"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            What our clients say about us
          </motion.p>
        </motion.div>

        {/* ========================================
            LOADING STATE
        ======================================== */}

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
              className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : testimonials.length === 0 ? (
          /* ======================================
             EMPTY STATE
          ====================================== */

          <div className="text-center py-16">
            <Quote className="w-12 h-12 text-gray-400 mx-auto mb-4" />

            <p className="text-secondary">
              No reviews yet. Be the first to review!
            </p>
          </div>
        ) : (
          /* ======================================
             TESTIMONIAL
          ====================================== */

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial._id}
              initial={{
                opacity: 0,
                x: direction * 100,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -direction * 100,
              }}
              transition={{
                duration: 0.5,
              }}
              className="glass rounded-2xl p-8 text-center"
            >
              {/* Avatar */}
              <motion.div
                className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-black text-white"
                style={{
                  backgroundColor: getAvatarColor(
                    currentTestimonial.name
                  ),
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {getInitials(
                  currentTestimonial.name
                )}
              </motion.div>

              {/* ====================================
                  RATING STARS
              ==================================== */}

              <div className="flex justify-center gap-1 mb-4">
                {[0, 1, 2, 3, 4].map((index) => {
                  const isRated =
                    index < currentTestimonial.rating;

                  return (
                    <motion.span
                      key={index}
                      initial={{
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay: index * 0.1,
                      }}
                      whileHover={{
                        scale: 1.5,
                        rotate: 360,
                      }}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          isRated
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        }`}
                        fill={
                          isRated
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    </motion.span>
                  );
                })}
              </div>

              {/* ====================================
                  TESTIMONIAL CONTENT
              ==================================== */}

              <motion.p
                className="text-lg text-primary mb-6"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                "{currentTestimonial.content}"
              </motion.p>

              {/* ====================================
                  AUTHOR
              ==================================== */}

              <div>
                <h3 className="font-bold text-xl text-primary">
                  {currentTestimonial.name}
                </h3>

                <p className="text-secondary">
                  {currentTestimonial.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* ========================================
            NAVIGATION DOTS
        ======================================== */}

        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial._id}
                type="button"
                onClick={() => {
                  setDirection(
                    index > currentIndex ? 1 : -1
                  );

                  setCurrentIndex(index);
                }}
                aria-label={`View review ${index + 1}`}
                className="w-3 h-3 rounded-full"
                animate={{
                  scale:
                    index === currentIndex
                      ? 1.5
                      : 1,

                  backgroundColor:
                    index === currentIndex
                      ? '#3b82f6'
                      : '#d1d5db',
                }}
                whileHover={{
                  scale: 2,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;