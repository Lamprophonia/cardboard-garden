-- Cardboard Garden - Master Database Setup Script
-- This script orchestrates the complete database initialization

-- ⚠️  SECURITY WARNING ⚠️ 
-- BEFORE RUNNING: Change all default passwords in 00_security_setup.sql
-- This setup uses demonstration passwords that MUST be changed for production use

-- =============================================================================
-- SETUP EXECUTION ORDER
-- =============================================================================

-- Phase 1: Security and User Management
SOURCE 00_security_setup.sql;

-- Phase 2: Shared Infrastructure
SOURCE 01_shared_database.sql;

-- Phase 3: Game-Specific Databases
SOURCE 02_pokemon_database.sql;
SOURCE 03_magic_database.sql;
SOURCE 04_yugioh_database.sql;
SOURCE 05_lorcana_database.sql;

-- Phase 4: Integration and Testing
SOURCE 06_cross_database_queries.sql;
SOURCE 07_sample_data_and_tests.sql;

-- Phase 5: Performance and Maintenance
SOURCE 08_performance_optimization.sql;
SOURCE 09_backup_monitoring.sql;

-- =============================================================================
-- SETUP COMPLETION
-- =============================================================================

SELECT '🌱 Cardboard Garden setup completed successfully!' AS message;
SELECT 'Databases: tcg_shared, tcg_pokemon, tcg_magic, tcg_yugioh, tcg_lorcana' AS databases_created;
SELECT 'Users: tcg_app, tcg_readonly, tcg_backup' AS users_created;
SELECT 'Sample data and test queries added for all games' AS sample_data;
SELECT '⚠️  REMEMBER: Change default passwords before production use!' AS security_reminder;
