-- =============================================================================
-- POKEMON-SPECIFIC DATABASE: tcg_pokemon
-- Optimized schema specifically for Pokémon TCG
-- =============================================================================

CREATE DATABASE IF NOT EXISTS tcg_pokemon
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tcg_pokemon;

-- Pokémon-specific rarities
CREATE TABLE rarities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    symbol VARCHAR(10),
    color VARCHAR(7), -- Hex color code
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pokémon sets
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

-- Pokémon types
CREATE TABLE pokemon_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7), -- Hex color for type
    symbol_url VARCHAR(200)
);

-- Pokémon cards with game-specific fields
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    set_id INT NOT NULL,
    rarity_id INT,
    name VARCHAR(200) NOT NULL,
    card_number VARCHAR(20),
    card_type ENUM('Pokémon', 'Trainer', 'Energy') NOT NULL,
    subtype VARCHAR(100), -- Item, Supporter, Stadium for Trainers
    
    -- Pokémon-specific attributes
    hp INT,
    pokemon_type_id INT, -- Primary type
    secondary_type_id INT, -- Secondary type (rare)
    weakness_type_id INT,
    weakness_amount VARCHAR(10), -- x2, +10, etc.
    resistance_type_id INT,
    resistance_amount VARCHAR(10), -- -20, -30, etc.
    retreat_cost INT,
    evolves_from VARCHAR(100),
    evolution_stage ENUM('Basic', 'Stage 1', 'Stage 2', 'BREAK', 'GX', 'V', 'VMAX', 'ex'),
    
    -- Attack information stored as JSON for flexibility
    attacks JSON, -- [{"name": "Fire Spin", "cost": ["Fire", "Fire", "Fire", "Fire"], "damage": "100", "effect": "..."}]
    ability_name VARCHAR(100),
    ability_text TEXT,
    
    -- Common fields
    description TEXT,
    flavor_text TEXT,
    artist VARCHAR(100),
    image_url VARCHAR(500),
    market_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE,
    FOREIGN KEY (rarity_id) REFERENCES rarities(id) ON DELETE SET NULL,
    FOREIGN KEY (pokemon_type_id) REFERENCES pokemon_types(id) ON DELETE SET NULL,
    FOREIGN KEY (secondary_type_id) REFERENCES pokemon_types(id) ON DELETE SET NULL,
    FOREIGN KEY (weakness_type_id) REFERENCES pokemon_types(id) ON DELETE SET NULL,
    FOREIGN KEY (resistance_type_id) REFERENCES pokemon_types(id) ON DELETE SET NULL,
    
    INDEX idx_set_id (set_id),
    INDEX idx_rarity_id (rarity_id),
    INDEX idx_name (name),
    INDEX idx_card_number (card_number),
    INDEX idx_card_type (card_type),
    INDEX idx_pokemon_type (pokemon_type_id),
    INDEX idx_evolution_stage (evolution_stage)
);

-- Insert Pokémon types
INSERT INTO pokemon_types (name, color) VALUES
('Grass', '#78C850'),
('Fire', '#F08030'),
('Water', '#6890F0'),
('Lightning', '#F8D030'),
('Psychic', '#F85888'),
('Fighting', '#C03028'),
('Darkness', '#705848'),
('Metal', '#B8B8D0'),
('Fairy', '#EE99AC'),
('Dragon', '#7038F8'),
('Colorless', '#A8A878');

-- Insert rarities
INSERT INTO rarities (name, symbol, color, sort_order) VALUES
('Common', 'C', '#000000', 1),
('Uncommon', 'U', '#808080', 2),
('Rare', 'R', '#FFD700', 3),
('Rare Holo', 'RH', '#FF6B35', 4),
('Ultra Rare', 'UR', '#FF1493', 5),
('Secret Rare', 'SR', '#8A2BE2', 6);

-- Insert sample sets
INSERT INTO sets (name, code, release_date, total_cards, description) VALUES
('Base Set', 'BS', '1998-10-20', 102, 'The original Pokémon TCG set'),
('Team Rocket', 'TR', '2000-04-24', 83, 'The first themed expansion featuring Team Rocket');

-- Insert sample cards
INSERT INTO cards (set_id, rarity_id, name, card_number, card_type, subtype, hp, pokemon_type_id, weakness_type_id, weakness_amount, retreat_cost, evolution_stage, attacks, ability_name, ability_text, flavor_text, artist, market_price) VALUES
(1, 3, 'Charizard', '4', 'Pokémon', NULL, 120, 2, 3, 'x2', 3, 'Stage 2', 
 '[{"name": "Fire Spin", "cost": ["Fire", "Fire", "Fire", "Fire"], "damage": "100", "effect": "Discard 2 Energy cards attached to Charizard in order to use this attack."}]',
 NULL, NULL, 'Spits fire that is hot enough to melt boulders.', 'Mitsuhiro Arita', 350.00),
(1, 1, 'Energy Removal', '92', 'Trainer', 'Item', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
 'Choose 1 Energy card attached to 1 of your opponent\'s Pokémon and discard it.', 'Keiji Kinebuchi', 2.00);
