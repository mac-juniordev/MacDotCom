// ============================================
// TESTIMONIALS COMPONENT
// Animated client testimonials carousel
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'CEO, TechCorp',
      content: 'MacDotCom delivered an exceptional product that exceeded our expectations. The attention to detail and quality of code is outstanding.',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'CTO, StartupX',
      content: 'Working with MacDotCom was a game-changer for our business. They understood our vision and brought it to life beautifully.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Founder, DevHub',
      content: 'The team at MacDotCom is incredibly talented. They delivered our platform ahead of schedule with amazing quality.',
      rating: 5,
      avatar: '👨‍💻',
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              What Clients Say
            </span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-8 text-center"
          >
            {/* Avatar */}
            <motion.div
              className="text-6xl mb-4 inline-block"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              {currentTestimonial.avatar}
            </motion.div>

            {/* Rating stars */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl"
                  whileHover={{ scale: 1.5, rotate: 360 }}
                >
                  ⭐
                </motion.span>
              ))}
            </div>

            {/* Content */}
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 mb-6"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              "{currentTestimonial.content}"
            </motion.p>

            {/* Author */}
            <div>
              <h3 className="font-bold text-xl">{currentTestimonial.name}</h3>
              <p className="text-gray-500">{currentTestimonial.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className="w-3 h-3 rounded-full"
              animate={{
                scale: index === currentIndex ? 1.5 : 1,
                backgroundColor: index === currentIndex ? '#3b82f6' : '#d1d5db',
              }}
              whileHover={{ scale: 2 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;