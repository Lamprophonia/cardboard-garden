-- =============================================================================
-- HYBRID ARCHITECTURE: CROSS-DATABASE VIEWS AND QUERIES
-- Views that work across the shared and game-specific databases
-- =============================================================================

USE tcg_shared;

-- View for user collection summary across all games
CREATE VIEW user_collection_summary AS
SELECT 
    u.id AS user_id,
    u.username,
    g.name AS game_name,
    COUNT(c.id) AS total_cards,
    SUM(c.quantity) AS total_quantity,
    AVG(c.purchase_price) AS avg_purchase_price,
    SUM(c.purchase_price * c.quantity) AS total_purchase_value
FROM users u
JOIN collection c ON u.id = c.user_id
JOIN games g ON c.game_id = g.id
GROUP BY u.id, u.username, g.id, g.name;

-- View for user wishlist summary
CREATE VIEW user_wishlist_summary AS
SELECT 
    u.id AS user_id,
    u.username,
    g.name AS game_name,
    COUNT(w.id) AS wishlist_count,
    AVG(w.max_price) AS avg_max_price,
    SUM(w.max_price) AS total_max_budget
FROM users u
JOIN wishlist w ON u.id = w.user_id
JOIN games g ON w.game_id = g.id
GROUP BY u.id, u.username, g.id, g.name;

-- Example stored procedure to get card details across databases
DELIMITER //
CREATE PROCEDURE GetCardDetails(
    IN p_game_id INT,
    IN p_card_id INT
)
BEGIN
    DECLARE db_name VARCHAR(50);
    DECLARE sql_query TEXT;
    
    -- Get the database name for the game
    SELECT database_name INTO db_name 
    FROM games 
    WHERE id = p_game_id;
    
    -- Build dynamic query based on game
    CASE p_game_id
        WHEN 1 THEN -- Pokémon
            SET sql_query = CONCAT('
                SELECT 
                    c.id, c.name, c.card_number, c.card_type,
                    c.hp, pt.name as pokemon_type, c.retreat_cost,
                    c.market_price, s.name as set_name
                FROM ', db_name, '.cards c
                LEFT JOIN ', db_name, '.sets s ON c.set_id = s.id
                LEFT JOIN ', db_name, '.pokemon_types pt ON c.pokemon_type_id = pt.id
                WHERE c.id = ', p_card_id);
                
        WHEN 2 THEN -- Magic
            SET sql_query = CONCAT('
                SELECT 
                    c.id, c.name, c.card_number, c.card_type,
                    c.mana_cost, c.power, c.toughness,
                    c.market_price, s.name as set_name
                FROM ', db_name, '.cards c
                LEFT JOIN ', db_name, '.sets s ON c.set_id = s.id
                WHERE c.id = ', p_card_id);
                
        WHEN 4 THEN -- Lorcana
            SET sql_query = CONCAT('
                SELECT 
                    c.id, c.name, c.card_number, c.card_type,
                    c.ink_cost, c.strength, c.willpower, c.lore_value,
                    ic.name as ink_color, f.name as franchise,
                    c.market_price, s.name as set_name
                FROM ', db_name, '.cards c
                LEFT JOIN ', db_name, '.sets s ON c.set_id = s.id
                LEFT JOIN ', db_name, '.ink_colors ic ON c.ink_color_id = ic.id
                LEFT JOIN ', db_name, '.franchises f ON c.franchise_id = f.id
                WHERE c.id = ', p_card_id);
    END CASE;
    
    -- Execute the dynamic query
    SET @sql = sql_query;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
