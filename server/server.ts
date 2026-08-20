// ============================================
// SERVER ENTRY POINT
// Starts the server and connects to database
// ============================================

import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

// Load environment variables
dotenv.config();

// Get port from .env or use 5000
const PORT = process.env.PORT || 5000;

// Function to start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('==========================================');
      console.log('  MacDotCom API Server');
      console.log('==========================================');
      console.log(`  Environment: ${process.env.NODE_ENV}`);
      console.log(`  Port: ${PORT}`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log(`  Health: http://localhost:${PORT}/api/health`);
      console.log(`  Uploads: http://localhost:${PORT}/uploads`);
      console.log('==========================================');
    });

  } catch (error) {
    // Log error if server cannot start
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

// Export for testing
export default startServer;