// ============================================
// DATABASE CONNECTION
// This file connects to MongoDB Atlas
// ============================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get MongoDB connection string from .env file
const MONGODB_URI = process.env.MONGODB_URI || '';

// Function to connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // Attempt to connect to MongoDB
    const connection = await mongoose.connect(MONGODB_URI);
    
    // Log success message with host name
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', (error) => {
      console.error(`MongoDB connection error: ${error.message}`);
    });
    
    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Handle process termination - close connection gracefully
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    // Log error if connection fails
    console.error(`Error connecting to MongoDB: ${error}`);
    
    // Exit process if cannot connect
    process.exit(1);
  }
};

// Export the connect function
export default connectDB;