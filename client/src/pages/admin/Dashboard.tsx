// ============================================
// ADMIN DASHBOARD
// Overview with stats and quick actions
// ============================================

import { motion } from 'framer-motion';
import { FolderKanban, Package, MessageSquare, Eye, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { label: 'Projects', value: 6, icon: FolderKanban, color: '#3b82f6', change: '+2 this month' },
    { label: 'Products', value: 4, icon: Package, color: '#10b981', change: '+1 this month' },
    { label: 'Messages', value: 12, icon: MessageSquare, color: '#f59e0b', change: '3 unread' },
    { label: 'Total Views', value: 1542, icon: Eye, color: '#ef4444', change: '+15% this week' },
  ];

  const recentActivity = [
    { id: 1, action: 'Created new project', item: 'TradeMirror', time: '2 hours ago' },
    { id: 2, action: 'Updated product', item: 'Chronova', time: '5 hours ago' },
    { id: 3, action: 'Received message', item: 'From John Doe', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Mac</h2>
        <p className="text-gray-400">Here's what's happening with MacDotCom today.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <motion.span
                  className="text-xs text-green-500 flex items-center gap-1"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </motion.span>
              </div>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
      >
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
            >
              <div>
                <p className="text-white">{activity.action}</p>
                <p className="text-sm text-gray-400">{activity.item}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="flex gap-4">
        <Link to="/command-center/projects">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </motion.button>
        </Link>
        <Link to="/command-center/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Product
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;