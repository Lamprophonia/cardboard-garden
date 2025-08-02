-- Quick User Check - Start Here
-- Simple queries to get started exploring user data

-- 1. BASIC USER LIST (safest query to start with)
SELECT username, email, email_verified, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. USER COUNT BY VERIFICATION STATUS
SELECT 
    CASE WHEN email_verified = 1 THEN 'Verified' ELSE 'Unverified' END as status,
    COUNT(*) as count
FROM users 
GROUP BY email_verified;

-- 3. RECENT REGISTRATIONS
SELECT username, email, email_verified, created_at
FROM users 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY created_at DESC;

-- 4. TEST USERS (if any exist)
SELECT username, email, email_verified, created_at
FROM users 
WHERE username LIKE 'test_%' OR email LIKE '%test%'
ORDER BY created_at DESC;

-- 5. USERS WITH VERIFICATION TOKENS
SELECT username, email, 
       CASE WHEN email_verification_token IS NOT NULL THEN 'Has Token' ELSE 'No Token' END as token_status,
       CASE WHEN email_verification_expires < NOW() THEN 'Expired' ELSE 'Valid' END as token_validity
FROM users 
WHERE email_verified = 0
ORDER BY created_at DESC;
