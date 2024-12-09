const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('./db');

const adminUser = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123',  // This will be hashed by the User model
  role: 'admin'
};

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const user = new User(adminUser);
    await user.save();

    console.log('Admin user created successfully');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin(); 