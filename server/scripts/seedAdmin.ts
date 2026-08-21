// ============================================
// SEED ADMIN SCRIPT
// Creates the owner account
// Run once: npm run seed
// ============================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import connectDB from '../config/db';

// Load environment variables
dotenv.config();

// Admin credentials (change these!)
const adminUser = {
  name: 'Mac',
  email: 'mac@macdotcom.com',
  password: 'macdotend!',
  role: 'owner',
  title: 'Founder & CEO',
  bio: 'Building digital experiences and creating software solutions.',
  location: 'Remote',
};

// Function to seed admin
const seedAdmin = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });

    if (existingAdmin) {
      console.log('Admin already exists');
      console.log('Email:', existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const user = await User.create(adminUser);
    
    console.log('==========================================');
    console.log('Admin account created successfully');
    console.log('==========================================');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('==========================================');
    console.log('You can now login at /command-center');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Failed to seed admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seed function
seedAdmin();