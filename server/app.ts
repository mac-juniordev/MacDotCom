// ============================================
// EXPRESS APP SETUP
// Main application configuration with ALL routes
// ============================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { ensureUploadDirectories, UPLOAD_DIR } from './config/storage';

// Import all route files
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

// Import error middleware
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Create Express app
const app = express();

// ============================================
// BASIC MIDDLEWARE
// ============================================

// Enable CORS (allows frontend to talk to backend)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Add security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Log HTTP requests in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// STATIC FILES (Uploaded Images, Resume)
// ============================================

// Ensure upload directories exist
ensureUploadDirectories();

// Serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR));

// ============================================
// HEALTH CHECK ROUTE
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MacDotCom API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================
// API ROUTES
// ============================================

// Public routes (no auth needed)
app.use('/api/auth', authRoutes);                    // Login only
app.use('/api/projects', projectRoutes);             // GET projects
app.use('/api/products', productRoutes);             // GET products
app.use('/api/homepage', homepageRoutes);            // GET homepage
app.use('/api/theme', themeRoutes);                  // GET theme
app.use('/api/skills', skillRoutes);                 // GET skills
app.use('/api/timeline', timelineRoutes);            // GET timeline
app.use('/api/messages', messageRoutes);             // POST message
app.use('/api/social-links', socialLinkRoutes);      // GET social links
app.use('/api/statistics', statisticRoutes);         // GET statistics
app.use('/api/testimonials', testimonialRoutes);     // GET testimonials
app.use('/api/site-settings', siteSettingsRoutes);   // GET site settings

// ============================================
// 404 HANDLER
// ============================================

app.use(notFound);

// ============================================
// FAVICON HANDLER
// ============================================

app.get('/favicon.ico', (req, res) => {
  // Send empty response (no favicon yet)
  res.status(204).end();
});

// ============================================
// ERROR HANDLER
// ============================================

app.use(errorHandler);

// Export app
export default app;