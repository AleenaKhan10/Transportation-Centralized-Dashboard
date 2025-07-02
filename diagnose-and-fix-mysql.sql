-- COMPREHENSIVE MYSQL USER DIAGNOSTIC AND FIX SCRIPT
-- Execute these commands step by step as a MySQL admin user

-- STEP 1: DIAGNOSE CURRENT SITUATION
-- Check all users named 'alina'
SELECT user, host, account_locked, password_expired FROM mysql.user WHERE user = 'alina';

-- Check if there are any grants for existing alina users
SHOW GRANTS FOR 'alina'@'localhost';  -- This might fail, that's OK
SHOW GRANTS FOR 'alina'@'%';          -- This might fail, that's OK

-- STEP 2: CLEAN UP EXISTING USERS
-- Remove any existing 'alina' users to avoid conflicts
DROP USER IF EXISTS 'alina'@'localhost';
DROP USER IF EXISTS 'alina'@'%';
DROP USER IF EXISTS 'alina'@'3.23.79.24';
DROP USER IF EXISTS 'alina'@'::1';
DROP USER IF EXISTS 'alina'@'127.0.0.1';

-- STEP 3: CREATE NEW USER WITH WILDCARD HOST
-- Create user that can connect from anywhere
CREATE USER 'alina'@'%' IDENTIFIED BY '{z"B=8aM;0DNOHO_';

-- STEP 4: GRANT PERMISSIONS
-- Grant full permissions on both databases
GRANT ALL PRIVILEGES ON `dev`.* TO 'alina'@'%';
GRANT ALL PRIVILEGES ON `prod`.* TO 'alina'@'%';

-- Grant additional permissions that might be needed
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON `dev`.* TO 'alina'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON `prod`.* TO 'alina'@'%';

-- STEP 5: APPLY CHANGES
FLUSH PRIVILEGES;

-- STEP 6: VERIFY THE FIX
-- Check that user was created correctly
SELECT user, host FROM mysql.user WHERE user = 'alina';

-- Check grants for the new user
SHOW GRANTS FOR 'alina'@'%';

-- Test connection (this will show if authentication works)
-- SELECT USER(), CURRENT_USER(), CONNECTION_ID();

-- STEP 7: ADDITIONAL SECURITY CHECK
-- Make sure MySQL is configured to allow remote connections
-- Check if bind-address is set to allow external connections
-- SHOW VARIABLES LIKE 'bind_address';

-- ALTERNATIVE FIX: If the above doesn't work, try creating user with specific IP
-- CREATE USER 'alina'@'3.23.79.24' IDENTIFIED BY '{z"B=8aM;0DNOHO_';
-- GRANT ALL PRIVILEGES ON `dev`.* TO 'alina'@'3.23.79.24';
-- GRANT ALL PRIVILEGES ON `prod`.* TO 'alina'@'3.23.79.24';
-- FLUSH PRIVILEGES; 