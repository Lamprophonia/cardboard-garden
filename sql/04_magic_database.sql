-- =============================================================================
-- MAGIC-SPECIFIC DATABASE: tcg_magic
-- Optimized schema specifically for Magic: The Gathering
-- =============================================================================

CREATE DATABASE IF NOT EXISTS tcg_magic
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tcg_magic;

-- Magic-specific rarities
CREATE TABLE rarities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    symbol VARCHAR(10),
    color VARCHAR(7),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Magic sets
CREATE TABLE sets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) UNIQUE,
    release_date DATE,
    total_cards INT,
    description TEXT,
    set_type ENUM('Core', 'Expansion', 'Masters', 'Supplemental', 'Draft') DEFAULT 'Expansion',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
);

-- Magic colors
CREATE TABLE colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    symbol CHAR(1) NOT NULL UNIQUE, -- W, U, B, R, G
    color_hex VARCHAR(7) NOT NULL
);

-- Magic cards with game-specific fields
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    set_id INT NOT NULL,
    rarity_id INT,
    name VARCHAR(200) NOT NULL,
    card_number VARCHAR(20),
    card_type VARCHAR(100) NOT NULL, -- Creature, Instant, Sorcery, etc.
    subtype VARCHAR(200), -- Human Warrior, Equipment, etc.
    supertype VARCHAR(100), -- Legendary, Basic, etc.
    
    -- Magic-specific attributes
    mana_cost VARCHAR(50), -- {2}{R}{R}
    converted_mana_cost INT, -- Total mana cost
    power INT, -- For creatures
    toughness INT, -- For creatures
    loyalty INT, -- For planeswalkers
    color_identity VARCHAR(10), -- WUBRG combination
    colors VARCHAR(10), -- Actual colors
    
    -- Rules text
    oracle_text TEXT, -- Official rules text
    flavor_text TEXT,
    
    -- Magic-specific flags
    is_legendary BOOLEAN DEFAULT FALSE,
    is_artifact BOOLEAN DEFAULT FALSE,
    is_multicolored BOOLEAN DEFAULT FALSE,
    
    -- Common fields
    artist VARCHAR(100),
    image_url VARCHAR(500),
    market_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE,
    FOREIGN KEY (rarity_id) REFERENCES rarities(id) ON DELETE SET NULL,
    
    INDEX idx_set_id (set_id),
    INDEX idx_rarity_id (rarity_id),
    INDEX idx_name (name),
    INDEX idx_card_type (card_type),
    INDEX idx_converted_mana_cost (converted_mana_cost),
    INDEX idx_color_identity (color_identity),
    INDEX idx_power (power),
    INDEX idx_toughness (toughness)
);

-- Insert colors
INSERT INTO colors (name, symbol, color_hex) VALUES
('White', 'W', '#FFFBD5'),
('Blue', 'U', '#0E68AB'),
('Black', 'B', '#150B00'),
('Red', 'R', '#D3202A'),
('Green', 'G', '#00733E');

-- Insert rarities
INSERT INTO rarities (name, symbol, color, sort_order) VALUES
('Common', 'C', '#000000', 1),
('Uncommon', 'U', '#C0C0C0', 2),
('Rare', 'R', '#FFD700', 3),
('Mythic Rare', 'MR', '#FF4500', 4);

-- Insert sample sets
INSERT INTO sets (name, code, release_date, total_cards, description, set_type) VALUES
('Alpha', 'LEA', '1993-08-05', 295, 'The first Magic: The Gathering set', 'Core'),
('Beta', 'LEB', '1993-10-01', 302, 'The second Magic: The Gathering set', 'Core');

-- Insert sample cards
INSERT INTO cards (set_id, rarity_id, name, card_type, mana_cost, converted_mana_cost, oracle_text, color_identity, colors, is_artifact, artist, market_price) VALUES
(1, 4, 'Black Lotus', 'Artifact', '0', 0, '{T}, Sacrifice Black Lotus: Add three mana of any one color.', '', '', TRUE, 'Christopher Rush', 25000.00),
(1, 2, 'Lightning Bolt', 'Instant', 'R', 1, 'Lightning Bolt deals 3 damage to any target.', 'R', 'R', FALSE, 'Christopher Moeller', 5.00),
(1, 3, 'Serra Angel', 'Creature — Angel', '3WW', 5, 'Flying, vigilance', 'W', 'W', FALSE, 'Douglas Shuler', 15.00);
