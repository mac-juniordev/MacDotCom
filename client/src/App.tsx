// ============================================
// MAIN APP COMPONENT
// Sets up routes and theme
// ============================================

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLoader from './components/loaders/MainLoader';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const location = useLocation();

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Check saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Show loader on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 second loader

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Main loading screen */}
      <AnimatePresence mode="wait">
        {loading && <MainLoader />}
      </AnimatePresence>

      {/* App content */}
      {!loading && (
        <Routes location={location} key={location.pathname}>
          <Route element={<PublicLayout theme={theme} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;