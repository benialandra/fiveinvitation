const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, 'migration_map.json');
const mappings = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

let sql = `-- ==========================================
-- THEME RENAME STANDARDIZATION MIGRATION
-- Generated Automatically
-- ==========================================

BEGIN;

-- 1. Update themes table IDs
`;

mappings.forEach(m => {
  sql += `UPDATE public.themes SET id = '${m.newId}' WHERE id = '${m.oldId}';\n`;
});

sql += `\n-- 2. Update orders table references\n`;

mappings.forEach(m => {
  sql += `UPDATE public.orders SET theme_id = '${m.newId}' WHERE theme_id = '${m.oldId}';\n`;
});

sql += `\nCOMMIT;\n`;

fs.writeFileSync(path.join(__dirname, '..', 'supabase_theme_migration.sql'), sql);
console.log("SQL Migration generated successfully.");
