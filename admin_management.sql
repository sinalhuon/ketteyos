-- ============================================
-- ADMIN MANAGEMENT SQL SCRIPTS
-- ============================================

-- 1. CREATE NEW ADMIN USER
-- Replace email, name, and password hash
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`)
VALUES (
    UUID(),
    'newadmin@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhqG', -- password: admin123
    'New Admin Name',
    'ADMIN',
    NOW()
);

-- 2. CHANGE ADMIN PASSWORD
-- Update password for specific admin
UPDATE `User`
SET `password` = '$2a$10$NewHashedPasswordHere'
WHERE `email` = 'admin@admin.com';

-- 3. PROMOTE USER TO ADMIN
-- Make existing user an admin
UPDATE `User`
SET `role` = 'ADMIN'
WHERE `email` = 'user@example.com';

-- 4. DEMOTE ADMIN TO CLIENT
-- Remove admin privileges
UPDATE `User`
SET `role` = 'CLIENT'
WHERE `email` = 'admin@example.com';

-- 5. LIST ALL ADMINS
-- View all admin users
SELECT `id`, `email`, `name`, `role`, `createdAt`
FROM `User`
WHERE `role` = 'ADMIN'
ORDER BY `createdAt` DESC;

-- 6. LIST ALL USERS (ADMINS + CLIENTS)
-- View all users with their roles
SELECT `id`, `email`, `name`, `role`, `createdAt`
FROM `User`
ORDER BY `role` DESC, `createdAt` DESC;

-- 7. DELETE ADMIN USER
-- ⚠️ USE WITH CAUTION - This is permanent!
DELETE FROM `User`
WHERE `email` = 'admin@example.com' AND `role` = 'ADMIN';

-- 8. CHECK USER ROLE
-- Verify a user's role
SELECT `email`, `name`, `role`
FROM `User`
WHERE `email` = 'user@example.com';

-- ============================================
-- COMMON PASSWORD HASHES (FOR TESTING ONLY!)
-- ⚠️ NEVER USE THESE IN PRODUCTION!
-- ============================================

-- Password: admin123
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhqG

-- Password: password123
-- Hash: $2a$10$5Dhlu2K5tYvFKPqBZLKHMOqFJEkHrXJfJU9V8p7W8YvXJQGKqWK8m

-- ============================================
-- GENERATE PASSWORD HASH
-- ============================================
-- Use one of these methods:
-- 1. Online: https://bcrypt-generator.com (10 rounds)
-- 2. Node.js: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10, (err, hash) => console.log(hash));"
-- 3. PHP: password_hash('YourPassword', PASSWORD_BCRYPT, ['cost' => 10]);
