// ============================================
// ADMIN SIDEBAR
// Collapsible navigation with MongoDB style
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
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
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const navItems = [
  { path: '/command-center/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/command-center/projects', label: 'Projects', icon: FolderKanban },
  { path: '/command-center/products', label: 'Products', icon: Package },
  { path: '/command-center/homepage', label: 'Homepage', icon: Home },
  { path: '/command-center/theme', label: 'Theme', icon: Palette },
  { path: '/command-center/skills', label: 'Skills', icon: Wrench },
  { path: '/command-center/timeline', label: 'Timeline', icon: History },
  { path: '/command-center/messages', label: 'Messages', icon: MessageSquare },
  { path: '/command-center/settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/command-center/login';
  };

  return (
    <div className="h-full bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              {/* MongoDB style logo */}
              <svg viewBox="0 0 100 100" className="w-8 h-8">
                <circle cx="50" cy="50" r="48" fill="#10b981" opacity="0.2" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#10b981" strokeWidth="2" />
                <path d="M 35 35 L 50 20 L 65 35 L 65 65 L 50 80 L 35 65 Z" fill="none" stroke="#10b981" strokeWidth="3" />
              </svg>
              <span className="font-bold text-lg">Command Center</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {collapsed && (
          <svg viewBox="0 0 100 100" className="w-8 h-8 mx-auto">
            <circle cx="50" cy="50" r="48" fill="#10b981" opacity="0.2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="#10b981" strokeWidth="2" />
            <path d="M 35 35 L 50 20 L 65 35 L 65 65 L 50 80 L 35 65 Z" fill="none" stroke="#10b981" strokeWidth="3" />
          </svg>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <Icon className="w-5 h-5 flex-shrink-0" />
              
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;