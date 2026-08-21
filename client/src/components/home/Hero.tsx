import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import RotatingLines from '../effects/RotatingLines';
import MagneticWrapper from '../effects/MagneticWrapper';
import FloatingObjects from '../effects/FloatingObjects';

const PHRASES = [
  'Building Digital Experiences',
  'Creating Software Solutions',
  'Crafting Premium Products',
  'Transforming Ideas into Reality',
  'Engineering Excellence',
];

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = PHRASES[currentPhraseIndex];

    // Pause when the complete phrase is displayed
    if (!isDeleting && typedText === currentPhrase) {
      const timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(
      () => {
        if (isDeleting) {
          const nextText = currentPhrase.slice(0, typedText.length - 1);

          setTypedText(nextText);

          // Once deletion is complete, move to the next phrase
          if (nextText === '') {
            setIsDeleting(false);
            setCurrentPhraseIndex(
              (prev) => (prev + 1) % PHRASES.length
            );
          }
        } else {
          setTypedText(
            currentPhrase.slice(0, typedText.length + 1)
          );
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentPhraseIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating tech objects */}
      <FloatingObjects />

      {/* Mouse follow glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          x: mousePosition.x * 200,
          y: mousePosition.y * 200,
        }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            bounce: 0.5,
            delay: 0.5,
          }}
          className="inline-block mb-8"
        >
          <motion.div
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span className="text-sm font-medium text-blue-500">
              ✦ Available for new projects
            </span>
          </motion.div>
        </motion.div>

        {/* Main heading with typewriter */}
        <div className="mb-6 min-h-[120px] sm:min-h-[160px]">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-primary leading-tight">
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
              className="inline-block w-1 h-12 bg-blue-500 ml-2"
            />
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
          }}
          className="text-lg sm:text-xl text-secondary max-w-3xl mx-auto mb-8"
        >
          We are a software company dedicated to crafting premium
          digital experiences. From web applications to mobile
          solutions, we turn complex problems into elegant,
          user-friendly products that drive business growth.
        </motion.p>

        {/* Additional tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            duration: 0.8,
          }}
          className="text-sm sm:text-base text-muted max-w-2xl mx-auto mb-12"
        >
          Full-Stack Development • UI/UX Design • Cloud Solutions •
          API Development
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <MagneticWrapper>
            <motion.a
              href="/projects"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 1,
                duration: 0.5,
              }}
              whileHover={{
                scale: 1.1,
                boxShadow:
                  '0 0 30px rgba(59,130,246,0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-500 text-white rounded-full font-semibold relative overflow-hidden group flex items-center gap-2"
            >
              <span className="relative z-10">
                View Projects
              </span>

              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 1,
                }}
              />
            </motion.a>
          </MagneticWrapper>

          <MagneticWrapper>
            <motion.a
              href="/contact"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 1.2,
                duration: 0.5,
              }}
              whileHover={{
                scale: 1.1,
                borderColor: '#10b981',
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-border rounded-full font-semibold text-primary flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Us
            </motion.a>
          </MagneticWrapper>
        </div>

        {/* Rotating lines around center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="relative w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] mx-auto"
        >
          <RotatingLines
            size={300}
            color="#3b82f6"
            speed={20}
            lines={12}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <motion.span
                className="text-5xl font-black text-blue-500 text-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                M
              </motion.span>

              <p className="text-sm text-muted mt-2">
                MacDotCom
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-current rounded-full mt-2 text-primary"
            animate={{ y: [0, 16, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;