-- Master setup script for Hybrid Architecture
-- This script sets up all databases in the correct order

-- Execute all setup scripts
SOURCE hybrid_01_shared_database.sql;
SOURCE hybrid_02_pokemon_database.sql;
SOURCE hybrid_03_yugioh_database.sql;
SOURCE hybrid_03_magic_database.sql;
SOURCE hybrid_04_lorcana_database.sql;
SOURCE hybrid_05_cross_database_queries.sql;
SOURCE hybrid_06_sample_data_and_tests.sql;

-- Display completion message
SELECT 'Hybrid TCG Card Collection Manager setup completed successfully!' AS message;
SELECT 'Databases created: tcg_shared, tcg_pokemon, tcg_yugioh, tcg_magic, tcg_lorcana' AS databases;
SELECT 'Sample users and collections added for testing' AS sample_data;
