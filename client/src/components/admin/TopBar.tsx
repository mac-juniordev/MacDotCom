import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search } from 'lucide-react';
import dayjs from 'dayjs';

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Derive greeting directly from currentTime
  const hour = currentTime.hour();

  const greeting =
    hour < 12
      ? 'Good Morning'
      : hour < 17
        ? 'Good Afternoon'
        : 'Good Evening';

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Toggle sidebar button */}
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </motion.button>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold text-white">
            {greeting}, Mac
          </h1>

          <p className="text-sm text-gray-400">
            {currentTime.format('dddd, MMMM D, YYYY')}
          </p>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        {/* Clock */}
        <motion.div
          className="text-right"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl font-mono font-bold text-green-500">
            {currentTime.format('HH:mm:ss')}
          </span>
        </motion.div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 hover:bg-gray-800 rounded-lg"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;