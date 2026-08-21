// ============================================
// MAIN APP COMPONENT
// Public + Admin Routes
// ============================================

import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/admin/AdminLayout';

// Loaders
import MainLoader from './components/loaders/MainLoader';

// Public Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
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
// INITIAL THEME
// ============================================

const getInitialTheme = (): Theme => {
  try {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch (error) {
    console.error('Failed to read theme:', error);
  }

  return 'dark';
};

// ============================================
// AUTH CHECK
// ============================================

const isAuthenticated = (): boolean => {
  try {
    return Boolean(localStorage.getItem('token'));
  } catch {
    return false;
  }
};

// ============================================
// ADMIN ROUTE PROTECTION
// ============================================

const ProtectedAdminRoute = () => {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/command-center/login"
        replace
      />
    );
  }

  return <AdminLayout />;
};

// ============================================
// MAIN APP
// ============================================

const App = () => {
  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);

  // ==========================================
  // THEME
  // ==========================================

  const [theme, setTheme] = useState<Theme>(
    getInitialTheme
  );

  // ==========================================
  // LOCATION
  // ==========================================

  const location = useLocation();

  // ==========================================
  // THEME TOGGLE
  // ==========================================

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme: Theme =
        currentTheme === 'light'
          ? 'dark'
          : 'light';

      localStorage.setItem(
        'theme',
        newTheme
      );

      return newTheme;
    });
  };

  // ==========================================
  // APPLY THEME TO DOM
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
  // RENDER
  // ==========================================

  return (
    <>
      {/* ======================================
          MAIN LOADER
      ====================================== */}

      <AnimatePresence mode="wait">
        {loading && <MainLoader />}
      </AnimatePresence>

      {/* ======================================
          APPLICATION
      ====================================== */}

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
          </Route>

          {/* ====================================
              ADMIN LOGIN
          ==================================== */}

          <Route
            path="/command-center/login"
            element={<Login />}
          />

          {/* ====================================
              PROTECTED ADMIN ROUTES
          ==================================== */}

          <Route
            path="/command-center"
            element={<ProtectedAdminRoute />}
          >
            {/* Dashboard */}

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

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

          {/* ====================================
              GLOBAL 404
          ==================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      )}
    </>
  );
};

export default App;