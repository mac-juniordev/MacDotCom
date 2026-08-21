// ============================================
// HOME PAGE
// Main landing page with maximum animations
// ============================================

import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

// ============================================
// HOME COMPONENTS
// ============================================

import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Services from '../components/home/Services';
import SkillsOverview from '../components/home/SkillsOverview';
import Timeline from '../components/home/Timeline';
import Testimonials from '../components/home/Testimonials';
import ReviewForm from '../components/home/ReviewForm';
import CTA from '../components/home/CTA';
import ContactPreview from '../components/home/ContactPreview';

// ============================================
// BACKGROUND EFFECTS
// ============================================

import FloatingObjects from '../components/effects/FloatingObjects';
import ParticleField from '../components/effects/ParticleField';

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================================
  // SCROLL PROGRESS
  // ============================================

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ============================================
  // BACKGROUND PARALLAX
  // ============================================

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '50%']
  );

  // Fade decorative background as user scrolls
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.75, 1],
    [1, 0.9, 0.4, 0]
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* ========================================
          DECORATIVE BACKGROUND
      ======================================== */}

      <motion.div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          y: backgroundY,
          opacity: backgroundOpacity,
        }}
      >
        {/* Floating objects */}
        <FloatingObjects />

        {/* Particle field */}
        <ParticleField count={30} />
      </motion.div>

      {/* ========================================
          GRADIENT OVERLAY
      ======================================== */}

      <div
        className="
          absolute
          inset-0
          pointer-events-none
          z-[1]
          bg-gradient-to-b
          from-transparent
          via-transparent
          to-background
        "
      />

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <main className="relative z-10">
        {/* ======================================
            HERO
        ====================================== */}

        <section id="hero">
          <Hero />
        </section>

        {/* ======================================
            STATS
        ====================================== */}

        <section id="stats">
          <Stats />
        </section>

        {/* ======================================
            FEATURED PRODUCTS
        ====================================== */}

        <section id="products">
          <FeaturedProducts />
        </section>

        {/* ======================================
            FEATURED PROJECTS
        ====================================== */}

        <section id="projects">
          <FeaturedProjects />
        </section>

        {/* ======================================
            SERVICES
        ====================================== */}

        <section id="services">
          <Services />
        </section>

        {/* ======================================
            SKILLS
        ====================================== */}

        <section id="skills">
          <SkillsOverview />
        </section>

        {/* ======================================
            TIMELINE
        ====================================== */}

        <section id="journey">
          <Timeline />
        </section>

        {/* ======================================
            TESTIMONIALS
        ====================================== */}

        <section id="testimonials">
          <Testimonials />
        </section>

        {/* ======================================
            REVIEW FORM (Clients submit reviews)
        ====================================== */}

        <section id="review">
          <ReviewForm />
        </section>

        {/* ======================================
            CTA
        ====================================== */}

        <section id="cta">
          <CTA />
        </section>

        {/* ======================================
            CONTACT
        ====================================== */}

        <section id="contact">
          <ContactPreview />
        </section>
      </main>

      {/* ========================================
          SCROLL PROGRESS INDICATOR
      ======================================== */}

      <motion.div
        className="
          fixed
          top-0
          left-0
          right-0
          h-1
          bg-gradient-to-r
          from-blue-500
          via-green-500
          to-yellow-500
          z-50
          origin-left
        "
        style={{
          scaleX: scrollYProgress,
        }}
      />

      {/* ========================================
          BOTTOM FADE
      ======================================== */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          h-24
          pointer-events-none
          z-40
          bg-gradient-to-t
          from-background
          to-transparent
        "
      />
    </div>
  );
};

export default Home;