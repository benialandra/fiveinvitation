const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'src', 'themes', 'registry.tsx');
const content = fs.readFileSync(registryPath, 'utf8');

// Match THEME_REGISTRY array
const registryMatch = content.match(/export const THEME_REGISTRY: ThemeMeta\[\] = \[([\s\S]*?)\];/);
if (registryMatch) {
  let inner = registryMatch[1];
  
  // Try to parse out the objects.
  // It's not pure JSON, it's JS objects with component references.
  let items = [];
  const regex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*category:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(inner)) !== null) {
    items.push({ id: match[1], name: match[2], category: match[3] });
  }
  
  fs.writeFileSync('theme_map.json', JSON.stringify(items, null, 2));
  console.log("Extracted", items.length, "themes.");
} else {
  console.log("Could not parse THEME_REGISTRY");
}
