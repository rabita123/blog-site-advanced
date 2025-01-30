require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Debug: Print current directory and files
console.log('Current directory:', __dirname);
console.log('Files in current directory:', fs.readdirSync(__dirname));
console.log('Files in routes directory:', fs.readdirSync(path.join(__dirname, 'routes')));

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? ['https://your-netlify-app.netlify.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
try {
  const authPath = path.join(__dirname, 'routes', 'auth.js');
  const postsPath = path.join(__dirname, 'routes', 'posts.js');
  
  console.log('Auth route path:', authPath);
  console.log('Posts route path:', postsPath);
  
  if (fs.existsSync(authPath) && fs.existsSync(postsPath)) {
    app.use('/api/auth', require(authPath));
    app.use('/api/posts', require(postsPath));
  } else {
    console.error('Route files not found!');
    console.error('Auth exists:', fs.existsSync(authPath));
    console.error('Posts exists:', fs.existsSync(postsPath));
  }
} catch (error) {
  console.error('Error loading routes:', error);
}

// Root route for API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blog API Server Running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Catch all unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
}); 