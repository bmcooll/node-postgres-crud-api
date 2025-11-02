# CRUD REST API Documentation

## Overview
A comprehensive CRUD REST API built with Node.js, Express, and PostgreSQL featuring advanced validation, pagination, search, and error handling.

## Base URL
```
http://localhost:3000
```

## Authentication
Currently no authentication required (can be extended).

## Endpoints

### 1. Health Check
**GET** `/health`

Returns API health status and uptime.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Get All Users
**GET** `/users`

Retrieve all users with optional pagination and search.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name or email

**Example:**
```
GET /users?page=1&limit=5&search=john
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalUsers": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. Get User by ID
**GET** `/users/:id`

Retrieve a specific user by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses:**
- `400`: Invalid user ID
- `404`: User not found

### 4. Create User
**POST** `/users`

Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Validation Rules:**
- Name and email are required
- Maximum 30 characters each
- Valid email format
- Email must be unique

**Response:**
```json
{
  "message": "User added with ID: 3",
  "user": {
    "id": 3,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Validation errors
- `409`: Email already exists

### 5. Update User
**PUT** `/users/:id`

Update an existing user.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response:**
```json
{
  "message": "User modified with ID: 1",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Error Responses:**
- `400`: Validation errors
- `404`: User not found
- `409`: Email already exists

### 6. Delete User
**DELETE** `/users/:id`

Delete a user by ID.

**Response:**
```json
{
  "message": "User deleted with ID: 1"
}
```

**Error Responses:**
- `400`: Invalid user ID
- `404`: User not found

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

## HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `409`: Conflict
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

Basic rate limiting implemented:
- 100 requests per 15 minutes per IP address
- Returns `429` status when exceeded

## Testing

Run the included test suite:
```bash
npm test
```

## Environment Variables

Required environment variables in `.env`:
- `PORT`: Server port (default: 3000)
- `DB_USER`: PostgreSQL username
- `DB_HOST`: Database host
- `DB_NAME`: Database name
- `DB_PASSWORD`: Database password
- `DB_PORT`: Database port
- `NODE_ENV`: Environment (development/production)
- `API_VERSION`: API version