const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.tsx') && f !== 'registry.tsx' && f !== 'CinematicTheme.tsx' && f !== 'MasterTheme.tsx');

const requiredSections = [
  'Hero',
  'Bride', // BrideGroom or Bride & Groom
  'Countdown',
  'Story',
  'Gallery',
  'RSVP',
  'Gift',
  'Footer' // often implicitly checked
];

let report = [];

// Also check CinematicTheme
const cinematicContent = fs.readFileSync(path.join(themesDir, 'CinematicTheme.tsx'), 'utf8');
let missingCinematic = [];
requiredSections.forEach(sec => {
  // Simple regex for component tag like <Hero or id="hero"
  const regex = new RegExp(`(<${sec}|id=["']${sec.toLowerCase()}["']|className=["'][^"']*${sec.toLowerCase()}[^"']*["'])`, 'i');
  if (!regex.test(cinematicContent)) {
    missingCinematic.push(sec);
  }
});
report.push({ name: 'CinematicTheme', missing: missingCinematic });

files.forEach(file => {
  const content = fs.readFileSync(path.join(themesDir, file), 'utf8');
  
  // If it's a variant that just imports CinematicTheme, it inherits its status
  if (content.includes('import CinematicTheme')) {
    // skip listing all 94 variants, or just mark them as same as CinematicTheme
    // report.push({ name: file.replace('.tsx', ''), missing: missingCinematic });
    return;
  }
  
  let missing = [];
  requiredSections.forEach(sec => {
    // Check if imported or rendered
    const regex = new RegExp(`(<${sec}|id=["']${sec.toLowerCase()}["']|className=["'][^"']*${sec.toLowerCase()}[^"']*["'])`, 'i');
    const importRegex = new RegExp(`import.*${sec}`);
    if (!regex.test(content) && !importRegex.test(content)) {
      missing.push(sec);
    }
  });
  
  report.push({ name: file.replace('.tsx', ''), missing });
});

console.log("THEME AUDIT REPORT:");
report.forEach(r => {
  let status = r.missing.length === 0 ? 'Complete' : (r.missing.length > 3 ? 'Critical' : 'Incomplete');
  console.log(`\nTheme Name: ${r.name}`);
  console.log(`Missing Elements: ${r.missing.length > 0 ? r.missing.join(', ') : 'None'}`);
  console.log(`Status: ${status}`);
});
