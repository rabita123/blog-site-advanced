const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'your-netlify-domain.netlify.app'],
  credentials: true
}));

// ... rest of the existing code ...

module.exports = app; 