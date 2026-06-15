-- =========================================================================
-- THEME CLEANUP MIGRATION
-- This script safely removes obsolete theme records from the database
-- to synchronize the DB with the newly reduced codebase (6 core themes).
-- =========================================================================

-- 1. Identify obsolete themes
-- The following themes are RETAINED:
-- 'Luxury01', 'Floral01', 'Minimal01', 'Islamic01', 'Dark01', 'CinematicTheme'
-- All other themes are OBSOLETE.

-- Start Transaction to ensure data integrity
START TRANSACTION;

-- Optional: If you want to soft-delete (assuming there's an is_active column)
-- UPDATE themes SET is_active = 0 WHERE theme_name NOT IN ('Luxury01', 'Floral01', 'Minimal01', 'Islamic01', 'Dark01', 'CinematicTheme');

-- Or Hard Delete (Recommended for complete cleanup if no foreign keys depend on them)
DELETE FROM themes 
WHERE name NOT IN ('Luxury01', 'Floral01', 'Minimal01', 'Islamic01', 'Dark01', 'CinematicTheme');

-- Note: Ensure that the 'orders' or 'users' tables do not have strict foreign key constraints 
-- tying them to the deleted themes without cascading rules, or update existing orders to fallback themes first.

-- Example Fallback Update (if required):
-- UPDATE orders SET theme_id = (SELECT id FROM themes WHERE name = 'Luxury01') 
-- WHERE theme_id NOT IN (SELECT id FROM themes WHERE name IN ('Luxury01', 'Floral01', 'Minimal01', 'Islamic01', 'Dark01', 'CinematicTheme'));

COMMIT;
