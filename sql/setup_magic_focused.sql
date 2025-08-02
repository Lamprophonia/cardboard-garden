-- Cardboard Garden - Magic-Focused Database Setup Script
-- This script sets up a Magic: The Gathering focused collection system

-- ⚠️  SECURITY WARNING ⚠️ 
-- BEFORE RUNNING: Change all default passwords in 00_security_setup.sql
-- This setup uses demonstration passwords that MUST be changed for production use

-- =============================================================================
-- MAGIC-FOCUSED SETUP EXECUTION ORDER
-- =============================================================================

-- Phase 1: Security and User Management
SOURCE 00_security_setup.sql;

-- Phase 2: Shared Infrastructure
SOURCE 01_shared_database.sql;

-- Phase 3: Magic: The Gathering Database
SOURCE 04_magic_database.sql;

-- Phase 4: Scryfall API Integration
SOURCE 10_magic_api_integration.sql;

-- Phase 5: Performance and Maintenance
SOURCE 08_performance_optimization.sql;
SOURCE 09_backup_monitoring.sql;

-- Phase 6: Sample Data (Magic-focused)
SOURCE 07_sample_data_and_tests.sql;

-- =============================================================================
-- SETUP COMPLETION
-- =============================================================================

SELECT '🌱 Cardboard Garden (Magic Focus) setup completed successfully!' AS message;
SELECT 'Databases: tcg_shared, tcg_magic' AS databases_created;
SELECT 'Users: tcg_app, tcg_readonly, tcg_backup' AS users_created;
SELECT 'Scryfall API integration ready' AS api_integration;
SELECT '⚠️  REMEMBER: Change default passwords before production use!' AS security_reminder;
