# Enhanced CRUD REST API with Node.js, Express, and PostgreSQL

A comprehensive CRUD (Create, Read, Update, Delete) REST API built with Node.js, Express, and PostgreSQL featuring advanced validation, pagination, search functionality, and proper error handling.

## Prerequisites

- Node.js installed
- PostgreSQL installed and running
- npm or yarn package manager

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
   - Create a PostgreSQL database named `crud_api`
   - Run the SQL commands in `init.sql` to create the table and sample data

3. Configure environment variables:
   - Update the `.env` file with your PostgreSQL credentials

4. Start the server:
```bash
npm run dev
```

The API will be running on `http://localhost:3000`

## Features

✅ **Core CRUD Operations** - Create, Read, Update, Delete users
✅ **Input Validation** - Email format, required fields, length limits
✅ **Error Handling** - Comprehensive error responses with proper HTTP codes
✅ **Pagination** - Efficient data retrieval with page/limit support
✅ **Search Functionality** - Search users by name or email
✅ **Rate Limiting** - Basic protection against abuse
✅ **Health Check** - Monitor API status and uptime
✅ **Request Logging** - Track all API requests
✅ **Environment Configuration** - Secure credential management
✅ **Automated Testing** - Built-in test suite
✅ **Comprehensive Documentation** - Detailed API docs

## API Endpoints

- `GET /` - API info and available endpoints
- `GET /health` - Health check and uptime
- `GET /users` - Get all users (supports pagination & search)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (with validation)
- `PUT /users/:id` - Update user (with validation)
- `DELETE /users/:id` - Delete user

## Testing the API

### Automated Testing
Run the built-in test suite:
```bash
npm test
```

### Manual Testing
You can test the API using tools like Postman, curl, or any HTTP client.

### Example requests:

**Health check:**
```bash
curl http://localhost:3000/health
```

**Get all users with pagination:**
```bash
curl "http://localhost:3000/users?page=1&limit=5"
```

**Search users:**
```bash
curl "http://localhost:3000/users?search=john"
```

**Create a user:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

**Update a user:**
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'
```

**Delete a user:**
```bash
curl -X DELETE http://localhost:3000/users/1
```

## Documentation

See `API_DOCUMENTATION.md` for comprehensive API documentation including all endpoints, parameters, and response formats.

## Project Structure

```
├── index.js              # Main server file
├── queries.js            # Database operations with validation
├── database.js           # PostgreSQL connection
├── test-api.js           # Automated test suite
├── init.sql              # Database setup script
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (not in git)
├── .gitignore           # Git ignore rules
├── README.md            # This file
└── API_DOCUMENTATION.md # Detailed API docs
```