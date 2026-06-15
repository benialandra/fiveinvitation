# Database Sync Plan

The local codebase only contains 6 themes. The database 'themes' table likely still contains all 120 legacy themes.

- KEEP: Luxury01, Floral01, Minimal01, Islamic01, Dark01, CinematicTheme
- UPDATE: Map old order `theme_id`s to the new core themes (e.g., Luxury05 -> Luxury01).
- DELETE: Remove the 114 obsolete themes from the Supabase 'themes' table.

A migration script has been generated at `docs/database/theme-cleanup-migration.sql`.