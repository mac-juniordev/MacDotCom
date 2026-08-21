// ============================================
// SERVER ENTRY POINT
// Vercel / Production Entry
// ============================================

import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

// Load environment variables
dotenv.config();

// ============================================
// Vercel serverless handler
// ============================================

let dbConnected = false;

const ensureDBConnection = async (): Promise<void> => {
  if (dbConnected) return;

  await connectDB();
  dbConnected = true;
};

// ============================================
// Vercel Function Handler
// ============================================

const handler = async (req: any, res: any) => {
  try {
    await ensureDBConnection();

    return app(req, res);
  } catch (error) {
    console.error('Server initialization error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server initialization failed',
    });
  }
};

export default handler;