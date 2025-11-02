-- Create database (run this first)
CREATE DATABASE crud_api;

-- Connect to the database and create table
\c crud_api;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);

-- Insert sample data
INSERT INTO users (name, email)
VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');