-- Database Configuration and Optimization
-- This script sets up database-level configurations for performance and reliability

-- =============================================================================
-- DATABASE CONFIGURATION SETTINGS
-- =============================================================================

-- Set charset and collation for consistency
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================================================
-- PERFORMANCE OPTIMIZATIONS
-- =============================================================================

-- Create indexes for better query performance (run after data is loaded)

-- Shared database indexes
USE tcg_shared;

-- Composite indexes for common query patterns
CREATE INDEX idx_collection_user_game ON collection(user_id, game_id);
CREATE INDEX idx_collection_game_card ON collection(game_id, external_card_id);
CREATE INDEX idx_collection_user_purchase_date ON collection(user_id, purchase_date);
CREATE INDEX idx_wishlist_user_game ON wishlist(user_id, game_id);
CREATE INDEX idx_wishlist_priority_price ON wishlist(priority, max_price);

-- Full-text search indexes for card names (if needed)
-- ALTER TABLE tcg_pokemon.cards ADD FULLTEXT(name, description);
-- ALTER TABLE tcg_magic.cards ADD FULLTEXT(name, oracle_text);
-- ALTER TABLE tcg_yugioh.cards ADD FULLTEXT(name, effect_text);
-- ALTER TABLE tcg_lorcana.cards ADD FULLTEXT(name, rules_text);

-- =============================================================================
-- MAINTENANCE PROCEDURES
-- =============================================================================

USE tcg_shared;

-- Procedure to update market prices (example)
DELIMITER //
CREATE PROCEDURE UpdateMarketPrices()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE game_name VARCHAR(100);
    DECLARE game_db VARCHAR(50);
    DECLARE sql_stmt TEXT;
    
    DECLARE game_cursor CURSOR FOR 
        SELECT name, database_name FROM games WHERE database_name IS NOT NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    START TRANSACTION;
    
    OPEN game_cursor;
    game_loop: LOOP
        FETCH game_cursor INTO game_name, game_db;
        IF done THEN
            LEAVE game_loop;
        END IF;
        
        -- Example: Update prices (you'd integrate with actual price APIs)
        SET sql_stmt = CONCAT('UPDATE ', game_db, '.cards SET market_price = market_price * 1.02 WHERE market_price > 0');
        SET @sql = sql_stmt;
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
    END LOOP;
    CLOSE game_cursor;
    
    COMMIT;
    
    SELECT 'Market prices updated successfully' AS result;
END //
DELIMITER ;

-- Procedure to clean up old wishlist items
DELIMITER //
CREATE PROCEDURE CleanupOldWishlistItems(IN days_old INT)
BEGIN
    DELETE FROM wishlist 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL days_old DAY)
    AND priority = 1; -- Only clean up low priority items
    
    SELECT ROW_COUNT() AS items_cleaned;
END //
DELIMITER ;

-- Procedure to get collection statistics
DELIMITER //
CREATE PROCEDURE GetCollectionStats(IN user_id_param INT)
BEGIN
    SELECT 
        g.name AS game,
        COUNT(c.id) AS total_cards,
        SUM(c.quantity) AS total_quantity,
        AVG(c.purchase_price) AS avg_purchase_price,
        SUM(c.purchase_price * c.quantity) AS total_invested,
        MIN(c.purchase_date) AS first_purchase,
        MAX(c.purchase_date) AS latest_purchase
    FROM collection c
    JOIN games g ON c.game_id = g.id
    WHERE c.user_id = user_id_param
    GROUP BY g.id, g.name
    ORDER BY total_invested DESC;
END //
DELIMITER ;

SELECT 'Performance optimizations and maintenance procedures created!' AS message;
