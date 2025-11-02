const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./queries');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rate limiting simulation (basic)
const requestCounts = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const data = requestCounts.get(ip);
    if (now > data.resetTime) {
      data.count = 1;
      data.resetTime = now + windowMs;
    } else {
      data.count++;
      if (data.count > 100) { // 100 requests per 15 minutes
        return res.status(429).json({ error: 'Too many requests' });
      }
    }
  }
  next();
});

// Routes
app.get('/', (request, response) => {
  response.json({ 
    info: 'Node.js, Express, and Postgres API',
    version: '1.0.0',
    endpoints: {
      'GET /users': 'Get all users (supports ?page=1&limit=10&search=term)',
      'GET /users/:id': 'Get user by ID',
      'POST /users': 'Create new user',
      'PUT /users/:id': 'Update user',
      'DELETE /users/:id': 'Delete user',
      'GET /health': 'Health check'
    }
  });
});

// Health check endpoint
app.get('/health', (request, response) => {
  response.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// User routes
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});