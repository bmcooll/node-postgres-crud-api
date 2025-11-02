const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./queries');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

// User routes
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

// Start server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});