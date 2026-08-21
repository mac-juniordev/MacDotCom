// ============================================
// EXPRESS APP SETUP
// Main application configuration with ALL routes
// ============================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import productRoutes from './routes/productRoutes';
import homepageRoutes from './routes/homepageRoutes';
import themeRoutes from './routes/themeRoutes';
import skillRoutes from './routes/skillRoutes';
import timelineRoutes from './routes/timelineRoutes';
import messageRoutes from './routes/messageRoutes';
import socialLinkRoutes from './routes/socialLinkRoutes';
import statisticRoutes from './routes/statisticRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import siteSettingsRoutes from './routes/siteSettingsRoutes';

import { errorHandler, notFound } from './middleware/errorMiddleware';

// ============================================
// CREATE EXPRESS APP
// ============================================

const app = express();

// ============================================
// BASIC MIDDLEWARE
// ============================================

// CORS
const allowedOrigin =
  process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// JSON body parser
app.use(
  express.json({
    limit: '10mb',
  })
);

// URL-encoded body parser
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'MacDotCom API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============================================
// API ROUTES
// ============================================

// Authentication
app.use('/api/auth', authRoutes);

// Projects
app.use('/api/projects', projectRoutes);

// Products
app.use('/api/products', productRoutes);

// Homepage
app.use('/api/homepage', homepageRoutes);

// Theme
app.use('/api/theme', themeRoutes);

// Skills
app.use('/api/skills', skillRoutes);

// Timeline
app.use('/api/timeline', timelineRoutes);

// Messages
app.use('/api/messages', messageRoutes);

// Social links
app.use('/api/social-links', socialLinkRoutes);

// Statistics
app.use('/api/statistics', statisticRoutes);

// Testimonials
app.use('/api/testimonials', testimonialRoutes);

// Site settings
app.use('/api/site-settings', siteSettingsRoutes);

// ============================================
// FAVICON
// Must come BEFORE notFound
// ============================================

app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

// ============================================
// 404 HANDLER
// ============================================

app.use(notFound);

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);

// ============================================
// EXPORT APP
// ============================================

export default app;