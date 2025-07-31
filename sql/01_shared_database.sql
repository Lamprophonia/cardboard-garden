-- Hybrid Database Architecture for TCG Card Collection Manager
-- This approach uses shared infrastructure with separate card databases per game

-- =============================================================================
-- SHARED DATABASE: tcg_shared
-- Contains user management, collections, and cross-game functionality
-- =============================================================================

CREATE DATABASE IF NOT EXISTS tcg_shared
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tcg_shared;

-- Table for TCG games (metadata only)
CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    abbreviation VARCHAR(10),
    description TEXT,
    publisher VARCHAR(100),
    database_name VARCHAR(50) NOT NULL, -- Points to game-specific database
    api_endpoint VARCHAR(200), -- For microservice approach
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table (shared across all games)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Card conditions (shared across all games)
CREATE TABLE conditions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    abbreviation VARCHAR(5),
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collection entries (references cards in game-specific databases)
CREATE TABLE collection (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    external_card_id INT NOT NULL, -- ID in the game-specific database
    condition_id INT,
    quantity INT NOT NULL DEFAULT 1,
    purchase_price DECIMAL(10,2),
    purchase_date DATE,
    notes TEXT,
    is_foil BOOLEAN DEFAULT FALSE,
    is_first_edition BOOLEAN DEFAULT FALSE,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_game_id (game_id),
    INDEX idx_external_card_id (external_card_id),
    INDEX idx_user_game (user_id, game_id)
);

-- Wishlists (references cards in game-specific databases)
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    external_card_id INT NOT NULL, -- ID in the game-specific database
    priority INT DEFAULT 1,
    max_price DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_game_card_wishlist (user_id, game_id, external_card_id),
    INDEX idx_user_id (user_id),
    INDEX idx_game_id (game_id),
    INDEX idx_priority (priority)
);

-- Insert game metadata
INSERT INTO games (name, abbreviation, description, publisher, database_name) VALUES
('Pokémon Trading Card Game', 'PTCG', 'The original trading card game based on the Pokémon franchise', 'The Pokémon Company', 'tcg_pokemon'),
('Magic: The Gathering', 'MTG', 'The first trading card game, created by Richard Garfield', 'Wizards of the Coast', 'tcg_magic'),
('Yu-Gi-Oh!', 'YGO', 'Trading card game based on the Yu-Gi-Oh! manga and anime series', 'Konami', 'tcg_yugioh'),
('Disney Lorcana', 'LORCANA', 'Disney-themed trading card game featuring beloved characters and stories', 'Ravensburger', 'tcg_lorcana');

-- Insert sample conditions
INSERT INTO conditions (name, abbreviation, description, sort_order) VALUES
('Mint', 'M', 'Perfect condition, no flaws', 1),
('Near Mint', 'NM', 'Almost perfect, very minor flaws', 2),
('Excellent', 'EX', 'Minor wear, still very good condition', 3),
('Good', 'GD', 'Moderate wear, clearly used but acceptable', 4),
('Light Played', 'LP', 'Noticeable wear but still playable', 5),
('Played', 'PL', 'Heavy wear, significant damage', 6),
('Poor', 'PR', 'Heavily damaged, barely acceptable', 7);
