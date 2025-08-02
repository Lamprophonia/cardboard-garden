-- User Deletion Helper
-- Find users to potentially delete

-- Show recent users (look for your personal email)
SELECT id, username, email, email_verified, created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

-- To delete a specific user by email (replace with actual email):
-- DELETE FROM users WHERE email = 'your-email@example.com';

-- To delete a specific user by ID (safer, replace with actual ID):
-- DELETE FROM users WHERE id = ?;

-- Check if user was deleted:
-- SELECT COUNT(*) as remaining_users FROM users WHERE email = 'your-email@example.com';
