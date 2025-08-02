-- User Authentication System Schema
-- Cardboard Garden - Secure user management with email verification

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Basic user information
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    
    -- Email verification
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(64) NULL,
    email_verification_expires DATETIME NULL,
    email_verified_at DATETIME NULL,
    
    -- Account management
    active BOOLEAN DEFAULT TRUE,
    last_login_at DATETIME NULL,
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_verification_token (email_verification_token),
    INDEX idx_active_users (active, deleted_at),
    INDEX idx_created_at (created_at)
);

-- User preferences table (for theme settings, etc.)
CREATE TABLE IF NOT EXISTS user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- UI preferences
    theme ENUM('light', 'dark', 'system') DEFAULT 'system',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Collection preferences
    default_tcg ENUM('magic', 'pokemon', 'yugioh', 'lorcana') DEFAULT 'magic',
    cards_per_page INT DEFAULT 25 CHECK (cards_per_page IN (10, 25, 50, 100)),
    default_view ENUM('grid', 'list', 'compact') DEFAULT 'grid',
    
    -- Email preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Ensure one preference record per user
    UNIQUE KEY unique_user_preferences (user_id)
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_token (token),
    INDEX idx_user_reset (user_id, expires_at),
    INDEX idx_cleanup (expires_at, used_at)
);

-- User sessions table (for token blacklisting/session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address VARCHAR(45),
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_token_hash (token_hash),
    INDEX idx_user_sessions (user_id, expires_at),
    INDEX idx_cleanup (expires_at)
);

-- User collections table (link users to their card collections)
CREATE TABLE IF NOT EXISTS user_collections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    quantity INT DEFAULT 1 CHECK (quantity >= 0),
    condition_name ENUM('mint', 'near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged') DEFAULT 'near_mint',
    is_foil BOOLEAN DEFAULT FALSE,
    acquired_date DATE NULL,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    
    -- Prevent duplicate entries for same user/card/condition/foil combination
    UNIQUE KEY unique_user_card (user_id, card_id, condition_name, is_foil),
    
    -- Indexes
    INDEX idx_user_collections (user_id, card_id),
    INDEX idx_acquired_date (acquired_date),
    INDEX idx_condition (condition_name)
);

-- Create default admin user (password: Admin123!)
-- This will be automatically created with email verification bypassed
INSERT IGNORE INTO users (
    email, username, password_hash, first_name, last_name, 
    email_verified, email_verified_at, created_at, updated_at
) VALUES (
    'admin@cardboard.garden',
    'admin',
    '$2b$12$LQ1YZNqsGq8ZNWEiK7XrBub1oG6g6B8Wh8P6fNV7cNFnZj5FJZpZW', -- Admin123!
    'Admin',
    'User',
    TRUE,
    NOW(),
    NOW(),
    NOW()
);

-- Create default preferences for admin user
INSERT IGNORE INTO user_preferences (
    user_id, theme, default_tcg, email_notifications
) VALUES (
    1, 'dark', 'magic', FALSE
);

-- Add cleanup procedures for security
DELIMITER //

-- Procedure to clean up expired tokens
CREATE PROCEDURE IF NOT EXISTS CleanupExpiredTokens()
BEGIN
    -- Clean up expired password reset tokens
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW() OR used_at IS NOT NULL;
    
    -- Clean up expired user sessions
    DELETE FROM user_sessions 
    WHERE expires_at < NOW();
    
    -- Clean up expired email verification tokens
    UPDATE users 
    SET email_verification_token = NULL,
        email_verification_expires = NULL
    WHERE email_verification_expires < NOW() 
      AND email_verified = FALSE;
      
    SELECT 'Token cleanup completed' as message;
END //

DELIMITER ;

-- Display setup summary
SELECT 
    'User authentication system created successfully!' as status,
    COUNT(*) as total_users,
    SUM(CASE WHEN email_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
    SUM(CASE WHEN active = TRUE AND deleted_at IS NULL THEN 1 ELSE 0 END) as active_users
FROM users;

SELECT 'Next steps:' as instruction, 
       '1. Install bcrypt, express-rate-limit, express-validator packages' as step1,
       '2. Add auth routes to your Express app' as step2,
       '3. Get SendGrid API key for production emails' as step3;
