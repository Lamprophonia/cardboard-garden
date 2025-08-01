-- Quick setup script to create user authentication tables
-- Run this to enable user registration and login functionality

USE cardboard_garden;

-- Source the user authentication schema
SOURCE sql/10_user_authentication.sql;

-- Verify tables were created
SHOW TABLES LIKE '%user%';
DESCRIBE users;
