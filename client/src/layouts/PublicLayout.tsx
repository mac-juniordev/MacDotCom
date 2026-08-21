// ============================================
// PUBLIC LAYOUT
// Wraps all public pages with navbar and footer
// ============================================

import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AnimatedBackground from '../components/backgrounds/AnimatedBackground';

interface PublicLayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const PublicLayout = ({ theme, toggleTheme }: PublicLayoutProps) => {
  return (
    <div className="relative min-h-screen">
      {/* Background animations */}
      <AnimatedBackground />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main content */}
      <motion.main
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;