// ============================================
// HOME PAGE
// Main landing page with maximum animations
// ============================================

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Hero from '../components/home/Hero';
import FloatingObjects from '../components/effects/FloatingObjects';
import ParticleField from '../components/effects/ParticleField';
import Stats from '../components/home/Stats';
import FeaturedProjects from '../components/home/FeaturedProjects';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Services from '../components/home/Services';
import SkillsOverview from '../components/home/SkillsOverview';
import Timeline from '../components/home/Timeline';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';
import ContactPreview from '../components/home/ContactPreview';

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Parallax values
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative">
      {/* Floating objects in background */}
      <FloatingObjects />
      
      {/* Particle field */}
      <ParticleField count={30} />

      {/* Main content */}
      <div className="relative z-10">
        <Hero />
        <Stats />
        <FeaturedProducts />
        <FeaturedProjects />
        <Services />
        <SkillsOverview />
        <Timeline />
        <Testimonials />
        <CTA />
        <ContactPreview />
      </div>

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      />
    </div>
  );
};

export default Home;