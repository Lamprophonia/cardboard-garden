-- =============================================================================
-- API INTEGRATION SCHEMA UPDATES
-- Adds fields needed for external API data synchronization
-- =============================================================================

-- Pokémon TCG API Integration Updates
USE tcg_pokemon;

ALTER TABLE cards 
ADD COLUMN tcgplayer_id VARCHAR(50) AFTER id,
ADD COLUMN pokemon_tcg_id VARCHAR(50) AFTER tcgplayer_id,
ADD COLUMN image_small VARCHAR(500) AFTER image_url,
ADD COLUMN image_large VARCHAR(500) AFTER image_small,
ADD COLUMN last_api_sync TIMESTAMP NULL,
ADD INDEX idx_pokemon_tcg_id (pokemon_tcg_id),
ADD INDEX idx_tcgplayer_id (tcgplayer_id);

-- Add pricing table for historical tracking
CREATE TABLE card_prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    price_source ENUM('tcgplayer', 'cardmarket', 'manual') NOT NULL,
    condition_name ENUM('Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged') NOT NULL,
    market_price DECIMAL(10,2),
    low_price DECIMAL(10,2),
    mid_price DECIMAL(10,2),
    high_price DECIMAL(10,2),
    price_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    INDEX idx_card_date (card_id, price_date),
    INDEX idx_source (price_source)
);

-- =============================================================================
-- Magic: The Gathering / Scryfall Integration Updates
-- =============================================================================

USE tcg_magic;

ALTER TABLE cards
ADD COLUMN scryfall_id VARCHAR(36) AFTER id, -- UUID format
ADD COLUMN oracle_id VARCHAR(36) AFTER scryfall_id,
ADD COLUMN tcgplayer_id INT AFTER oracle_id,
ADD COLUMN image_small VARCHAR(500) AFTER image_url,
ADD COLUMN image_normal VARCHAR(500) AFTER image_small,
ADD COLUMN image_large VARCHAR(500) AFTER image_normal,
ADD COLUMN last_api_sync TIMESTAMP NULL,
ADD INDEX idx_scryfall_id (scryfall_id),
ADD INDEX idx_oracle_id (oracle_id),
ADD INDEX idx_tcgplayer_id (tcgplayer_id);

-- Add Scryfall-specific pricing table
CREATE TABLE card_prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    price_source ENUM('tcgplayer', 'cardmarket', 'cardhoarder', 'scryfall') NOT NULL,
    price_type ENUM('usd', 'usd_foil', 'eur', 'tix') NOT NULL,
    price_value DECIMAL(10,2),
    price_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    INDEX idx_card_date (card_id, price_date),
    INDEX idx_source_type (price_source, price_type)
);

-- =============================================================================
-- Data Import Tracking
-- =============================================================================

-- Track API import jobs across all databases
USE tcg_shared;

CREATE TABLE api_sync_jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_type ENUM('pokemon', 'magic', 'yugioh', 'lorcana') NOT NULL,
    sync_type ENUM('full_import', 'update_sets', 'update_prices', 'update_cards') NOT NULL,
    api_source VARCHAR(50) NOT NULL, -- 'pokemontcg.io', 'scryfall', etc.
    status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
    records_processed INT DEFAULT 0,
    records_updated INT DEFAULT 0,
    records_created INT DEFAULT 0,
    error_message TEXT NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_game_type (game_type),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
