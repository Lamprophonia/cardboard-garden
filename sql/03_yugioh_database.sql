-- =============================================================================
-- YU-GI-OH-SPECIFIC DATABASE: tcg_yugioh
-- Optimized schema specifically for Yu-Gi-Oh!
-- =============================================================================

CREATE DATABASE IF NOT EXISTS tcg_yugioh
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tcg_yugioh;

-- Yu-Gi-Oh-specific rarities
CREATE TABLE rarities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    symbol VARCHAR(10),
    color VARCHAR(7),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Yu-Gi-Oh sets
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

-- Monster attributes (LIGHT, DARK, FIRE, etc.)
CREATE TABLE attributes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    color_hex VARCHAR(7) NOT NULL
);

-- Monster types (Dragon, Warrior, Spellcaster, etc.)
CREATE TABLE monster_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Yu-Gi-Oh cards with game-specific fields
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    set_id INT NOT NULL,
    rarity_id INT,
    name VARCHAR(200) NOT NULL,
    card_number VARCHAR(20),
    card_type ENUM('Monster', 'Spell', 'Trap') NOT NULL,
    
    -- Monster-specific attributes
    monster_type_id INT, -- Dragon, Warrior, etc.
    attribute_id INT, -- LIGHT, DARK, etc.
    level INT, -- 1-12 for normal monsters
    rank INT, -- For Xyz monsters
    attack INT, -- ATK points
    defense INT, -- DEF points
    scale_left INT, -- Pendulum scale (left)
    scale_right INT, -- Pendulum scale (right)
    link_rating INT, -- Link monster rating
    link_arrows JSON, -- Array of link directions
    
    -- Spell/Trap specific
    spell_trap_type ENUM('Normal', 'Quick-Play', 'Continuous', 'Equip', 'Field', 'Ritual', 'Counter') DEFAULT 'Normal',
    
    -- Monster categories
    is_effect BOOLEAN DEFAULT FALSE,
    is_normal BOOLEAN DEFAULT FALSE,
    is_fusion BOOLEAN DEFAULT FALSE,
    is_synchro BOOLEAN DEFAULT FALSE,
    is_xyz BOOLEAN DEFAULT FALSE,
    is_pendulum BOOLEAN DEFAULT FALSE,
    is_link BOOLEAN DEFAULT FALSE,
    is_ritual BOOLEAN DEFAULT FALSE,
    is_tuner BOOLEAN DEFAULT FALSE,
    
    -- Card text
    effect_text TEXT,
    flavor_text TEXT,
    pendulum_effect TEXT, -- For pendulum monsters
    
    -- Common fields
    artist VARCHAR(100),
    image_url VARCHAR(500),
    market_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE,
    FOREIGN KEY (rarity_id) REFERENCES rarities(id) ON DELETE SET NULL,
    FOREIGN KEY (monster_type_id) REFERENCES monster_types(id) ON DELETE SET NULL,
    FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE SET NULL,
    
    INDEX idx_set_id (set_id),
    INDEX idx_rarity_id (rarity_id),
    INDEX idx_name (name),
    INDEX idx_card_type (card_type),
    INDEX idx_level (level),
    INDEX idx_attack (attack),
    INDEX idx_defense (defense),
    INDEX idx_attribute (attribute_id),
    INDEX idx_monster_type (monster_type_id)
);

-- Insert attributes
INSERT INTO attributes (name, color_hex) VALUES
('LIGHT', '#FFFF99'),
('DARK', '#663399'),
('FIRE', '#FF6666'),
('WATER', '#6666FF'),
('EARTH', '#CC9966'),
('WIND', '#66CC66'),
('DIVINE', '#FFD700');

-- Insert monster types
INSERT INTO monster_types (name) VALUES
('Dragon'), ('Warrior'), ('Spellcaster'), ('Beast'), ('Machine'),
('Fiend'), ('Fairy'), ('Zombie'), ('Aqua'), ('Rock'),
('Thunder'), ('Plant'), ('Insect'), ('Dinosaur'), ('Sea Serpent'),
('Reptile'), ('Psychic'), ('Divine-Beast'), ('Creator God'),
('Winged Beast'), ('Beast-Warrior'), ('Fish'), ('Wyrm'), ('Cyberse');

-- Insert rarities
INSERT INTO rarities (name, symbol, color, sort_order) VALUES
('Common', 'C', '#000000', 1),
('Rare', 'R', '#C0C0C0', 2),
('Super Rare', 'SR', '#FFD700', 3),
('Ultra Rare', 'UR', '#FF6347', 4),
('Secret Rare', 'ScR', '#8A2BE2', 5),
('Ultimate Rare', 'UtR', '#FF1493', 6);

-- Insert sample sets
INSERT INTO sets (name, code, release_date, total_cards, description) VALUES
('Legend of Blue Eyes White Dragon', 'LOB', '2002-03-08', 126, 'The first Yu-Gi-Oh! TCG booster pack'),
('Metal Raiders', 'MRD', '2002-06-26', 82, 'The second Yu-Gi-Oh! TCG booster pack');

-- Insert sample cards
INSERT INTO cards (set_id, rarity_id, name, card_number, card_type, monster_type_id, attribute_id, level, attack, defense, effect_text, flavor_text, artist, market_price, is_normal) VALUES
(1, 4, 'Blue-Eyes White Dragon', '001', 'Monster', 1, 1, 8, 3000, 2500, NULL, 
 'This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.', 
 'Kazuki Takahashi', 15.00, TRUE),
(1, 1, 'Mystical Space Typhoon', '045', 'Spell', NULL, NULL, NULL, NULL, NULL, 'Target 1 Spell/Trap on the field; destroy it.', NULL, 'Kazuki Takahashi', 1.50, FALSE);
