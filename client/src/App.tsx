// ============================================
// MAIN APP COMPONENT - Updated with Admin Routes
// ============================================

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLoader from './components/loaders/MainLoader';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/admin/AdminLayout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProjectsManager from './pages/admin/ProjectsManager';
import ProductsManager from './pages/admin/ProductsManager';
import HomepageManager from './pages/admin/HomepageManager';
import ThemeManager from './pages/admin/ThemeManager';
import SkillsManager from './pages/admin/SkillsManager';
import TimelineManager from './pages/admin/TimelineManager';
import MessagesManager from './pages/admin/MessagesManager';
import SettingsManager from './pages/admin/SettingsManager';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Check if user is authenticated for admin routes
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <MainLoader />}
      </AnimatePresence>

      {!loading && (
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route element={<PublicLayout theme={theme} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes */}
          <Route path="/command-center/login" element={<Login />} />
          <Route
            path="/command-center"
            element={isAuthenticated() ? <AdminLayout /> : <Navigate to="/command-center/login" />}
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="homepage" element={<HomepageManager />} />
            <Route path="theme" element={<ThemeManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="timeline" element={<TimelineManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;