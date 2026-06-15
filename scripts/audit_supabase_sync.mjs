import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const registryPath = path.join(rootDir, 'src', 'themes', 'registry.tsx');

async function audit() {
  try {
    // 1. Fetch from Supabase
    const res = await fetch('http://localhost:3000/api/themes?limit=1000');
    const dbThemes = await res.json();

    // 2. Parse Registry
    const registryContent = fs.readFileSync(registryPath, 'utf8');
    const registryThemes = new Map(); // id -> { name, thumbnail }
    const blockRegex = /\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?thumbnail:\s*['"]([^'"]+)['"][\s\S]*?component:\s*([A-Za-z0-9_]+)[\s\S]*?\}/g;
    let match;
    while ((match = blockRegex.exec(registryContent)) !== null) {
      registryThemes.set(match[1], {
        name: match[2],
        thumbnail: match[3],
        component: match[4]
      });
    }

    // 3. Compare
    const report = {
      missingRecords: [], // In registry but not in DB
      orphanRecords: [],  // In DB but not in registry
      duplicateRecords: [], // Multiple DB entries for same ID
      nameMismatches: [], // Name or thumbnail diff
    };

    const dbMap = new Map();
    dbThemes.forEach(t => {
      const id = t.id || t.theme_id; // Try both standard ID fields
      if (!id) return;
      
      if (dbMap.has(id)) {
        report.duplicateRecords.push(`Duplicate DB record for ID: ${id}`);
      } else {
        dbMap.set(id, t);
      }
    });

    // Check Missing & Mismatches
    for (const [id, regTheme] of registryThemes.entries()) {
      const dbTheme = dbMap.get(id);
      if (!dbTheme) {
        report.missingRecords.push(`Registry ID '${id}' (${regTheme.name}) is missing from Database.`);
      } else {
        const dbName = dbTheme.name || dbTheme.title;
        if (dbName && dbName !== regTheme.name) {
           report.nameMismatches.push(`ID '${id}': Registry Name = "${regTheme.name}", DB Name = "${dbName}"`);
        }
        
        const dbThumb = dbTheme.thumbnail || dbTheme.thumbnail_url || dbTheme.image_url;
        if (dbThumb && dbThumb !== regTheme.thumbnail && !regTheme.thumbnail.includes('unsplash')) {
           report.nameMismatches.push(`ID '${id}': Thumbnail mismatch.`);
        }
      }
    }

    // Check Orphans
    for (const [id, dbTheme] of dbMap.entries()) {
      if (!registryThemes.has(id)) {
        const dbName = dbTheme.name || dbTheme.title;
        report.orphanRecords.push(`Database ID '${id}' (${dbName}) is not in Registry.`);
      }
    }

    // 4. Generate Markdown
    let md = `# Theme Database Sync Audit Report
Generated: ${new Date().toISOString()}

## Summary
- **Registry Count**: ${registryThemes.size}
- **Database Count**: ${dbThemes.length}

## ❌ Missing Records (In Registry, Not in DB)
${report.missingRecords.length ? report.missingRecords.map(t => '- ' + t).join('\n') : '- *None*'}

## 👻 Orphan Records (In DB, Not in Registry)
${report.orphanRecords.length ? report.orphanRecords.map(t => '- ' + t).join('\n') : '- *None*'}

## ⚠️ Name / Thumbnail Mismatches
${report.nameMismatches.length ? report.nameMismatches.map(t => '- ' + t).join('\n') : '- *None*'}

## 🗂️ Duplicate Records in DB
${report.duplicateRecords.length ? report.duplicateRecords.map(t => '- ' + t).join('\n') : '- *None*'}
`;

    const outDir = path.join(rootDir, 'docs', 'database');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'theme-sync-audit.md'), md);
    console.log("Audit complete. docs/database/theme-sync-audit.md generated.");
  } catch (err) {
    console.error(err);
  }
}

audit();
