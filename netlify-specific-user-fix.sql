-- SPECIFIC FIX FOR NETLIFY IP ACCESS
-- Execute these commands as a MySQL admin user

-- STEP 1: Create user for Netlify's specific IP
CREATE USER 'alina'@'3.23.79.24' IDENTIFIED BY '{z"B=8aM;0DNOHO_';

-- STEP 2: Grant permissions for both databases  
GRANT ALL PRIVILEGES ON `dev`.* TO 'alina'@'3.23.79.24';
GRANT ALL PRIVILEGES ON `prod`.* TO 'alina'@'3.23.79.24';

-- STEP 3: Create user for Netlify's IP range (covers more IPs)
CREATE USER 'alina'@'3.23.79.%' IDENTIFIED BY '{z"B=8aM;0DNOHO_';
GRANT ALL PRIVILEGES ON `dev`.* TO 'alina'@'3.23.79.%';
GRANT ALL PRIVILEGES ON `prod`.* TO 'alina'@'3.23.79.%';

-- STEP 4: Also ensure wildcard user exists and works
DROP USER IF EXISTS 'alina'@'%';
CREATE USER 'alina'@'%' IDENTIFIED BY '{z"B=8aM;0DNOHO_';
GRANT ALL PRIVILEGES ON `dev`.* TO 'alina'@'%';
GRANT ALL PRIVILEGES ON `prod`.* TO 'alina'@'%';

-- STEP 5: Apply all changes
FLUSH PRIVILEGES;

-- STEP 6: Verify all users were created
SELECT user, host FROM mysql.user WHERE user = 'alina';

-- You should see:
-- alina | %
-- alina | 3.23.79.24  
-- alina | 3.23.79.% 