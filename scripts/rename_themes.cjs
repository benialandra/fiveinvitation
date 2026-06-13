const fs = require('fs');
const path = require('path');

const srcThemesDir = path.join(__dirname, '..', 'src', 'themes');
const registryPath = path.join(srcThemesDir, 'registry.tsx');

let registryContent = fs.readFileSync(registryPath, 'utf8');

// Map of category -> prefix
const categoryPrefixMap = {
  'Premium': 'Luxury',
  'Elegant': 'Luxury',
  'Minimalist': 'Minimal',
  'Islamic': 'Islamic',
  'Floral': 'Floral',
  'Rustic': 'Rustic',
  'Tropical': 'Tropical',
  'Dark': 'Dark'
};

const counters = {};

// 1. Find all lazy imports
const lazyImportRegex = /const\s+([A-Za-z0-9_]+)\s*=\s*React\.lazy\(\(\)\s*=>\s*import\('\.\/([A-Za-z0-9_]+)'\)\);/g;
let lazyImports = {};
let match;
while ((match = lazyImportRegex.exec(registryContent)) !== null) {
  lazyImports[match[1]] = match[2]; // componentName -> fileName
}

// 2. Find THEME_REGISTRY objects
const registryMatch = registryContent.match(/export const THEME_REGISTRY: ThemeMeta\[\] = \[([\s\S]*?)\];/);
if (!registryMatch) {
  console.error("Could not find THEME_REGISTRY");
  process.exit(1);
}

const itemsText = registryMatch[1];
const itemRegex = /{[\s\S]*?id:\s*'([^']+)',[\s\S]*?name:\s*'([^']+)',[\s\S]*?category:\s*'([^']+)',[\s\S]*?thumbnail:\s*'([^']+)',[\s\S]*?component:\s*([A-Za-z0-9_]+)[\s\S]*?}/g;

const mappings = [];
let items = [];

while ((match = itemRegex.exec(itemsText)) !== null) {
  const fullMatch = match[0];
  const oldId = match[1];
  const name = match[2];
  const category = match[3];
  const thumbnail = match[4];
  const oldComponent = match[5];
  
  items.push({
    fullText: fullMatch,
    oldId,
    name,
    category,
    thumbnail,
    oldComponent,
    oldFile: lazyImports[oldComponent]
  });
}

// Assign new names
items.forEach(item => {
  const prefix = categoryPrefixMap[item.category] || 'Theme';
  if (!counters[prefix]) counters[prefix] = 1;
  
  const numStr = counters[prefix].toString().padStart(2, '0');
  item.newId = `${prefix.toLowerCase()}${numStr}`;
  item.newComponent = `${prefix}${numStr}`;
  item.newFile = `${prefix}${numStr}`;
  
  counters[prefix]++;
  
  mappings.push({
    oldId: item.oldId,
    newId: item.newId,
    oldFile: item.oldFile,
    newFile: item.newFile,
    oldComponent: item.oldComponent,
    newComponent: item.newComponent,
    name: item.name
  });
});

// Write mappings for SQL generation
fs.writeFileSync(path.join(__dirname, 'migration_map.json'), JSON.stringify(mappings, null, 2));

// 3. Rename physical files
mappings.forEach(m => {
  if (!m.oldFile) return;
  const oldPath = path.join(srcThemesDir, m.oldFile + '.tsx');
  const newPath = path.join(srcThemesDir, m.newFile + '.tsx');
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${m.oldFile}.tsx -> ${m.newFile}.tsx`);
  }
});

// 4. Update registry.tsx content
let newRegistryContent = registryContent;

mappings.forEach(m => {
  if (!m.oldFile) return;
  
  // Replace lazy import
  const oldLazy = `const ${m.oldComponent} = React.lazy(() => import('./${m.oldFile}'));`;
  const newLazy = `const ${m.newComponent} = React.lazy(() => import('./${m.newFile}'));`;
  newRegistryContent = newRegistryContent.replace(oldLazy, newLazy);
  
  // Also handle cases where oldComponent matches oldFile exactly but syntax has extra spaces
  const lazyRegex2 = new RegExp(`const\\s+${m.oldComponent}\\s*=\\s*React\\.lazy\\(\\(\\)\\s*=>\\s*import\\('\\.\\/${m.oldFile}'\\)\\);`, 'g');
  newRegistryContent = newRegistryContent.replace(lazyRegex2, newLazy);
});

// Replace objects in THEME_REGISTRY array
let newItemsText = itemsText;
items.forEach(item => {
  let newFullText = item.fullText;
  newFullText = newFullText.replace(`id: '${item.oldId}'`, `id: '${item.newId}'`);
  newFullText = newFullText.replace(`component: ${item.oldComponent}`, `component: ${item.newComponent}`);
  
  newItemsText = newItemsText.replace(item.fullText, newFullText);
});

newRegistryContent = newRegistryContent.replace(itemsText, newItemsText);

fs.writeFileSync(registryPath, newRegistryContent);
console.log("Updated registry.tsx successfully!");
