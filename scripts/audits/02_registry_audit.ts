import fs from 'fs';
import path from 'path';

const registryPath = path.resolve('src/themes/registry.tsx');
const inventoryPath = path.resolve('docs/audits/theme-inventory.json');
const outputDir = path.resolve('docs/audits');

if (!fs.existsSync(inventoryPath)) {
  console.error('Inventory not found. Run 01_theme_discovery.ts first.');
  process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
let registryContent = fs.readFileSync(registryPath, 'utf8');

console.log('Starting Phase 3: Registry Audit...');

const registeredThemesMatch = registryContent.match(/id:\s*['"]([^'"]+)['"]/g) || [];
const registeredIds = registeredThemesMatch.map(match => {
  const [, id] = match.match(/['"]([^'"]+)['"]/) || [];
  return id.toLowerCase();
});

const missingThemes = [];

for (const theme of inventory) {
  const expectedId = theme.name.toLowerCase();
  
  if (!registeredIds.includes(expectedId)) {
    missingThemes.push(theme);
  }
}

if (missingThemes.length > 0) {
  console.log(`Found ${missingThemes.length} missing themes in registry. Attempting to repair...`);
  
  let newImports = '';
  let newEntries = '';

  for (const theme of missingThemes) {
    const importPath = `./${theme.category}/${theme.name}`;
    newImports += `const ${theme.name} = React.lazy(() => import('${importPath}'));\n`;
    
    newEntries += `  {
    id: '${theme.name.toLowerCase()}',
    name: '${theme.name} (Auto-Registered)',
    category: '${theme.category}',
    price: 150000,
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60',
    component: ${theme.name}
  },`;
  }

  // Insert imports before export type ThemeCategory
  registryContent = registryContent.replace(
    /export type ThemeCategory/,
    `${newImports}\nexport type ThemeCategory`
  );

  // Insert entries before the end of the array
  // Assuming it ends with }
  const lastBracketIndex = registryContent.lastIndexOf('];');
  if (lastBracketIndex !== -1) {
    registryContent = registryContent.slice(0, lastBracketIndex) + newEntries + '\n' + registryContent.slice(lastBracketIndex);
  }

  fs.writeFileSync(registryPath, registryContent);
  console.log('Repaired registry.tsx');
} else {
  console.log('All discovered themes are registered.');
}

// Generate Report
let markdown = `# Registry Audit Report\n\n`;
markdown += `Total Themes in Filesystem: ${inventory.length}\n`;
markdown += `Themes Initially Registered: ${registeredIds.length}\n`;
markdown += `Missing Themes Found & Repaired: ${missingThemes.length}\n\n`;

if (missingThemes.length > 0) {
  markdown += `### Repaired Themes\n\n`;
  for (const theme of missingThemes) {
    markdown += `- ${theme.name} (${theme.category})\n`;
  }
}

fs.writeFileSync(path.join(outputDir, 'theme-registry-audit.md'), markdown);
console.log('Generated docs/audits/theme-registry-audit.md');
