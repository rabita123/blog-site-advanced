const mongoose = require('mongoose');
const Post = require('../models/Post');
const connectDB = require('./db');

const clearDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear all posts
    await Post.deleteMany({});
    console.log('All posts have been deleted');

    console.log('Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase(); 