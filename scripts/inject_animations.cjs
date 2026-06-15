const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '../src/themes');
const ANIMATIONS_IMPORT = "import { GoldenParticles, FallingFlowers, FallingLeaves, SnowEffect, LightParticles, IslamicParticles, SubtleParticles } from '../components/Theme/Animations';\n";
const RELATIVE_ANIMATIONS_IMPORT = "import { GoldenParticles, FallingFlowers, FallingLeaves, SnowEffect, LightParticles, IslamicParticles, SubtleParticles } from '../../components/Theme/Animations';\n";

const CATEGORY_MAP = {
  'Luxury': 'GoldenParticles',
  'Floral': 'FallingFlowers',
  'Minimalist': 'SubtleParticles',
  'Islamic': 'IslamicParticles',
  'Dark': 'LightParticles',
  'Rustic': 'FallingLeaves',
  'Tropical': 'FallingLeaves',
};

function getAnimationForCategory(dirName, fileName) {
  if (dirName && CATEGORY_MAP[dirName]) {
    return CATEGORY_MAP[dirName];
  }
  if (fileName.includes('Cinematic')) return 'SnowEffect';
  return 'SubtleParticles';
}

function processFile(filePath, isSubdir, dirName) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has animations
  if (content.includes('SubtleParticles') || content.includes('GoldenParticles')) {
    console.log(`Skipping (already injected): ${filePath}`);
    return;
  }

  const fileName = path.basename(filePath);
  const animationComponent = getAnimationForCategory(dirName, fileName);

  // Add import
  const importStr = isSubdir ? RELATIVE_ANIMATIONS_IMPORT : ANIMATIONS_IMPORT;
  content = importStr + content;

  // Find return ( <div ...> and inject right after it
  // We look for return (\n    <div className="min-h-screen
  const returnRegex = /(return\s*\(\s*<div[^>]*>)/;
  
  if (returnRegex.test(content)) {
    content = content.replace(returnRegex, `$1\n      <${animationComponent} />`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected <${animationComponent} /> into ${fileName}`);
  } else {
    console.warn(`Could not find injection point in ${fileName}`);
  }
}

function scanDir(dir, isSubdir = false, dirName = '') {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath, true, file);
    } else if (file.endsWith('.tsx') && file !== 'registry.tsx' && file !== 'MasterTheme.tsx') {
      processFile(fullPath, isSubdir, dirName);
    }
  }
}

console.log('Starting mass animation injection...');
scanDir(THEMES_DIR);
console.log('Injection complete.');
