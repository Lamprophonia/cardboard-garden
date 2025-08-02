-- Cardboard Garden - User Database Exploration SQL
-- Purpose: Useful queries for exploring user data and authentication status
-- Updated to match actual database schema (email_verified instead of is_verified)

-- ==================================================
-- BASIC USER OVERVIEW
-- ==================================================

-- Get all users with basic info and verification status
SELECT 
    id,
    username,
    email,
    first_name,
    last_name,
    email_verified,
    created_at,
    updated_at
FROM users
ORDER BY created_at DESC;

-- ==================================================
-- USER VERIFICATION STATUS
-- ==================================================

-- Count users by verification status
SELECT 
    email_verified,
    COUNT(*) as user_count
FROM users
GROUP BY email_verified;

-- Get unverified users (might need email reminders)
SELECT 
    id,
    username,
    email,
    first_name,
    last_name,
    created_at,
    TIMESTAMPDIFF(HOUR, created_at, NOW()) as hours_since_registration
FROM users
WHERE email_verified = 0
ORDER BY created_at DESC;

-- Get recently verified users
SELECT 
    id,
    username,
    email,
    first_name,
    last_name,
    created_at,
    updated_at,
    email_verified_at,
    TIMESTAMPDIFF(MINUTE, created_at, COALESCE(email_verified_at, updated_at)) as minutes_to_verify
FROM users
WHERE email_verified = 1
AND DATE(COALESCE(email_verified_at, updated_at)) = CURDATE()
ORDER BY COALESCE(email_verified_at, updated_at) DESC;

-- ==================================================
-- EMAIL VERIFICATION TOKENS (if using separate table)
-- ==================================================

-- Note: Based on schema, verification tokens are stored in users table
-- Check users with pending verification tokens
SELECT 
    id,
    username,
    email,
    email_verification_token,
    email_verification_expires,
    created_at,
    CASE 
        WHEN email_verification_expires < NOW() THEN 'EXPIRED'
        WHEN email_verification_token IS NULL THEN 'NO_TOKEN'
        ELSE 'ACTIVE'
    END as token_status
FROM users
WHERE email_verified = 0
ORDER BY created_at DESC;

-- Count verification tokens by status
SELECT 
    CASE 
        WHEN email_verification_expires < NOW() THEN 'EXPIRED'
        WHEN email_verification_token IS NULL THEN 'NO_TOKEN'
        WHEN email_verified = 1 THEN 'USED'
        ELSE 'ACTIVE'
    END as token_status,
    COUNT(*) as token_count
FROM users
GROUP BY token_status;

-- ==================================================
-- USER ACTIVITY PATTERNS
-- ==================================================

-- Users registered today
SELECT 
    id,
    username,
    email,
    is_verified,
    created_at
FROM users
WHERE DATE(created_at) = CURDATE()
ORDER BY created_at DESC;

-- Users registered this week
SELECT 
    DATE(created_at) as registration_date,
    COUNT(*) as users_registered,
    SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_users
FROM users
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;

-- ==================================================
-- TEST USER IDENTIFICATION
-- ==================================================

-- Find test users (based on common test patterns)
SELECT 
    id,
    username,
    email,
    email_verified,
    created_at
FROM users
WHERE 
    username LIKE 'test_%'
    OR email LIKE 'test_%@%'
    OR email LIKE '%@automation.%'
    OR email LIKE '%@test.%'
ORDER BY created_at DESC;

-- ==================================================
-- USER PREFERENCES
-- ==================================================

-- Get user preferences (if any exist)
SELECT 
    up.user_id,
    u.username,
    u.email,
    up.theme,
    up.default_tcg,
    up.cards_per_page,
    up.email_notifications,
    up.created_at,
    up.updated_at
FROM user_preferences up
JOIN users u ON up.user_id = u.id
ORDER BY up.updated_at DESC;

-- ==================================================
-- AUTHENTICATION SESSIONS
-- ==================================================

-- Active user sessions
SELECT 
    us.id,
    us.user_id,
    u.username,
    u.email,
    us.token_hash,
    us.expires_at,
    us.created_at,
    us.last_used_at,
    CASE 
        WHEN us.expires_at < NOW() THEN 'EXPIRED'
        ELSE 'ACTIVE'
    END as session_status
FROM user_sessions us
JOIN users u ON us.user_id = u.id
WHERE us.expires_at > NOW()
ORDER BY us.last_used_at DESC;

-- ==================================================
-- PASSWORD RESET TOKENS
-- ==================================================

-- Check password reset tokens
SELECT 
    prt.id,
    prt.user_id,
    u.username,
    u.email,
    prt.token,
    prt.expires_at,
    prt.created_at,
    CASE 
        WHEN prt.expires_at < NOW() THEN 'EXPIRED'
        ELSE 'ACTIVE'
    END as token_status
FROM password_reset_tokens prt
JOIN users u ON prt.user_id = u.id
ORDER BY prt.created_at DESC;

-- ==================================================
-- USER STATISTICS
-- ==================================================

-- Overall user statistics
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_users,
    SUM(CASE WHEN email_verified = 0 THEN 1 ELSE 0 END) as unverified_users,
    ROUND(
        (SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 
        2
    ) as verification_rate_percent,
    MIN(created_at) as first_user_registered,
    MAX(created_at) as last_user_registered
FROM users;

-- Users registered by day (last 30 days)
SELECT 
    DATE(created_at) as registration_date,
    COUNT(*) as users_registered,
    SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_same_day
FROM users
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;

-- ==================================================
-- QUICK VERIFICATION STATUS CHECK
-- ==================================================

-- Simple query to see current user status
SELECT 
    CONCAT(first_name, ' ', last_name) as full_name,
    username,
    email,
    CASE 
        WHEN email_verified = 1 THEN '✅ VERIFIED'
        ELSE '❌ UNVERIFIED'
    END as status,
    created_at as registered
FROM users
ORDER BY created_at DESC
LIMIT 20;
