// ============================================
// NAVBAR COMPONENT
// Fully theme-aware sticky navbar
// ============================================

import { useState, useEffect } from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

// ============================================
// TYPES
// ============================================

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// ============================================
// NAVIGATION LINKS
// ============================================

const navLinks = [
  {
    path: '/',
    label: 'Home',
  },
  {
    path: '/projects',
    label: 'Projects',
  },
  {
    path: '/products',
    label: 'Products',
  },
  {
    path: '/about',
    label: 'About',
  },
  {
    path: '/contact',
    label: 'Contact',
  },
];

// ============================================
// NAVBAR COMPONENT
// ============================================

const Navbar = ({
  theme,
  toggleTheme,
}: NavbarProps) => {
  const [scrolled, setScrolled] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const location = useLocation();

  // ==========================================
  // SCROLL HANDLER
  // ==========================================
  //
  // This effect is valid because it subscribes
  // to the browser's scroll event.
  //
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <motion.nav
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        transition-all
        duration-300
        ${
          scrolled
            ? `
              bg-white/80
              dark:bg-black/80
              backdrop-blur-xl
              shadow-lg
            `
            : `
              bg-white
              dark:bg-black
            `
        }
      `}
    >
      {/* ======================================
          NAVBAR CONTAINER
      ====================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ====================================
              LOGO
          ==================================== */}

          <Logo />

          {/* ====================================
              DESKTOP NAVIGATION
          ==================================== */}

          <div className="hidden md:flex items-center gap-8">

            {navLinks.map(
              (link, index) => {
                const isActive =
                  location.pathname ===
                  link.path;

                return (
                  <motion.div
                    key={link.path}
                    initial={{
                      opacity: 0,
                      y: -20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.1,
                    }}
                  >
                    <Link
                      to={link.path}
                      className="relative group"
                      aria-current={
                        isActive
                          ? 'page'
                          : undefined
                      }
                    >
                      <span
                        className={`
                          text-sm
                          font-medium
                          transition-colors
                          ${
                            isActive
                              ? 'text-blue-500'
                              : `
                                text-gray-900
                                dark:text-gray-100
                                hover:text-blue-500
                                dark:hover:text-blue-400
                              `
                          }
                        `}
                      >
                        {link.label}
                      </span>

                      {/* Animated underline */}

                      <motion.span
                        className="
                          absolute
                          -bottom-1
                          left-0
                          h-0.5
                          bg-blue-500
                        "
                        initial={false}
                        animate={{
                          width: isActive
                            ? '100%'
                            : '0%',
                        }}
                        whileHover={{
                          width: '100%',
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      />
                    </Link>
                  </motion.div>
                );
              }
            )}

            {/* Theme Toggle */}

            <ThemeToggle
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </div>

          {/* ====================================
              MOBILE MENU BUTTON
          ==================================== */}

          <motion.button
            type="button"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            className="
              md:hidden
              relative
              w-10
              h-10
              flex
              items-center
              justify-center
              text-gray-900
              dark:text-gray-100
              rounded-lg
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            whileTap={{
              scale: 0.9,
            }}
            aria-label={
              mobileOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={
              mobileOpen
            }
            aria-controls="mobile-navigation"
          >
            <div className="space-y-2">

              {/* Top line */}

              <motion.span
                className="
                  block
                  w-6
                  h-0.5
                  bg-current
                "
                animate={
                  mobileOpen
                    ? {
                        rotate: 45,
                        y: 8,
                      }
                    : {
                        rotate: 0,
                        y: 0,
                      }
                }
                transition={{
                  duration: 0.2,
                }}
              />

              {/* Middle line */}

              <motion.span
                className="
                  block
                  w-6
                  h-0.5
                  bg-current
                "
                animate={
                  mobileOpen
                    ? {
                        opacity: 0,
                        x: -20,
                      }
                    : {
                        opacity: 1,
                        x: 0,
                      }
                }
                transition={{
                  duration: 0.2,
                }}
              />

              {/* Bottom line */}

              <motion.span
                className="
                  block
                  w-6
                  h-0.5
                  bg-current
                "
                animate={
                  mobileOpen
                    ? {
                        rotate: -45,
                        y: -8,
                      }
                    : {
                        rotate: 0,
                        y: 0,
                      }
                }
                transition={{
                  duration: 0.2,
                }}
              />

            </div>
          </motion.button>
        </div>
      </div>

      {/* ======================================
          MOBILE MENU
      ====================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              md:hidden
              overflow-hidden
              bg-white
              dark:bg-black
              border-t
              border-gray-200
              dark:border-gray-800
            "
          >
            <div className="px-4 py-4 space-y-4">

              {/* Mobile Links */}

              {navLinks.map(
                (link, index) => {
                  const isActive =
                    location.pathname ===
                    link.path;

                  return (
                    <motion.div
                      key={link.path}
                      initial={{
                        x: -20,
                        opacity: 0,
                      }}
                      animate={{
                        x: 0,
                        opacity: 1,
                      }}
                      transition={{
                        delay: index * 0.1,
                      }}
                    >
                      <Link
                        to={link.path}
                        onClick={
                          closeMobileMenu
                        }
                        className={`
                          block
                          text-lg
                          font-medium
                          transition-colors
                          ${
                            isActive
                              ? 'text-blue-500'
                              : `
                                text-gray-900
                                dark:text-gray-100
                                hover:text-blue-500
                                dark:hover:text-blue-400
                              `
                          }
                        `}
                        aria-current={
                          isActive
                            ? 'page'
                            : undefined
                        }
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                }
              )}

              {/* Mobile Theme Toggle */}

              <div className="pt-2">
                <ThemeToggle
                  theme={theme}
                  toggleTheme={
                    toggleTheme
                  }
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;