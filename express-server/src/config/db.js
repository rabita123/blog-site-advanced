const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://rabita1234:tashfiq0907027@cluster0.qrp6h.mongodb.net/blog-system?authSource=admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Attempting to connect to MongoDB...');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 