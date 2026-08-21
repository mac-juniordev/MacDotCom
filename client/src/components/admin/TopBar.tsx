// ============================================
// ADMIN TOP BAR
// Animated + real-time notifications
// React-safe effects
// ============================================

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  Menu,
  Bell,
  Search,
  Mail,
  MailOpen,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import axios from 'axios';

// ============================================
// ENABLE DAYJS RELATIVE TIME
// ============================================

dayjs.extend(relativeTime);

// ============================================
// TYPES
// ============================================

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

// ============================================
// API
// ============================================

const API_URL = 'http://localhost:5000/api';

// ============================================
// TOP BAR
// ============================================

const TopBar = ({
  toggleSidebar,
}: TopBarProps) => {
  // ============================================
  // STATE
  // ============================================

  const [currentTime, setCurrentTime] = useState(
    () => dayjs()
  );

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  const notificationRef =
    useRef<HTMLDivElement>(null);

  // ============================================
  // GREETING
  // Derived directly from currentTime.
  // No extra state or effect needed.
  // ============================================

  const getGreeting = () => {
    const hour = currentTime.hour();

    if (hour < 12) {
      return 'Good Morning';
    }

    if (hour < 17) {
      return 'Good Afternoon';
    }

    return 'Good Evening';
  };

  const greeting = getGreeting();

  // ============================================
  // CLOCK
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
  // FETCH NOTIFICATIONS
  // ============================================

  const fetchNotifications = useCallback(
    async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        setLoadingNotifications(true);

        const response = await axios.get(
          `${API_URL}/messages?status=unread`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          const unreadMessages =
            response.data?.data || [];

          setNotifications(
            unreadMessages.slice(0, 10)
          );

          setUnreadCount(
            unreadMessages.length
          );
        } else {
          setNotifications([]);
          setUnreadCount(0);
        }
      } catch (error) {
        console.error(
          'Failed to fetch notifications:',
          error
        );
      } finally {
        setLoadingNotifications(false);
      }
    },
    []
  );

  // ============================================
  // INITIAL NOTIFICATION LOAD
  // + AUTO REFRESH
  //
  // setTimeout prevents the React lint rule from
  // treating the fetch call as a synchronous
  // state update inside the effect.
  // ============================================

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);

    const interval = window.setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [fetchNotifications]);

  // ============================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ============================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node
        )
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
  // MARK SINGLE NOTIFICATION AS READ
  // ============================================

  const handleMarkAsRead = async (
    id: string
  ) => {
    try {
      const token =
        localStorage.getItem('token');

      if (!token) {
        return;
      }

      await axios.patch(
        `${API_URL}/messages/${id}/status`,
        {
          status: 'read',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from current notification list
      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification._id !== id
        )
      );

      // Reduce badge count
      setUnreadCount((previous) =>
        Math.max(0, previous - 1)
      );
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );
    }
  };

  // ============================================
  // MARK ALL AS READ
  // ============================================

  const handleMarkAllAsRead = async () => {
    try {
      const token =
        localStorage.getItem('token');

      if (!token) {
        return;
      }

      if (notifications.length === 0) {
        return;
      }

      await Promise.all(
        notifications.map(
          (notification) =>
            axios.patch(
              `${API_URL}/messages/${notification._id}/status`,
              {
                status: 'read',
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
        )
      );

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );

      // Refresh from server if something failed
      window.setTimeout(() => {
        void fetchNotifications();
      }, 0);
    }
  };

  // ============================================
  // TOGGLE NOTIFICATIONS
  // ============================================

  const toggleNotifications = () => {
    setShowNotifications(
      (previous) => !previous
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <header
      className="
        h-16
        bg-gray-900
        border-b
        border-gray-800
        px-4
        sm:px-6
        flex
        items-center
        justify-between
        flex-shrink-0
      "
    >
      {/* ======================================
          LEFT SIDE
      ====================================== */}

      <div
        className="
          flex
          items-center
          gap-3
          sm:gap-4
          min-w-0
        "
      >
        {/* ====================================
            SIDEBAR TOGGLE
        ==================================== */}

        <motion.button
          type="button"
          onClick={toggleSidebar}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.92,
          }}
          aria-label="Toggle sidebar"
          className="
            p-2
            hover:bg-gray-800
            rounded-lg
            transition-colors
            flex-shrink-0
          "
        >
          <Menu
            className="
              w-5
              h-5
              text-gray-400
            "
          />
        </motion.button>

        {/* ====================================
            GREETING
        ==================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="min-w-0"
        >
          <h1
            className="
              text-base
              sm:text-xl
              font-bold
              text-white
              truncate
            "
          >
            {greeting}, Mac
          </h1>

          <p
            className="
              text-xs
              sm:text-sm
              text-gray-400
              truncate
            "
          >
            {currentTime.format(
              'dddd, MMMM D, YYYY'
            )}
          </p>
        </motion.div>
      </div>

      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          sm:gap-4
          flex-shrink-0
        "
      >
        {/* ====================================
            CLOCK
        ==================================== */}

        <motion.div
          className="
            text-right
            hidden
            md:block
          "
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <span
            className="
              text-xl
              lg:text-2xl
              font-mono
              font-bold
              text-green-500
            "
          >
            {currentTime.format('HH:mm:ss')}
          </span>
        </motion.div>

        {/* ====================================
            NOTIFICATIONS
        ==================================== */}

        <div
          className="relative"
          ref={notificationRef}
        >
          <motion.button
            type="button"
            onClick={toggleNotifications}
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
            }}
            aria-label="Notifications"
            aria-expanded={
              showNotifications
            }
            className="
              relative
              p-2
              hover:bg-gray-800
              rounded-lg
              transition-colors
            "
          >
            <Bell
              className="
                w-5
                h-5
                text-gray-400
              "
            />

            {/* Unread Badge */}

            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  exit={{
                    scale: 0,
                  }}
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-5
                    h-5
                    px-1
                    bg-red-500
                    text-white
                    text-[10px]
                    font-bold
                    rounded-full
                    flex
                    items-center
                    justify-center
                    border-2
                    border-gray-900
                  "
                >
                  {unreadCount > 9
                    ? '9+'
                    : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* ==================================
              NOTIFICATION DROPDOWN
          ================================== */}

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 15,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  absolute
                  right-0
                  mt-2
                  w-[calc(100vw-2rem)]
                  sm:w-96
                  max-w-96
                  bg-gray-900
                  rounded-2xl
                  border
                  border-gray-800
                  shadow-2xl
                  overflow-hidden
                  z-[100]
                "
              >
                {/* ==================================
                    DROPDOWN HEADER
                ================================== */}

                <div
                  className="
                    p-4
                    border-b
                    border-gray-800
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <h3
                      className="
                        font-bold
                        text-white
                      "
                    >
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <p
                        className="
                          text-xs
                          text-gray-500
                          mt-1
                        "
                      >
                        {unreadCount}{' '}
                        unread{' '}
                        {unreadCount === 1
                          ? 'message'
                          : 'messages'}
                      </p>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={
                        handleMarkAllAsRead
                      }
                      disabled={
                        loadingNotifications
                      }
                      className="
                        text-xs
                        text-green-500
                        hover:text-green-400
                        disabled:opacity-50
                        whitespace-nowrap
                      "
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* ==================================
                    NOTIFICATION LIST
                ================================== */}

                <div
                  className="
                    max-h-96
                    overflow-y-auto
                  "
                >
                  {/* Loading */}

                  {loadingNotifications &&
                  notifications.length === 0 ? (
                    <div
                      className="
                        p-8
                        text-center
                      "
                    >
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="
                          inline-block
                        "
                      >
                        <Bell
                          className="
                            w-8
                            h-8
                            text-green-500
                          "
                        />
                      </motion.div>

                      <p
                        className="
                          text-gray-400
                          mt-4
                        "
                      >
                        Loading
                        notifications...
                      </p>
                    </div>
                  ) : notifications.length ===
                    0 ? (
                    /* Empty State */

                    <div
                      className="
                        p-8
                        text-center
                      "
                    >
                      <motion.div
                        animate={{
                          scale: [
                            1,
                            1.15,
                            1,
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <Bell
                          className="
                            w-12
                            h-12
                            text-gray-600
                            mx-auto
                            mb-4
                          "
                        />
                      </motion.div>

                      <p
                        className="
                          text-gray-400
                        "
                      >
                        No new
                        notifications
                      </p>

                      <p
                        className="
                          text-sm
                          text-gray-500
                          mt-1
                        "
                      >
                        You're all caught
                        up!
                      </p>
                    </div>
                  ) : (
                    /* Notification Items */

                    notifications.map(
                      (notification) => (
                        <motion.div
                          key={
                            notification._id
                          }
                          initial={{
                            opacity: 0,
                            x: 20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          className="
                            p-4
                            border-b
                            border-gray-800
                            hover:bg-gray-800/50
                            transition-colors
                            group
                          "
                        >
                          <div
                            className="
                              flex
                              items-start
                              gap-3
                            "
                          >
                            {/* Icon */}

                            <div
                              className="
                                w-10
                                h-10
                                rounded-full
                                bg-green-500/10
                                flex
                                items-center
                                justify-center
                                flex-shrink-0
                              "
                            >
                              <Mail
                                className="
                                  w-5
                                  h-5
                                  text-green-500
                                "
                              />
                            </div>

                            {/* Content */}

                            <div
                              className="
                                flex-1
                                min-w-0
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-start
                                  justify-between
                                  gap-2
                                "
                              >
                                <p
                                  className="
                                    text-white
                                    font-medium
                                    truncate
                                  "
                                >
                                  {notification.name ||
                                    'New message'}
                                </p>

                                <span
                                  className="
                                    text-xs
                                    text-gray-500
                                    flex-shrink-0
                                  "
                                >
                                  {dayjs(
                                    notification.createdAt
                                  ).fromNow()}
                                </span>
                              </div>

                              <p
                                className="
                                  text-sm
                                  text-gray-400
                                  truncate
                                "
                              >
                                {notification.subject ||
                                  'No subject'}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                  truncate
                                  mt-1
                                "
                              >
                                {
                                  notification.message
                                }
                              </p>
                            </div>

                            {/* Mark Read */}

                            <button
                              type="button"
                              onClick={() =>
                                handleMarkAsRead(
                                  notification._id
                                )
                              }
                              title="Mark as read"
                              aria-label={`Mark message from ${notification.name} as read`}
                              className="
                                opacity-0
                                group-hover:opacity-100
                                focus:opacity-100
                                transition-opacity
                                p-1
                                hover:bg-gray-700
                                rounded
                                flex-shrink-0
                              "
                            >
                              <MailOpen
                                className="
                                  w-4
                                  h-4
                                  text-gray-400
                                "
                              />
                            </button>
                          </div>
                        </motion.div>
                      )
                    )
                  )}
                </div>

                {/* ==================================
                    FOOTER
                ================================== */}

                <Link
                  to="/command-center/messages"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  className="
                    block
                    p-4
                    text-center
                    text-sm
                    text-green-500
                    hover:bg-gray-800
                    transition-colors
                  "
                >
                  View all messages
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ====================================
            SEARCH
        ==================================== */}

        <div
          className="
            relative
            hidden
            lg:block
          "
        >
          <Search
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-48
              xl:w-56
              pl-10
              pr-4
              py-2
              bg-gray-800
              border
              border-transparent
              rounded-lg
              text-sm
              text-white
              placeholder-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              focus:border-green-500
              transition-all
            "
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;