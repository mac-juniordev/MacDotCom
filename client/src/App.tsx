// ============================================
// MAIN APP COMPONENT - Updated with Admin Routes
// ============================================

import { useState, useEffect } from 'react';
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
// TYPES
// ============================================

type Theme = 'light' | 'dark';

// ============================================
// GET INITIAL THEME
// ============================================
//
// IMPORTANT:
// We read localStorage when the state is created
// instead of calling setTheme() inside an effect.
//
// This fixes:
//
// "Calling setState synchronously within an effect"
// ============================================

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme');

  if (
    savedTheme === 'light' ||
    savedTheme === 'dark'
  ) {
    return savedTheme;
  }

  return 'dark';
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const App = () => {
  // ==========================================
  // LOADING STATE
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // THEME STATE
  // ==========================================
  //
  // The theme is initialized directly from
  // localStorage.
  //
  // NO setTheme() inside an initial effect.
  //
  // ==========================================

  const [theme, setTheme] =
    useState<Theme>(getInitialTheme);

  // ==========================================
  // LOCATION
  // ==========================================

  const location = useLocation();

  // ==========================================
  // TOGGLE THEME
  // ==========================================

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme =
        currentTheme === 'light'
          ? 'dark'
          : 'light';

      // Update DOM immediately
      document.documentElement.classList.toggle(
        'dark',
        newTheme === 'dark'
      );

      // Save preference
      localStorage.setItem(
        'theme',
        newTheme
      );

      return newTheme;
    });
  };

  // ==========================================
  // APPLY INITIAL THEME
  // ==========================================
  //
  // This effect only synchronizes the DOM
  // with the already-existing React state.
  //
  // It does NOT call setTheme().
  //
  // ==========================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    );
  }, [theme]);

  // ==========================================
  // MAIN LOADER
  // ==========================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  const isAuthenticated = () => {
    return Boolean(
      localStorage.getItem('token')
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

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
          {/* ====================================
              PUBLIC ROUTES
          ==================================== */}

          <Route
            element={
              <PublicLayout
                theme={theme}
                toggleTheme={toggleTheme}
              />
            }
          >
            {/* Home */}

            <Route
              path="/"
              element={<Home />}
            />

            {/* Projects */}

            <Route
              path="/projects"
              element={<Projects />}
            />

            {/* Products */}

            <Route
              path="/products"
              element={<Products />}
            />

            {/* About */}

            <Route
              path="/about"
              element={<About />}
            />

            {/* Contact */}

            <Route
              path="/contact"
              element={<Contact />}
            />

            {/* Public 404 */}

            <Route
              path="*"
              element={<NotFound />}
            />
          </Route>

          {/* ====================================
              ADMIN LOGIN
          ==================================== */}

          <Route
            path="/command-center/login"
            element={<Login />}
          />

          {/* ====================================
              ADMIN ROUTES
          ==================================== */}

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
            {/* Dashboard */}

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* Projects Manager */}

            <Route
              path="projects"
              element={<ProjectsManager />}
            />

            {/* Products Manager */}

            <Route
              path="products"
              element={<ProductsManager />}
            />

            {/* Homepage Manager */}

            <Route
              path="homepage"
              element={<HomepageManager />}
            />

            {/* Theme Manager */}

            <Route
              path="theme"
              element={<ThemeManager />}
            />

            {/* Skills Manager */}

            <Route
              path="skills"
              element={<SkillsManager />}
            />

            {/* Timeline Manager */}

            <Route
              path="timeline"
              element={<TimelineManager />}
            />

            {/* Messages Manager */}

            <Route
              path="messages"
              element={<MessagesManager />}
            />

            {/* Settings Manager */}

            <Route
              path="settings"
              element={<SettingsManager />}
            />

            {/* ==================================
                ADMIN DEFAULT ROUTE
            ================================== */}

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;