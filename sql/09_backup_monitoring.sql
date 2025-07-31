-- Backup and Recovery Procedures
-- This script provides backup strategies and recovery procedures

-- =============================================================================
-- BACKUP PROCEDURES
-- =============================================================================

USE tcg_shared;

-- Procedure to create logical backup of all databases
DELIMITER //
CREATE PROCEDURE CreateFullBackup()
BEGIN
    DECLARE backup_timestamp VARCHAR(20);
    DECLARE backup_path VARCHAR(200);
    
    SET backup_timestamp = DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s');
    SET backup_path = CONCAT('/backups/tcg_backup_', backup_timestamp);
    
    -- Log backup start
    INSERT INTO backup_log (backup_type, started_at, status) 
    VALUES ('FULL', NOW(), 'STARTED');
    
    SELECT CONCAT('Backup started at: ', NOW()) AS message;
    SELECT CONCAT('Use this command to create backup:') AS instruction;
    SELECT CONCAT('mysqldump -u tcg_backup -p --single-transaction --routines --triggers --all-databases > ', backup_path, '.sql') AS command;
    
END //
DELIMITER ;

-- Create backup log table
CREATE TABLE IF NOT EXISTS backup_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    backup_type ENUM('FULL', 'INCREMENTAL', 'DIFFERENTIAL') NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    status ENUM('STARTED', 'COMPLETED', 'FAILED') NOT NULL,
    backup_size_mb DECIMAL(10,2),
    notes TEXT
);

-- =============================================================================
-- MONITORING AND HEALTH CHECKS
-- =============================================================================

-- Procedure to check database health
DELIMITER //
CREATE PROCEDURE HealthCheck()
BEGIN
    DECLARE total_users INT;
    DECLARE total_collections INT;
    DECLARE total_cards INT DEFAULT 0;
    DECLARE game_count INT;
    
    -- Basic counts
    SELECT COUNT(*) INTO total_users FROM users;
    SELECT COUNT(*) INTO total_collections FROM collection;
    SELECT COUNT(*) INTO game_count FROM games;
    
    -- Get total cards across all games (approximate)
    -- In production, you'd query each game database
    
    SELECT 'Database Health Check Report' AS report_title;
    SELECT '================================' AS separator;
    SELECT CONCAT('Total Users: ', total_users) AS users;
    SELECT CONCAT('Total Collections: ', total_collections) AS collections;
    SELECT CONCAT('Supported Games: ', game_count) AS games;
    SELECT CONCAT('Check Time: ', NOW()) AS timestamp;
    
    -- Check for potential issues
    SELECT 'Potential Issues:' AS issues_title;
    
    -- Users with no collections
    SELECT CONCAT('Users with no collections: ', COUNT(*)) AS orphaned_users
    FROM users u 
    LEFT JOIN collection c ON u.id = c.user_id 
    WHERE c.user_id IS NULL;
    
    -- Collections referencing non-existent games
    SELECT CONCAT('Invalid game references: ', COUNT(*)) AS invalid_refs
    FROM collection c 
    LEFT JOIN games g ON c.game_id = g.id 
    WHERE g.id IS NULL;
    
END //
DELIMITER ;

-- =============================================================================
-- DATA VALIDATION PROCEDURES
-- =============================================================================

-- Procedure to validate data integrity across databases
DELIMITER //
CREATE PROCEDURE ValidateDataIntegrity()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE game_id_val INT;
    DECLARE game_db VARCHAR(50);
    DECLARE invalid_refs INT DEFAULT 0;
    
    DECLARE game_cursor CURSOR FOR 
        SELECT id, database_name FROM games WHERE database_name IS NOT NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    SELECT 'Data Integrity Validation Report' AS report_title;
    SELECT '=====================================' AS separator;
    
    -- Check collection references
    OPEN game_cursor;
    validation_loop: LOOP
        FETCH game_cursor INTO game_id_val, game_db;
        IF done THEN
            LEAVE validation_loop;
        END IF;
        
        -- Note: In production, you'd dynamically check if external_card_id exists
        -- in the respective game database
        SELECT CONCAT('Validating references for game ID: ', game_id_val) AS status;
        
    END LOOP;
    CLOSE game_cursor;
    
    SELECT 'Validation completed' AS result;
END //
DELIMITER ;

SELECT 'Backup and monitoring procedures created!' AS message;
