import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const themesDir = path.join(rootDir, 'src', 'themes');

function scanDir(dir) {
  let tsxFiles = [];
  if (!fs.existsSync(dir)) return tsxFiles;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      tsxFiles = tsxFiles.concat(scanDir(fullPath));
    } else if (file.endsWith('.tsx') && file !== 'registry.tsx' && file !== 'ThemeComponent.tsx') {
      tsxFiles.push(fullPath);
    }
  }
  return tsxFiles;
}

const allThemeFiles = scanDir(themesDir);
let modifiedCount = 0;

for (const file of allThemeFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // 1. Inject import
  if (!content.includes('SharedFooter')) {
    const importRegex = /(import\s+\{)([^}]+)(\}\s+from\s+['"]\.\.\/\.\.\/components\/Theme['"];)/;
    if (importRegex.test(content)) {
      content = content.replace(importRegex, (match, p1, p2, p3) => {
        // Avoid duplicate comma
        const inner = p2.trim();
        const comma = inner.endsWith(',') ? '' : ', ';
        return `${p1}${inner}${comma}SharedFooter${p3}`;
      });
      modified = true;
    }
  }

  // 2. Inject component
  if (!content.includes('<SharedFooter')) {
    const injectionStr = `\n          <div className="relative z-10 opacity-100 scale-100 bg-transparent w-full">\n             <SharedFooter colors={colors} fonts={fonts} data={data} lang={lang} />\n          </div>\n        `;
    
    if (content.includes('</SmoothScrollLayout>')) {
      content = content.replace('</SmoothScrollLayout>', injectionStr + '</SmoothScrollLayout>');
      modified = true;
    } else {
      // Fallback: insert after SharedRSVP's wrapper div
      const rsvpRegex = /(<SharedRSVP[^>]*\/>\s*<\/div>)/;
      if (rsvpRegex.test(content)) {
        content = content.replace(rsvpRegex, `$1${injectionStr}`);
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(file, content);
    modifiedCount++;
  }
}

console.log(`Successfully injected SharedFooter into ${modifiedCount} themes.`);
