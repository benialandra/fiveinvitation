import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..'); // FIXED: one level up to project root

const stats = {
  totalFiles: 0,
  themes: new Set(),
  components: new Set(),
  services: new Set(),
  hooks: new Set(),
  helpers: new Set(),
  docs: new Set(),
  folders: new Set(),
  unusedFolders: [],
  duplicateFolders: [],
};

const folderMap = new Map();

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const relativePath = path.relative(rootDir, fullPath);

    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.playwright-mcp', '.vite'].includes(file)) continue;
      
      stats.folders.add(relativePath);
      if (!folderMap.has(file)) folderMap.set(file, []);
      folderMap.get(file).push(relativePath);
      
      const children = fs.readdirSync(fullPath);
      if (children.length === 0) {
        stats.unusedFolders.push(relativePath);
      }
      
      scanDir(fullPath);
    } else {
      stats.totalFiles++;
      
      // Normalize slashes for matching
      const normPath = relativePath.replace(/\\/g, '/');
      
      if (normPath.startsWith('src/components')) {
        stats.components.add(normPath);
      } else if (normPath.startsWith('src/themes')) {
        if (ext === '.tsx' && file !== 'registry.tsx' && file !== 'ThemeComponent.tsx') {
           stats.themes.add(name);
        }
      } else if (normPath.startsWith('src/services') || normPath.startsWith('src/supabase')) {
        stats.services.add(normPath);
      } else if (normPath.startsWith('src/hooks')) {
        stats.hooks.add(normPath);
      } else if (normPath.startsWith('src/utils') || normPath.startsWith('src/helpers')) {
        stats.helpers.add(normPath);
      } else if (normPath.startsWith('docs/')) {
        stats.docs.add(normPath);
      }
    }
  }
}

scanDir(rootDir);

for (const [name, paths] of folderMap.entries()) {
  if (paths.length > 1 && !['assets', 'components', 'utils', 'hooks', 'types', 'src', 'public', 'scripts'].includes(name.toLowerCase())) {
     stats.duplicateFolders.push({ name, paths });
  }
}

const report = `# Project Inventory & Audit
Generated: ${new Date().toISOString()}

## Overview
- **Total Files**: ${stats.totalFiles}
- **Total Folders**: ${stats.folders.size}

## Core Counts
- **Total Themes**: ${stats.themes.size}
- **Total Components**: ${stats.components.size}
- **Total Services / Supabase**: ${stats.services.size}
- **Total Hooks**: ${stats.hooks.size}
- **Total Helpers**: ${stats.helpers.size}
- **Total Docs**: ${stats.docs.size}

## Folder Analysis
### Potential Duplicate Folders
${stats.duplicateFolders.length === 0 ? "None detected." : stats.duplicateFolders.map(d => `- \`${d.name}\` found in:\n` + d.paths.map(p => `  - ${p}`).join('\n')).join('\n')}

### Unused / Empty Folders
${stats.unusedFolders.length === 0 ? "None detected." : stats.unusedFolders.map(f => `- \`${f}\``).join('\n')}

## Supabase Integration
Files interacting with Supabase:
${Array.from(stats.services).map(f => `- \`${f}\``).join('\n')}

## Themes List (${stats.themes.size})
\`\`\`text
${Array.from(stats.themes).sort().join(', ')}
\`\`\`
`;

const outDir = path.join(rootDir, 'docs', 'audits');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'project-inventory.md'), report);

console.log("Inventory generated successfully!");
