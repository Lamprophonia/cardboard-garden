-- Create user_preferences table for Cardboard Garden
-- This table stores user-specific preferences and is required for email verification

DROP TABLE IF EXISTS user_preferences;
CREATE TABLE user_preferences (
    user_id INT NOT NULL PRIMARY KEY,
    -- Add additional preference columns as needed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
