// ============================================
// NAVBAR COMPONENT
// Sticky navbar with animations
// ============================================

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Projects' },
  { path: '/products', label: 'Products' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  // Add shadow and background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className="relative group"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'text-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
                    }`}
                  >
                    {link.label}
                  </span>

                  {/* Animated underline */}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"
                    animate={{
                      width:
                        location.pathname === link.path ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileOpen((open) => !open)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {/* Animated hamburger */}
            <div className="space-y-2">
              <motion.span
                className="block w-6 h-0.5 bg-current"
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 8 }
                    : { rotate: 0, y: 0 }
                }
              />

              <motion.span
                className="block w-6 h-0.5 bg-current"
                animate={
                  mobileOpen
                    ? { opacity: 0, x: -20 }
                    : { opacity: 1, x: 0 }
                }
              />

              <motion.span
                className="block w-6 h-0.5 bg-current"
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -8 }
                    : { rotate: 0, y: 0 }
                }
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-black backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-lg font-medium ${
                      location.pathname === link.path
                        ? 'text-blue-500'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <ThemeToggle
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;