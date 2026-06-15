import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const registryPath = path.join(rootDir, 'src', 'themes', 'registry.tsx');

function generateSql() {
  try {
    const registryContent = fs.readFileSync(registryPath, 'utf8');
    
    // Regex matches the fields inside THEME_REGISTRY
    const blockRegex = /\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?category:\s*['"]([^'"]+)['"][\s\S]*?price:\s*([0-9]+)[\s\S]*?thumbnail:\s*['"]([^'"]+)['"][\s\S]*?\}/g;
    let match;
    const uniqueThemes = new Map();
    while ((match = blockRegex.exec(registryContent)) !== null) {
      const id = match[1];
      if (!uniqueThemes.has(id)) {
        uniqueThemes.set(id, {
          id: id,
          name: match[2],
          category: match[3],
          price: parseInt(match[4], 10),
          thumbnail: match[5]
        });
      }
    }
    const themesToSeed = Array.from(uniqueThemes.values());

    if (themesToSeed.length === 0) {
      throw new Error("No themes parsed from registry.tsx.");
    }

    let sql = `-- Theme Synchronization Script\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- Instructions: Copy and paste this script into the Supabase SQL Editor and hit 'Run'\n\n`;
    
    const statements = themesToSeed.map(t => {
      const name = t.name.replace(/'/g, "''");
      const thumb = t.thumbnail.replace(/'/g, "''");
      return `INSERT INTO themes (id, name, category, price, thumbnail)\nVALUES ('${t.id}', '${name}', '${t.category}', ${t.price}, '${thumb}')\nON CONFLICT (id) DO UPDATE SET\n  name = EXCLUDED.name,\n  category = EXCLUDED.category,\n  price = EXCLUDED.price,\n  thumbnail = EXCLUDED.thumbnail;`;
    });
    
    sql += statements.join('\n\n');

    const outDir = path.join(rootDir, 'docs', 'database');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    
    const sqlPath = path.join(outDir, 'sync_themes.sql');
    fs.writeFileSync(sqlPath, sql);
    console.log(`✅ Generated SQL script at ${sqlPath} for ${themesToSeed.length} themes.`);
  } catch (err) {
    console.error("❌ SQL Generation Error:", err.message);
  }
}

generateSql();
