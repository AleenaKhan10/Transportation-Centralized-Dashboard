-- Fix Database User Permissions for Remote Access
-- Execute these commands in your MySQL database as an admin user

-- Check current user permissions
SELECT user, host FROM mysql.user WHERE user = 'alina';

-- Option 1: Create a new user that allows connections from any IP
CREATE USER 'alina'@'%' IDENTIFIED BY '{z"B=8aM;0DNOHO_';
GRANT ALL PRIVILEGES ON dev.* TO 'alina'@'%';
GRANT ALL PRIVILEGES ON prod.* TO 'alina'@'%';

-- Option 2: If user already exists with '%' host, update password
-- ALTER USER 'alina'@'%' IDENTIFIED BY '{z"B=8aM;0DNOHO_';

-- Option 3: Grant specific permissions (more secure)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON dev.* TO 'alina'@'%';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON prod.* TO 'alina'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Verify the changes
SELECT user, host FROM mysql.user WHERE user = 'alina';
SHOW GRANTS FOR 'alina'@'%'; 