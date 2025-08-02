-- Database Security and User Management Setup
-- This script creates proper database users with appropriate permissions

-- =============================================================================
-- DATABASE USERS AND PERMISSIONS SETUP
-- Follow principle of least privilege for security
-- =============================================================================

-- Create application user with limited permissions
-- Replace 'your_secure_password' with a strong password
CREATE USER IF NOT EXISTS 'tcg_app'@'localhost' IDENTIFIED BY 'your_secure_password';
CREATE USER IF NOT EXISTS 'tcg_app'@'%' IDENTIFIED BY 'your_secure_password';

-- Create read-only user for reporting/analytics  
CREATE USER IF NOT EXISTS 'tcg_readonly'@'localhost' IDENTIFIED BY 'readonly_password';
CREATE USER IF NOT EXISTS 'tcg_readonly'@'%' IDENTIFIED BY 'readonly_password';

-- Create backup user with minimal required permissions
CREATE USER IF NOT EXISTS 'tcg_backup'@'localhost' IDENTIFIED BY 'backup_password';

-- =============================================================================
-- GRANT PERMISSIONS TO APPLICATION USER
-- =============================================================================

-- Shared database permissions (full access for collections/users)
GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_shared.* TO 'tcg_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_shared.* TO 'tcg_app'@'%';

-- Game databases permissions (full access for card management)
GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_pokemon.* TO 'tcg_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_pokemon.* TO 'tcg_app'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_magic.* TO 'tcg_app'@'localhost';  
GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_magic.* TO 'tcg_app'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_yugioh.* TO 'tcg_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_yugioh.* TO 'tcg_app'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_lorcana.* TO 'tcg_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON tcg_lorcana.* TO 'tcg_app'@'%';

-- Grant EXECUTE for stored procedures
GRANT EXECUTE ON tcg_shared.* TO 'tcg_app'@'localhost';
GRANT EXECUTE ON tcg_shared.* TO 'tcg_app'@'%';

-- =============================================================================
-- GRANT PERMISSIONS TO READ-ONLY USER
-- =============================================================================

-- Read-only access for reporting and analytics
GRANT SELECT ON tcg_shared.* TO 'tcg_readonly'@'localhost';
GRANT SELECT ON tcg_shared.* TO 'tcg_readonly'@'%';

GRANT SELECT ON tcg_pokemon.* TO 'tcg_readonly'@'localhost';
GRANT SELECT ON tcg_pokemon.* TO 'tcg_readonly'@'%';

GRANT SELECT ON tcg_magic.* TO 'tcg_readonly'@'localhost';
GRANT SELECT ON tcg_magic.* TO 'tcg_readonly'@'%';

GRANT SELECT ON tcg_yugioh.* TO 'tcg_readonly'@'localhost';
GRANT SELECT ON tcg_yugioh.* TO 'tcg_readonly'@'%';

GRANT SELECT ON tcg_lorcana.* TO 'tcg_readonly'@'localhost';
GRANT SELECT ON tcg_lorcana.* TO 'tcg_readonly'@'%';

-- =============================================================================
-- GRANT PERMISSIONS TO BACKUP USER
-- =============================================================================

-- Minimal permissions for backup operations
GRANT SELECT, LOCK TABLES ON tcg_shared.* TO 'tcg_backup'@'localhost';
GRANT SELECT, LOCK TABLES ON tcg_pokemon.* TO 'tcg_backup'@'localhost';
GRANT SELECT, LOCK TABLES ON tcg_magic.* TO 'tcg_backup'@'localhost';
GRANT SELECT, LOCK TABLES ON tcg_yugioh.* TO 'tcg_backup'@'localhost';
GRANT SELECT, LOCK TABLES ON tcg_lorcana.* TO 'tcg_backup'@'localhost';

-- =============================================================================
-- FLUSH PRIVILEGES
-- =============================================================================

FLUSH PRIVILEGES;

-- Display created users
SELECT 'Database users created successfully!' AS message;
SELECT User, Host FROM mysql.user WHERE User LIKE 'tcg_%';
