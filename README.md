# CRUD REST API with Node.js, Express, and PostgreSQL

A simple CRUD (Create, Read, Update, Delete) REST API built with Node.js, Express, and PostgreSQL.

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

## API Endpoints

- `GET /` - API info
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Testing the API

You can test the API using tools like Postman, curl, or any HTTP client.

### Example requests:

**Get all users:**
```bash
curl http://localhost:3000/users
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