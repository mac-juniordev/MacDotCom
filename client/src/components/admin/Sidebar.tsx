// ============================================
// ADMIN SIDEBAR
// Clean + animated + safe logout handling
// Uses public/favicon.svg as the Command Center logo
// ============================================

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  Home,
  Palette,
  Wrench,
  History,
  MessageSquare,
  Settings,
  LogOut,
  CircleHelp,
  X,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

// ============================================
// NAVIGATION ITEMS
// ============================================

const navItems = [
  {
    path: '/command-center/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/command-center/projects',
    label: 'Projects',
    icon: FolderKanban,
  },
  {
    path: '/command-center/products',
    label: 'Products',
    icon: Package,
  },
  {
    path: '/command-center/homepage',
    label: 'Homepage',
    icon: Home,
  },
  {
    path: '/command-center/theme',
    label: 'Theme',
    icon: Palette,
  },
  {
    path: '/command-center/skills',
    label: 'Skills',
    icon: Wrench,
  },
  {
    path: '/command-center/timeline',
    label: 'Timeline',
    icon: History,
  },
  {
    path: '/command-center/messages',
    label: 'Messages',
    icon: MessageSquare,
  },
  {
    path: '/command-center/settings',
    label: 'Settings',
    icon: Settings,
  },
];

// ============================================
// COMMAND CENTER LOGO
// Uses /public/favicon.svg
// ============================================

const CommandLogo = ({
  className = 'w-8 h-8',
}: {
  className?: string;
}) => {
  return (
    <img
      src="/favicon.svg"
      alt="Command Center"
      className={`${className} object-contain`}
      draggable={false}
    />
  );
};

// ============================================
// SIDEBAR
// ============================================

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Keep track of the logout timer so it can be cleaned up
  // if the Sidebar unmounts before navigation happens.
  const logoutTimerRef = useRef<number | null>(null);

  // ============================================
  // CLEAN UP LOGOUT TIMER
  // ============================================

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current !== null) {
        window.clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    logoutTimerRef.current = window.setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      navigate('/command-center/login', {
        replace: true,
      });
    }, 1800);
  };

  // ============================================
  // CLOSE LOGOUT MODAL
  // ============================================

  const handleCloseLogoutModal = () => {
    if (loggingOut) {
      return;
    }

    setShowLogoutModal(false);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="h-full bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* ======================================
            LOGO
        ====================================== */}

        <div className="h-16 px-4 border-b border-gray-800 flex items-center">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="expanded-logo"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="flex items-center gap-3"
              >
                <CommandLogo className="w-8 h-8 flex-shrink-0" />

                <span className="font-bold text-lg text-white whitespace-nowrap">
                  Command Center
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="w-full flex justify-center"
              >
                <CommandLogo className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <nav
          className="flex-1 py-4 overflow-y-auto"
          aria-label="Admin navigation"
        >
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`
                    relative
                    flex
                    items-center
                    gap-3
                    mx-2
                    px-3
                    py-3
                    rounded-lg
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? 'bg-green-500/10 text-green-500'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  {/* Active indicator */}

                  {isActive && (
                    <motion.div
                      layoutId="activeAdminNav"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-green-500 rounded-r-full"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icon */}

                  <Icon
                    className={`
                      w-5 h-5
                      flex-shrink-0
                      ${
                        isActive
                          ? 'text-green-500'
                          : 'text-current'
                      }
                    `}
                  />

                  {/* Label */}

                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: -10,
                        }}
                        transition={{
                          duration: 0.15,
                        }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ======================================
            LOGOUT
        ====================================== */}

        <div className="p-3 border-t border-gray-800">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            disabled={loggingOut}
            title={collapsed ? 'Logout' : undefined}
            className={`
              w-full
              flex
              items-center
              gap-3
              px-3
              py-3
              rounded-lg
              text-gray-400
              hover:bg-red-500/10
              hover:text-red-500
              transition-all
              duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -10,
                  }}
                  className="text-sm font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </aside>

      {/* ========================================
          LOGOUT MODAL
      ======================================== */}

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={handleCloseLogoutModal}
          >
            {/* ==================================
                MODAL CARD
            ================================== */}

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 text-center"
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 40,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {/* ==================================
                  CONFIRMATION STATE
              ================================== */}

              {!loggingOut && (
                <>
                  {/* Question Mark */}

                  <motion.div
                    initial={{
                      scale: 0,
                      rotate: -20,
                    }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      type: 'spring',
                      bounce: 0.6,
                      delay: 0.15,
                    }}
                    className="inline-flex mb-6"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <CircleHelp
                        className="w-16 h-16 text-yellow-500"
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  </motion.div>

                  <h3
                    id="logout-title"
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Leaving already?
                  </h3>

                  <p className="text-gray-400 mb-8">
                    You've done great work today.
                    <br />
                    Come back soon!
                  </p>

                  {/* Buttons */}

                  <div className="flex gap-4 justify-center">
                    <motion.button
                      type="button"
                      onClick={handleCloseLogoutModal}
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Stay
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleLogout}
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </motion.button>
                  </div>
                </>
              )}

              {/* ==================================
                  LOGGING OUT STATE
              ================================== */}

              {loggingOut && (
                <>
                  {/* Animated Command Center Logo */}

                  <motion.div
                    initial={{
                      scale: 0,
                      rotate: -180,
                    }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      type: 'spring',
                      bounce: 0.5,
                    }}
                    className="inline-block mb-6"
                  >
                    <div className="relative w-20 h-20">
                      {/* Rotating ring */}

                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-gray-800 border-t-green-500"
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />

                      {/* Actual logo */}

                      <motion.div
                        className="absolute inset-2 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <CommandLogo className="w-14 h-14" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.h3
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Goodbye, Mac!
                  </motion.h3>

                  <motion.p
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.15,
                    }}
                    className="text-gray-400"
                  >
                    Logging you out securely...
                  </motion.p>

                  {/* Loading bar */}

                  <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto mt-6">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-green-500"
                      initial={{
                        x: '-100%',
                      }}
                      animate={{
                        x: '100%',
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;