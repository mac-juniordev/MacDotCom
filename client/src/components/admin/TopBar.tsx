// ============================================
// ADMIN TOP BAR
// Notifications, clock, navigation and search
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  Mail,
  MailOpen,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';

dayjs.extend(relativeTime);

interface TopBarProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

interface Notification {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface MessagesResponse {
  success?: boolean;
  data?: Notification[];
  message?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

const POLL_INTERVAL = 60_000;

const TopBar = ({
  sidebarCollapsed,
  toggleSidebar,
}: TopBarProps) => {
  const [currentTime, setCurrentTime] = useState(() => dayjs());

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [isLoadingNotifications, setIsLoadingNotifications] =
    useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef(false);

  const navigate = useNavigate();

  // ============================================
  // Greeting
  // Derived directly from current time.
  // No extra state/effect required.
  // ============================================

  const hour = currentTime.hour();

  const greeting =
    hour < 12
      ? 'Good Morning'
      : hour < 17
        ? 'Good Afternoon'
        : 'Good Evening';

  // ============================================
  // Clock
  // ============================================

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // ============================================
  // Authentication headers
  // ============================================

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  // ============================================
  // Fetch notifications
  // ============================================

  const fetchNotifications = useCallback(async () => {
    // Prevent overlapping requests.
    if (pollingRef.current) {
      return;
    }

    const config = getAuthConfig();

    if (!config) {
      setNotifications([]);
      return;
    }

    pollingRef.current = true;
    setIsLoadingNotifications(true);

    try {
      const response = await axios.get<MessagesResponse>(
        `${API_URL}/messages`,
        {
          ...config,
          params: {
            status: 'unread',
            limit: 10,
          },
        }
      );

      if (response.data?.success) {
        setNotifications(response.data.data ?? []);
      }
    } catch (error: unknown) {
      // Keep notification errors quiet in production.
      if (import.meta.env.DEV) {
        if (axios.isAxiosError(error)) {
          console.error(
            'Failed to fetch notifications:',
            error.response?.data || error.message
          );
        } else {
          console.error(
            'Failed to fetch notifications:',
            error
          );
        }
      }
    } finally {
      pollingRef.current = false;
      setIsLoadingNotifications(false);
    }
  }, [getAuthConfig]);

  // ============================================
  // Initial notification fetch
  //
  // setTimeout prevents React's
  // set-state-in-effect warning while still
  // fetching immediately after mount.
  // ============================================

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [fetchNotifications]);

