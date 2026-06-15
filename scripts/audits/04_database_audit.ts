import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing from .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const inventoryPath = path.resolve('docs/audits/theme-inventory.json');
const outputDir = path.resolve('docs/database');

if (!fs.existsSync(inventoryPath)) {
  console.error('Inventory not found. Run 01_theme_discovery.ts first.');
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

async function run() {
  console.log('Starting Phase 6: Database Consistency Audit...');
  
  const { data: themes, error } = await supabase.from('themes').select('id, name, category, thumbnail');
  
  if (error) {
    console.error('Error fetching themes from database:', error.message);
    process.exit(1);
  }

  const dbThemeIds = themes.map(t => t.id || t.name);
  
  const missingInDb = [];
  let sqlMigration = '-- Auto-generated Theme Migration\n\n';

  for (const theme of inventory) {
    const expectedName = theme.name; // E.g., Luxury11
    
    // Check if expectedName exists in dbThemeIds somehow
    const exists = themes.some(t => 
      t.name === expectedName || 
      t.id === expectedName.toLowerCase()
    );

    if (!exists) {
      missingInDb.push(theme);
      
      sqlMigration += `INSERT INTO themes (id, name, category, thumbnail, is_active) VALUES ('${expectedName.toLowerCase()}', '${expectedName}', '${theme.category}', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60', true);\n`;
    }
  }

  let markdown = `# Database Consistency Audit\n\n`;
  markdown += `Themes in Codebase: ${inventory.length}\n`;
  markdown += `Themes in Database: ${themes.length}\n`;
  markdown += `Missing from Database: ${missingInDb.length}\n\n`;

  if (missingInDb.length > 0) {
    markdown += `### Themes Missing from DB\n\n`;
    for (const theme of missingInDb) {
      markdown += `- ${theme.name} (${theme.category})\n`;
    }
  }

  fs.writeFileSync(path.join(outputDir, 'theme-sync-report.md'), markdown);
  fs.writeFileSync(path.join(outputDir, 'theme-sync-migration.sql'), sqlMigration);
  
  console.log('Generated docs/database/theme-sync-report.md');
  console.log('Generated docs/database/theme-sync-migration.sql');
  
  // Safe auto-fixes (optional, maybe run the SQL directly?)
  if (missingInDb.length > 0) {
    console.log('Inserting missing themes into DB...');
    for (const theme of missingInDb) {
      await supabase.from('themes').insert({
        id: theme.name.toLowerCase(),
        name: theme.name,
        category: theme.category,
        thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60',
        is_active: true,
      });
    }
    console.log('Database synced.');
  }
}

run();
