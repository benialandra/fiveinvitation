const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../../src/themes/cinematic-variants');
const cinematicBase = path.join(__dirname, '../../src/themes/CinematicTheme.tsx');

const requiredComponents = [
  'Hero',
  'Bride & Groom',
  'Countdown',
  'Story',
  'Gallery',
  'RSVP',
  'Gift',
  'Footer'
];

// Mapping component names to regex patterns that might exist in the file
const componentRegex = {
  'Hero': /<Hero|\bHero\b/i,
  'Bride & Groom': /BrideName|GroomName|Mempelai|<BrideGroom/i,
  'Countdown': /<Countdown|\bCountdown\b|Hari|Jam|Menit/i,
  'Story': /<Story|Love Story|Cerita Cinta|Timeline/i,
  'Gallery': /<Gallery|\bGallery\b/i,
  'RSVP': /<RSVP|\bRSVP\b/i,
  'Gift': /<Gift|\bGift\b|Kado|Rekening/i,
  'Footer': /<footer|\bFooter\b/i
};

function analyzeFile(filePath, themeName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const missing = [];
  
  // Special handling for CinematicAutumnRustic_1 / ForestMint_1 which are just wrappers
  if (content.includes('<CinematicTheme')) {
    // If it's a wrapper, we analyze CinematicTheme.tsx instead
    return analyzeFile(cinematicBase, themeName);
  }

  for (const comp of requiredComponents) {
    if (!componentRegex[comp].test(content)) {
      missing.push(comp);
    }
  }

  return missing;
}

const files1 = fs.readdirSync(themesDir).filter(f => f.endsWith('.tsx')).map(f => path.join(themesDir, f));
const themesRoot = path.join(__dirname, '../../src/themes');
const files2 = fs.readdirSync(themesRoot).filter(f => f.endsWith('.tsx')).map(f => path.join(themesRoot, f));

const allFiles = [...files1, ...files2].filter(f => !f.endsWith('registry.tsx') && !f.endsWith('CinematicTheme.tsx'));

const results = [];

allFiles.forEach(filePath => {
  const themeName = path.basename(filePath, '.tsx');
  const missing = analyzeFile(filePath, themeName);
  results.push({ themeName, missing });
});

let markdownTable = '| Theme Name | Missing Components |\n|---|---|\n';
results.forEach(res => {
  const missingStr = res.missing.length > 0 ? res.missing.join(', ') : 'None';
  markdownTable += `| ${res.themeName} | ${missingStr} |\n`;
});

const outputPath = path.join(__dirname, '../../docs/theme-analysis.md');
fs.writeFileSync(outputPath, markdownTable);
console.log('Analysis complete. Wrote to docs/theme-analysis.md');
console.log(markdownTable);
