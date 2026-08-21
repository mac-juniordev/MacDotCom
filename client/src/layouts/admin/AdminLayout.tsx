// ============================================
// ADMIN LAYOUT
// Collapsible sidebar with MongoDB vibe
// ============================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/admin/Sidebar';
import TopBar from '../../components/admin/TopBar';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
        className="relative"
      >
        <Sidebar collapsed={sidebarCollapsed} />
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <TopBar 
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;