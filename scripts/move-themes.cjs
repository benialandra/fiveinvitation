const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'themes');
const registryPath = path.join(srcDir, 'registry.tsx');

const categories = {
  'Luxury': 'Luxury',
  'Minimal': 'Minimalist',
  'Floral': 'Floral',
  'Islamic': 'Islamic',
  'Dark': 'Dark',
  'Rustic': 'Rustic',
  'Tropical': 'Tropical'
};

// Create dirs
Object.values(categories).forEach(cat => {
  const catDir = path.join(srcDir, cat);
  if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });
});

// Move files
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.tsx') && f !== 'registry.tsx' && !f.includes('Cinematic') && !f.includes('MasterTheme'));

let moveCount = 0;

files.forEach(f => {
  const prefix = Object.keys(categories).find(p => f.startsWith(p));
  if (prefix) {
    const oldPath = path.join(srcDir, f);
    const newPath = path.join(srcDir, categories[prefix], f);
    fs.renameSync(oldPath, newPath);
    moveCount++;
  }
});

console.log(`Moved ${moveCount} theme files into category subfolders.`);

// Update registry.tsx
if (fs.existsSync(registryPath)) {
  let content = fs.readFileSync(registryPath, 'utf8');
  
  Object.keys(categories).forEach(prefix => {
    const category = categories[prefix];
    // Replace: const Luxury01 = React.lazy(() => import('./Luxury01'));
    // With: const Luxury01 = React.lazy(() => import('./Luxury/Luxury01'));
    const regex = new RegExp(`import\\('\\.\\/(${prefix}[0-9]+)'\\)`, 'g');
    content = content.replace(regex, `import('./${category}/$1')`);
  });
  
  fs.writeFileSync(registryPath, content);
  console.log('Updated registry.tsx imports.');
}