  // ============================================
  // Polling + window focus
  // ============================================

  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchNotifications();
    }, POLL_INTERVAL);

    const handleFocus = () => {
      void fetchNotifications();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchNotifications]);

  // ============================================
  // Close dropdown when clicking outside
  // ============================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // ============================================
  // Close dropdown with Escape
  // ============================================

  useEffect(() => {
    if (!showNotifications) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [showNotifications]);

  // ============================================
  // Open messages
  // ============================================

  const handleNotificationClick = () => {
    setShowNotifications(false);
    navigate('/command-center/messages');
  };

  // ============================================
  // Mark one notification as read
  // ============================================

  const handleMarkAsRead = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();

    const config = getAuthConfig();

    if (!config) {
      return;
    }

    try {
      await axios.patch(
        `${API_URL}/messages/${id}/status`,
        { status: 'read' },
        config
      );

      setNotifications((current) =>
        current.filter(
          (notification) => notification._id !== id
        )
      );
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        console.error(
          'Failed to mark notification as read:',
          error
        );
      }
    }
  };

  // ============================================
  // Mark all notifications as read
  // ============================================

  const handleMarkAllAsRead = async () => {
    const config = getAuthConfig();

    if (!config || notifications.length === 0) {
      return;
    }

    const currentNotifications = [...notifications];

    try {
      await Promise.all(
        currentNotifications.map((notification) =>
          axios.patch(
            `${API_URL}/messages/${notification._id}/status`,
            { status: 'read' },
            config
          )
        )
      );

      setNotifications([]);
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        console.error(
          'Failed to mark all notifications as read:',
          error
        );
      }

      void fetchNotifications();
    }
  };

  // ============================================
  // Derived unread count
  // ============================================

  const unreadCount = notifications.length;

  // ============================================
  // Render
  // ============================================

  return (
    <header className="relative z-40 bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between">
      {/* ============================================
          Left section
          ============================================ */}

      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Sidebar toggle */}

        <motion.button
          type="button"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={
            sidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
          aria-expanded={!sidebarCollapsed}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors shrink-0"
        >
          <Menu
            className="w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
        </motion.button>

        {/* Greeting */}

        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="min-w-0"
        >
          <h1 className="text-base sm:text-xl font-bold text-white truncate">
            {greeting}, Mac
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {currentTime.format('dddd, MMMM D, YYYY')}
          </p>
        </motion.div>
      </div>

      {/* ============================================
          Right section
          ============================================ */}

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Clock */}

        <motion.div
          className="text-right hidden md:block"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-lg lg:text-2xl font-mono font-bold text-green-500">
            {currentTime.format('HH:mm:ss')}
          </span>
        </motion.div>

        {/* ============================================
            Notifications
            ============================================ */}

        <div
          className="relative"
          ref={notificationRef}
        >
          <motion.button
            type="button"
            onClick={() =>
              setShowNotifications(
                (current) => !current
              )
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Notifications${
              unreadCount > 0
                ? `, ${unreadCount} unread`
                : ''
            }`}
            aria-expanded={showNotifications}
            aria-haspopup="true"
            className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />

            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount > 9
                    ? '9+'
                    : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notification dropdown */}

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.2,
                }}
                role="dialog"
                aria-label="Notifications"
                className="fixed sm:absolute right-2 sm:right-0 top-20 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-96 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden z-50"
              >
                {/* Header */}

                <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {unreadCount}{' '}
                        {unreadCount === 1
                          ? 'unread message'
                          : 'unread messages'}
                      </p>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-green-500 hover:text-green-400 transition-colors whitespace-nowrap"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications list */}

                <div className="max-h-96 overflow-y-auto">
                  {isLoadingNotifications &&
                  notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Loader2
                        className="w-8 h-8 text-green-500 mx-auto animate-spin"
                        aria-hidden="true"
                      />

                      <p className="text-gray-400 text-sm mt-3">
                        Loading notifications...
                      </p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell
                        className="w-12 h-12 text-gray-600 mx-auto mb-4"
                        aria-hidden="true"
                      />

                      <p className="text-gray-400">
                        No new notifications
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        You&apos;re all caught up.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification._id}
                        initial={{
                          opacity: 0,
                          x: 20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        onClick={
                          handleNotificationClick
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (
                            event.key === 'Enter' ||
                            event.key === ' '
                          ) {
                            event.preventDefault();
                            handleNotificationClick();
                          }
                        }}
                        className="p-4 border-b border-gray-800 hover:bg-gray-800/50 focus:bg-gray-800/50 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}

                          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                            <Mail
                              className="w-5 h-5 text-green-500"
                              aria-hidden="true"
                            />
                          </div>

                          {/* Content */}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-white font-medium truncate">
                                {notification.name}
                              </p>

                              <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                                {dayjs(
                                  notification.createdAt
                                ).fromNow()}
                              </span>
                            </div>

                            <p className="text-sm text-gray-400 truncate mt-1">
                              {notification.subject}
                            </p>

                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                              {notification.message}
                            </p>
                          </div>

                          {/* Mark as read */}

                          <button
                            type="button"
                            onClick={(event) =>
                              handleMarkAsRead(
                                event,
                                notification._id
                              )
                            }
                            aria-label={`Mark message from ${notification.name} as read`}
                            title="Mark as read"
                            className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 p-1.5 hover:bg-gray-700 rounded transition-opacity shrink-0"
                          >
                            <MailOpen
                              className="w-4 h-4 text-gray-400"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer */}

                <Link
                  to="/command-center/messages"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  className="block p-4 text-center text-sm text-green-500 hover:bg-gray-800 transition-colors"
                >
                  View all messages
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================
            Search
            ============================================ */}

        <div className="relative hidden lg:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search..."
            aria-label="Search admin panel"
            className="pl-10 pr-4 py-2 w-48 xl:w-64 bg-gray-800 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;