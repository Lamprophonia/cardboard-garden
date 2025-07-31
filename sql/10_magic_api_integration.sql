-- =============================================================================
-- MAGIC-FOCUSED API INTEGRATION UPDATES
-- Scryfall API integration for Magic: The Gathering only
-- =============================================================================

USE tcg_magic;

-- Add Scryfall-specific fields to existing cards table
ALTER TABLE cards
ADD COLUMN scryfall_id VARCHAR(36) AFTER id, -- UUID format
ADD COLUMN oracle_id VARCHAR(36) AFTER scryfall_id,
ADD COLUMN tcgplayer_id INT AFTER oracle_id,
ADD COLUMN cardmarket_id INT AFTER tcgplayer_id,
ADD COLUMN image_small VARCHAR(500) AFTER image_url,
ADD COLUMN image_normal VARCHAR(500) AFTER image_small,
ADD COLUMN image_large VARCHAR(500) AFTER image_normal,
ADD COLUMN image_png VARCHAR(500) AFTER image_large,
ADD COLUMN last_api_sync TIMESTAMP NULL,
ADD COLUMN scryfall_uri VARCHAR(500), -- Link back to Scryfall
ADD COLUMN rulings_uri VARCHAR(500), -- Scryfall rulings API endpoint
ADD INDEX idx_scryfall_id (scryfall_id),
ADD INDEX idx_oracle_id (oracle_id),
ADD INDEX idx_tcgplayer_id (tcgplayer_id);

-- Scryfall pricing table with full price tracking
CREATE TABLE card_prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    price_source ENUM('tcgplayer', 'cardmarket', 'cardhoarder') NOT NULL,
    price_type ENUM('usd', 'usd_foil', 'usd_etched', 'eur', 'eur_foil', 'tix') NOT NULL,
    price_value DECIMAL(10,2),
    price_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    UNIQUE KEY unique_card_source_type_date (card_id, price_source, price_type, price_date),
    INDEX idx_card_date (card_id, price_date),
    INDEX idx_source_type (price_source, price_type)
);

-- Card legalities (Standard, Modern, Legacy, etc.)
CREATE TABLE card_legalities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    format_name ENUM('standard', 'future', 'historic', 'gladiator', 'pioneer', 'explorer', 'modern', 'legacy', 'pauper', 'vintage', 'penny', 'commander', 'brawl', 'historicbrawl', 'alchemy', 'paupercommander', 'duel', 'oldschool', 'premodern') NOT NULL,
    legality ENUM('legal', 'not_legal', 'restricted', 'banned') NOT NULL,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    UNIQUE KEY unique_card_format (card_id, format_name),
    INDEX idx_format_legality (format_name, legality)
);

-- Card rulings from Scryfall
CREATE TABLE card_rulings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    oracle_id VARCHAR(36) NOT NULL,
    published_at DATE NOT NULL,
    ruling_text TEXT NOT NULL,
    source ENUM('wotc', 'scryfall') DEFAULT 'wotc',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    INDEX idx_card_id (card_id),
    INDEX idx_oracle_id (oracle_id),
    INDEX idx_published (published_at)
);

-- =============================================================================
-- Data Import Tracking (Magic-focused)
-- =============================================================================

USE tcg_shared;

CREATE TABLE scryfall_sync_jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sync_type ENUM('bulk_cards', 'sets', 'individual_card', 'prices', 'rulings') NOT NULL,
    scryfall_endpoint VARCHAR(200) NOT NULL, -- API endpoint used
    status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
    records_processed INT DEFAULT 0,
    records_updated INT DEFAULT 0,
    records_created INT DEFAULT 0,
    api_calls_made INT DEFAULT 0, -- Track API usage
    rate_limit_remaining INT, -- Track rate limits
    error_message TEXT NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sync_type (sync_type),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Store Scryfall bulk data download info
CREATE TABLE scryfall_bulk_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_type ENUM('oracle_cards', 'unique_artwork', 'default_cards', 'all_cards', 'rulings') NOT NULL,
    download_uri VARCHAR(500) NOT NULL,
    updated_at_scryfall TIMESTAMP NOT NULL, -- When Scryfall last updated this bulk data
    downloaded_at TIMESTAMP NULL, -- When we downloaded it
    processed_at TIMESTAMP NULL, -- When we finished processing it
    file_size_mb DECIMAL(8,2),
    total_objects INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_data_type (data_type),
    INDEX idx_updated_scryfall (updated_at_scryfall)
);
