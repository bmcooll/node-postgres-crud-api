const pool = require('./database');

// Get all users with pagination and search
const getUsers = (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const search = request.query.search || '';
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM users';
  let countQuery = 'SELECT COUNT(*) FROM users';
  let queryParams = [];
  let countParams = [];

  if (search) {
    query += ' WHERE name ILIKE $1 OR email ILIKE $1';
    countQuery += ' WHERE name ILIKE $1 OR email ILIKE $1';
    queryParams.push(`%${search}%`);
    countParams.push(`%${search}%`);
  }

  query += ` ORDER BY id ASC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(limit, offset);

  // Get total count for pagination
  pool.query(countQuery, countParams, (error, countResult) => {
    if (error) {
      return response.status(500).json({ error: 'Database error occurred' });
    }

    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get users
    pool.query(query, queryParams, (error, results) => {
      if (error) {
        return response.status(500).json({ error: 'Database error occurred' });
      }
      
      response.status(200).json({
        users: results.rows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalUsers: totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    });
  });
};

// Get user by ID with validation
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  if (!id || id < 1) {
    return response.status(400).json({ error: 'Invalid user ID' });
  }

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: 'Database error occurred' });
    }
    
    if (results.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }
    
    response.status(200).json(results.rows[0]);
  });
};

// Create a new user with validation
const createUser = (request, response) => {
  const { name, email } = request.body;

  // Validation
  if (!name || !email) {
    return response.status(400).json({ error: 'Name and email are required' });
  }

  if (name.length > 30 || email.length > 30) {
    return response.status(400).json({ error: 'Name and email must be 30 characters or less' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return response.status(400).json({ error: 'Invalid email format' });
  }

  // Check if email already exists
  pool.query('SELECT id FROM users WHERE email = $1', [email], (error, existingUser) => {
    if (error) {
      return response.status(500).json({ error: 'Database error occurred' });
    }

    if (existingUser.rows.length > 0) {
      return response.status(409).json({ error: 'Email already exists' });
    }

    // Create user
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
      if (error) {
        return response.status(500).json({ error: 'Database error occurred' });
      }
      response.status(201).json({
        message: `User added with ID: ${results.rows[0].id}`,
        user: results.rows[0]
      });
    });
  });
};

// Update user with validation
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  if (!id || id < 1) {
    return response.status(400).json({ error: 'Invalid user ID' });
  }

  if (!name || !email) {
    return response.status(400).json({ error: 'Name and email are required' });
  }

  if (name.length > 30 || email.length > 30) {
    return response.status(400).json({ error: 'Name and email must be 30 characters or less' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return response.status(400).json({ error: 'Invalid email format' });
  }

  // Check if user exists and email is not taken by another user
  pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id], (error, existingUser) => {
    if (error) {
      return response.status(500).json({ error: 'Database error occurred' });
    }

    if (existingUser.rows.length > 0) {
      return response.status(409).json({ error: 'Email already exists' });
    }

    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id],
      (error, results) => {
        if (error) {
          return response.status(500).json({ error: 'Database error occurred' });
        }
        
        if (results.rows.length === 0) {
          return response.status(404).json({ error: 'User not found' });
        }
        
        response.status(200).json({
          message: `User modified with ID: ${id}`,
          user: results.rows[0]
        });
      }
    );
  });
};

// Delete user with validation
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  if (!id || id < 1) {
    return response.status(400).json({ error: 'Invalid user ID' });
  }

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      return response.status(500).json({ error: 'Database error occurred' });
    }
    
    if (results.rowCount === 0) {
      return response.status(404).json({ error: 'User not found' });
    }
    
    response.status(200).json({ message: `User deleted with ID: ${id}` });
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};