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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT FALSE,  -- Start inactive until email verified
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) NULL,
    email_verification_expires TIMESTAMP NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL,
    
    -- Add indexes for performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_email_verification_token (email_verification_token),
    INDEX idx_password_reset_token (password_reset_token)
);

-- Create user sessions table for managing active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address VARCHAR(45),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Create user collections table to link users to their card collections
CREATE TABLE IF NOT EXISTS user_collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    quantity INT DEFAULT 1,
    condition_id VARCHAR(20) DEFAULT 'near_mint',
    foil BOOLEAN DEFAULT FALSE,
    acquired_date DATE NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    
    -- Prevent duplicate entries for same user/card/condition/foil combination
    UNIQUE KEY unique_user_card (user_id, card_id, condition_id, foil),
    
    INDEX idx_user_id (user_id),
    INDEX idx_card_id (card_id),
    INDEX idx_acquired_date (acquired_date)
);

-- Create card conditions reference table
CREATE TABLE IF NOT EXISTS card_conditions (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0
);

-- Insert standard MTG card conditions
INSERT INTO card_conditions (id, name, description, sort_order) VALUES
('mint', 'Mint', 'Perfect condition, appears unplayed', 1),
('near_mint', 'Near Mint', 'Appears unplayed with minimal wear', 2),
('lightly_played', 'Lightly Played', 'Minor wear from play or handling', 3),
('moderately_played', 'Moderately Played', 'Moderate wear, clearly played', 4),
('heavily_played', 'Heavily Played', 'Major wear, extensively played', 5),
('damaged', 'Damaged', 'Severe wear or damage', 6)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    sort_order = VALUES(sort_order);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INT PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'dark',
    default_condition VARCHAR(20) DEFAULT 'near_mint',
    show_prices BOOLEAN DEFAULT TRUE,
    currency VARCHAR(3) DEFAULT 'USD',
    privacy_level VARCHAR(20) DEFAULT 'private',
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (default_condition) REFERENCES card_conditions(id)
);

-- Add some initial admin user (password will be hashed in application)
-- Note: This is just a placeholder - real password hashing should be done in the application
-- INSERT INTO users (username, email, password_hash, is_active, email_verified) VALUES
-- ('admin', 'admin@cardboard.garden', '$placeholder_hash$', TRUE, TRUE);

-- Create view for user collection stats
CREATE OR REPLACE VIEW user_collection_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(DISTINCT uc.card_id) as unique_cards,
    SUM(uc.quantity) as total_cards,
    COUNT(DISTINCT c.set_code) as sets_collected,
    MAX(uc.created_at) as last_added
FROM users u
LEFT JOIN user_collections uc ON u.id = uc.user_id
LEFT JOIN cards c ON uc.card_id = c.id
WHERE u.is_active = TRUE
GROUP BY u.id, u.username;

COMMIT;
