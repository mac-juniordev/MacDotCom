// ============================================
// MAIN APP COMPONENT
// Complete + React 19 safe
// ============================================

import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
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

// ============================================
// THEME TYPE
// ============================================

type Theme = 'light' | 'dark';

// ============================================
// GET INITIAL THEME
// This runs BEFORE the first render.
// No setState inside an effect.
// ============================================

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return 'dark';
};

// ============================================
// AUTH CHECK
// ============================================

const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem('token'));
};

// ============================================
// APP
// ============================================

const App = () => {
  const [loading, setLoading] = useState(true);

  // IMPORTANT:
  // Theme is initialized directly instead of inside useEffect.
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const location = useLocation();

  // ============================================
  // APPLY INITIAL THEME TO HTML
  // This is synchronization with the DOM,
  // which is what useEffect is appropriate for.
  // ============================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    );
  }, [theme]);

  // ============================================
  // TOGGLE THEME
  // ============================================

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme: Theme =
        currentTheme === 'light' ? 'dark' : 'light';

      localStorage.setItem('theme', newTheme);

      return newTheme;
    });
  };

  // ============================================
  // INITIAL LOADER
  // ============================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* ========================================
          MAIN LOADER
      ======================================== */}

      <AnimatePresence mode="wait">
        {loading && <MainLoader />}
      </AnimatePresence>

      {/* ========================================
          APPLICATION
      ======================================== */}

      {!loading && (
        <Routes
          location={location}
          key={location.pathname}
        >
          {/* ======================================
              PUBLIC ROUTES
          ====================================== */}

          <Route
            element={
              <PublicLayout
                theme={theme}
                toggleTheme={toggleTheme}
              />
            }
          >
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            <Route
              path="*"
              element={<NotFound />}
            />
          </Route>

          {/* ======================================
              ADMIN LOGIN
          ====================================== */}

          <Route
            path="/command-center/login"
            element={<Login />}
          />

          {/* ======================================
              COMMAND CENTER
          ====================================== */}

          <Route
            path="/command-center"
            element={
              isAuthenticated() ? (
                <AdminLayout />
              ) : (
                <Navigate
                  to="/command-center/login"
                  replace
                />
              )
            }
          >
            {/* /command-center */}
            <Route
              index
              element={
                <Navigate
                  to="/command-center/dashboard"
                  replace
                />
              }
            />

            {/* Dashboard */}
            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* Projects */}
            <Route
              path="projects"
              element={<ProjectsManager />}
            />

            {/* Products */}
            <Route
              path="products"
              element={<ProductsManager />}
            />

            {/* Homepage */}
            <Route
              path="homepage"
              element={<HomepageManager />}
            />

            {/* Theme */}
            <Route
              path="theme"
              element={<ThemeManager />}
            />

            {/* Skills */}
            <Route
              path="skills"
              element={<SkillsManager />}
            />

            {/* Timeline */}
            <Route
              path="timeline"
              element={<TimelineManager />}
            />

            {/* Messages */}
            <Route
              path="messages"
              element={<MessagesManager />}
            />

            {/* Settings */}
            <Route
              path="settings"
              element={<SettingsManager />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;