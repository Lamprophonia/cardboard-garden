-- =============================================================================
-- DOUBLE-FACED CARD SUPPORT MIGRATION
-- Adds support for double-faced cards, transform cards, and other multi-faced layouts
-- =============================================================================

USE cardboard_garden;

-- Add layout column to store card layout type
ALTER TABLE cards 
ADD COLUMN layout VARCHAR(50) DEFAULT 'normal' AFTER type_line;

-- Add card_faces JSON column to store face data for multi-faced cards
ALTER TABLE cards 
ADD COLUMN card_faces JSON AFTER layout;

-- Add indexes for new columns
CREATE INDEX idx_layout ON cards (layout);

-- Update existing double-faced cards to have proper layout
UPDATE cards 
SET layout = 'double_faced_token' 
WHERE name LIKE '%//%' AND card_faces IS NULL;

-- Show results
SELECT 
    name, 
    layout, 
    CASE 
        WHEN card_faces IS NOT NULL THEN 'Has face data'
        ELSE 'No face data'
    END as face_status
FROM cards 
WHERE name LIKE '%//%' 
LIMIT 10;

-- Count cards by layout
SELECT 
    layout,
    COUNT(*) as count
FROM cards 
GROUP BY layout
ORDER BY count DESC;

-- =============================================================================
-- MIGRATION COMPLETE
-- Next steps:
-- 1. Re-import double-faced cards with face data from Scryfall
-- 2. Update API to serve face data
-- 3. Update frontend to display faces
-- =============================================================================
