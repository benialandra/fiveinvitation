import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const themesDir = path.join(rootDir, 'src', 'themes');
const registryPath = path.join(themesDir, 'registry.tsx');

// Required sections based on theme-spec.md
const requiredSections = [
  { name: 'Hero', keywords: ['hero', 'header', 'beranda', 'home'] },
  { name: 'Bride & Groom', keywords: ['bride', 'groom', 'mempelai', 'pasangan'] },
  { name: 'Countdown', keywords: ['countdown', 'waktu', 'menuju'] },
  { name: 'Story', keywords: ['story', 'cerita', 'perjalanan', 'kisah'] },
  { name: 'Gallery', keywords: ['gallery', 'galeri', 'foto', 'album'] },
  { name: 'RSVP', keywords: ['rsvp', 'kehadiran', 'konfirmasi'] },
  { name: 'Gift', keywords: ['gift', 'kado', 'hadiah', 'angpau'] },
  { name: 'Footer', keywords: ['footer', 'terima kasih', 'penutup'] }
];

const report = {
  missingThemes: [],
  missingThumbnails: [],
  missingRegistry: [],
  incompleteThemes: [],
  duplicateThemes: []
};

// 1. Parse Registry
const registryContent = fs.readFileSync(registryPath, 'utf8');
const registryThemes = [];
// Match { id: '...', name: '...', ..., thumbnail: '...', component: ... }
const blockRegex = /\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?thumbnail:\s*['"]([^'"]+)['"][\s\S]*?component:\s*([A-Za-z0-9_]+)[\s\S]*?\}/g;
let match;
while ((match = blockRegex.exec(registryContent)) !== null) {
  registryThemes.push({
    id: match[1],
    name: match[2],
    thumbnail: match[3],
    componentName: match[4]
  });
}

// Map component imports to file paths
const importRegex = /const\s+([A-Za-z0-9_]+)\s*=\s*React\.lazy\(\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)\s*\);/g;
const componentPaths = new Map();
while ((match = importRegex.exec(registryContent)) !== null) {
  componentPaths.set(match[1], match[2]); // e.g. Luxury01 -> ./Luxury01.tsx or ./Luxury/Luxury01
}

const registeredFiles = new Set();
registryThemes.forEach(t => {
  const importPath = componentPaths.get(t.componentName);
  if (!importPath) {
    report.missingThemes.push(`Theme ${t.id} (${t.name}) - Component ${t.componentName} not imported in registry.tsx`);
    return;
  }
  
  let resolvedPath = importPath.replace('./', '');
  if (!resolvedPath.endsWith('.tsx') && !resolvedPath.endsWith('.jsx')) {
     resolvedPath += '.tsx';
  }
  const fullPath = path.join(themesDir, resolvedPath);
  
  if (!fs.existsSync(fullPath)) {
    report.missingThemes.push(`Theme ${t.id} (${t.name}) - File not found: ${resolvedPath}`);
  } else {
    registeredFiles.add(fullPath);
  }

  // Check thumbnails
  if (!t.thumbnail || t.thumbnail === '' || t.thumbnail.includes('source.unsplash.com')) {
    report.missingThumbnails.push(`Theme ${t.id} (${t.name})`);
  }
});

// 2. Scan Files
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  let tsxFiles = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      tsxFiles = tsxFiles.concat(scanDir(fullPath));
    } else if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && file !== 'registry.tsx' && file !== 'ThemeComponent.tsx') {
      tsxFiles.push(fullPath);
    }
  }
  return tsxFiles;
}

const allThemeFiles = scanDir(themesDir);

const fileNameMap = new Map();

allThemeFiles.forEach(file => {
  const fileName = path.basename(file);
  const relPath = path.relative(themesDir, file);
  
  if (fileNameMap.has(fileName)) {
    report.duplicateThemes.push(`Duplicate file name: ${fileName} found at ${relPath} and ${fileNameMap.get(fileName)}`);
  } else {
    fileNameMap.set(fileName, relPath);
  }
  
  if (!registeredFiles.has(file)) {
    report.missingRegistry.push(`Unregistered file: ${relPath}`);
  }
  
  // 3. Check Spec Compliance (Incomplete themes)
  const content = fs.readFileSync(file, 'utf8').toLowerCase();
  const missingSections = [];
  
  requiredSections.forEach(section => {
    const hasSection = section.keywords.some(kw => content.includes(kw));
    if (!hasSection) {
      missingSections.push(section.name);
    }
  });
  
  if (missingSections.length > 0) {
    report.incompleteThemes.push({
      file: relPath,
      missing: missingSections
    });
  }
});

// Generate Markdown
const outDir = path.join(rootDir, 'docs', 'audits');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let md = `# Theme Audit Report
Generated: ${new Date().toISOString()}

## Summary
- **Total Themes in Registry**: ${registryThemes.length}
- **Total Theme Files Found**: ${allThemeFiles.length}

## ❌ Missing Themes (File or Folder Missing)
${report.missingThemes.length ? report.missingThemes.map(t => `- ${t}`).join('\n') : '- *None*'}

## 🖼️ Missing/Invalid Thumbnails
${report.missingThumbnails.length ? report.missingThumbnails.map(t => `- ${t}`).join('\n') : '- *None*'}

## ⚠️ Missing Registry Entries (Unregistered Files)
${report.missingRegistry.length ? report.missingRegistry.map(t => `- ${t}`).join('\n') : '- *None*'}

## 📝 Incomplete Themes (Failed Theme Spec)
${report.incompleteThemes.length ? report.incompleteThemes.map(t => `- **${t.file}**: Missing sections -> ${t.missing.join(', ')}`).join('\n') : '- *All themes comply with the spec!*'}

## 🗂️ Duplicate Themes
${report.duplicateThemes.length ? report.duplicateThemes.map(t => `- ${t}`).join('\n') : '- *None*'}
`;

fs.writeFileSync(path.join(outDir, 'theme_audit_report.md'), md);
console.log("Audit complete. Report generated at docs/audits/theme_audit_report.md");
