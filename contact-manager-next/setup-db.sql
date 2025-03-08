-- Create the database if it doesn't exist
CREATE DATABASE contact_manager;

-- Connect to the database
\c contact_manager;

-- Create a new user with a password
CREATE USER contact_manager_user WITH PASSWORD 'contact_manager_password';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE contact_manager TO contact_manager_user;
