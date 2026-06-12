const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../src/themes');
const registryPath = path.join(themesDir, 'registry.tsx');

const paletteMap = {
  '#0a0f18': 'MidnightGold',
  '#fff0f5': 'SpringBlossom',
  '#0f172a': 'ForestMint',
  '#f8fafc': 'WinterFrost',
  '#1c1917': 'AutumnRustic',
  '#1e1b4b': 'RegalPurple',
  '#fffbf9': 'RoseGold',
  '#083344': 'OceanDepth',
};

const paletteNames = {
  'MidnightGold': 'Midnight Gold',
  'SpringBlossom': 'Spring Blossom',
  'ForestMint': 'Forest Mint',
  'WinterFrost': 'Winter Frost',
  'AutumnRustic': 'Autumn Rustic',
  'RegalPurple': 'Regal Purple',
  'RoseGold': 'Rose Gold',
  'OceanDepth': 'Ocean Depth'
};

const getFiles = (dir) => fs.readdirSync(dir).filter(f => f.startsWith('SampleMotif') && f.endsWith('.tsx'));

const files = getFiles(themesDir);
let registryCode = fs.readFileSync(registryPath, 'utf8');

const counters = {};
let count = 0;

for (const file of files) {
  const filePath = path.join(themesDir, file);
  const oldComponentName = file.replace('.tsx', '');
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const bgMatch = content.match(/bgBase:\s*'([^']+)'/);
  if (!bgMatch) {
    console.warn("Skipping " + file + " (no bgBase found)");
    continue;
  }
  
  const bgBase = bgMatch[1];
  const paletteTheme = paletteMap[bgBase] || 'CinematicElegance';
  
  counters[paletteTheme] = (counters[paletteTheme] || 0) + 1;
  const newComponentName = "Cinematic" + paletteTheme + "_" + counters[paletteTheme];
  const labelFallback = paletteNames[paletteTheme] || 'Elegance';
  const newLabelName = "Cinematic " + labelFallback + " " + counters[paletteTheme];
  
  content = content.replace(new RegExp("function " + oldComponentName, 'g'), "function " + newComponentName);
  
  const newFilePath = path.join(themesDir, newComponentName + '.tsx');
  
  fs.writeFileSync(newFilePath, content);
  fs.unlinkSync(filePath); 
  
  registryCode = registryCode.replace(
    new RegExp("const " + oldComponentName + " = React\\.lazy\\(\\(\\) => import\\('\\./" + oldComponentName + "'\\)\\);", 'g'),
    "const " + newComponentName + " = React.lazy(() => import('./" + newComponentName + "'));"
  );
  
  registryCode = registryCode.replace(
    new RegExp("component:\\s*" + oldComponentName, 'g'),
    "component: " + newComponentName
  );
  
  const oldNameMatch = oldComponentName.replace('SampleMotif', 'Sample Motif ');
  registryCode = registryCode.replace(
    new RegExp("name:\\s*'" + oldNameMatch + "'", 'g'),
    "name: '" + newLabelName + "'"
  );
  
  count++;
}

fs.writeFileSync(registryPath, registryCode);

console.log("Successfully renamed " + count + " themes.");
