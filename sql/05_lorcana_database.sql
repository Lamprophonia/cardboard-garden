-- =============================================================================
-- LORCANA-SPECIFIC DATABASE: tcg_lorcana
-- Optimized schema specifically for Disney Lorcana
-- =============================================================================

CREATE DATABASE IF NOT EXISTS tcg_lorcana
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tcg_lorcana;

-- Lorcana-specific rarities
CREATE TABLE rarities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    symbol VARCHAR(10),
    color VARCHAR(7),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lorcana sets
CREATE TABLE sets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) UNIQUE,
    release_date DATE,
    total_cards INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
);

-- Ink colors
CREATE TABLE ink_colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    color_hex VARCHAR(7) NOT NULL
);

-- Disney franchises
CREATE TABLE franchises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Lorcana cards with game-specific fields
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    set_id INT NOT NULL,
    rarity_id INT,
    name VARCHAR(200) NOT NULL,
    card_number VARCHAR(20),
    card_type ENUM('Character', 'Action', 'Item', 'Location') NOT NULL,
    subtype VARCHAR(100), -- Hero, Villain, Ally, Song, etc.
    
    -- Lorcana-specific attributes
    ink_cost INT NOT NULL,
    ink_color_id INT NOT NULL,
    
    -- Character-specific attributes
    strength INT, -- Combat strength
    willpower INT, -- Health/durability  
    lore_value INT, -- Points when questing
    character_version VARCHAR(100), -- "Snow Queen", "Brave Little Tailor"
    franchise_id INT,
    
    -- Special mechanics
    shift_cost INT, -- Cost to shift onto another character
    inkwell BOOLEAN DEFAULT FALSE, -- Can be used as ink
    
    -- Abilities and keywords stored as JSON for flexibility
    abilities JSON, -- [{"name": "Deep Freeze", "cost": 1, "effect": "..."}]
    keywords JSON, -- ["Ward", "Rush", "Shift"]
    
    -- Card text
    rules_text TEXT,
    flavor_text TEXT,
    quest_ability TEXT, -- Special ability when questing
    challenge_ability TEXT, -- Special ability when challenging
    
    -- Common fields
    artist VARCHAR(100),
    image_url VARCHAR(500),
    market_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE,
    FOREIGN KEY (rarity_id) REFERENCES rarities(id) ON DELETE SET NULL,
    FOREIGN KEY (ink_color_id) REFERENCES ink_colors(id) ON DELETE RESTRICT,
    FOREIGN KEY (franchise_id) REFERENCES franchises(id) ON DELETE SET NULL,
    
    INDEX idx_set_id (set_id),
    INDEX idx_rarity_id (rarity_id),
    INDEX idx_name (name),
    INDEX idx_card_type (card_type),
    INDEX idx_ink_cost (ink_cost),
    INDEX idx_ink_color (ink_color_id),
    INDEX idx_strength (strength),
    INDEX idx_lore_value (lore_value),
    INDEX idx_franchise (franchise_id)
);

-- Insert ink colors
INSERT INTO ink_colors (name, color_hex) VALUES
('Amber', '#FFBF00'),
('Amethyst', '#9966CC'),
('Emerald', '#50C878'),
('Ruby', '#E0115F'),
('Sapphire', '#0F52BA'),
('Steel', '#71797E');

-- Insert franchises
INSERT INTO franchises (name, description) VALUES
('Mickey Mouse & Friends', 'Classic Disney characters including Mickey, Minnie, Donald, Goofy'),
('Frozen', 'Characters from the Frozen movies'),
('The Lion King', 'Characters from The Lion King'),
('Beauty and the Beast', 'Characters from Beauty and the Beast'),
('Aladdin', 'Characters from Aladdin'),
('The Little Mermaid', 'Characters from The Little Mermaid'),
('Tangled', 'Characters from Tangled'),
('Moana', 'Characters from Moana');

-- Insert rarities
INSERT INTO rarities (name, symbol, color, sort_order) VALUES
('Common', 'C', '#000000', 1),
('Uncommon', 'U', '#C0C0C0', 2),
('Rare', 'R', '#FFD700', 3),
('Super Rare', 'SR', '#FF6B35', 4),
('Legendary', 'L', '#8A2BE2', 5),
('Enchanted', 'E', '#FF1493', 6);

-- Insert sample sets
INSERT INTO sets (name, code, release_date, total_cards, description) VALUES
('The First Chapter', 'TFC', '2023-08-18', 204, 'The inaugural Disney Lorcana set'),
('Rise of the Floodborn', 'ROF', '2023-11-17', 204, 'The second Disney Lorcana set');

-- Insert sample cards
INSERT INTO cards (set_id, rarity_id, name, card_number, card_type, subtype, ink_cost, ink_color_id, strength, willpower, lore_value, character_version, franchise_id, inkwell, abilities, flavor_text, artist, market_price) VALUES
(1, 3, 'Mickey Mouse - Brave Little Tailor', '001', 'Character', 'Hero', 2, 4, 1, 3, 2, 'Brave Little Tailor', 1, TRUE, NULL, '"I\'ll show that giant what-for!"', 'Grace Tran', 45.00),
(1, 5, 'Elsa - Snow Queen', '004', 'Character', 'Queen Sorcerer', 8, 5, 4, 6, 2, 'Snow Queen', 2, TRUE, 
 '[{"name": "Deep Freeze", "cost": 1, "effect": "Exert chosen character. They can\'t ready at the start of their next turn."}]',
 '"My power flurries through the air into the ground."', 'Nicholas Kole', 75.00),
(2, 4, 'Be Prepared', '087', 'Action', 'Song', 3, 3, NULL, NULL, NULL, NULL, 3, FALSE, NULL,
 '"It\'s great that we\'ll soon be connected with a king who\'ll be all-time adored."', 'Jenna Gray', 12.00);
