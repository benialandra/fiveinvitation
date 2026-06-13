const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.tsx') && f !== 'registry.tsx' && !f.includes('variants'));

const requiredSections = [
  { name: 'Hero', keywords: ['<Hero', 'heroImage', 'hero_image', 'cover', 'Cover'] },
  { name: 'Bride & Groom', keywords: ['<BrideGroom', 'Mempelai', 'groomName', 'brideName', 'groom_name'] },
  { name: 'Countdown', keywords: ['<Countdown', 'Hitung Mundur', 'days', 'hours', 'minutes', 'timeLeft'] },
  { name: 'Story', keywords: ['<Story', 'Love Story', 'Cerita', 'Kisah', 'stories'] },
  { name: 'Gallery', keywords: ['<Gallery', 'Galeri', 'gallery_1'] },
  { name: 'RSVP', keywords: ['<RSVP', 'Kehadiran', 'Konfirmasi', 'reservation'] },
  { name: 'Gift', keywords: ['<Gift', 'Hadiah', 'Kado', 'bankAccounts', 'rekening'] },
  { name: 'Footer', keywords: ['<Footer', 'Terima Kasih', 'Thank You', 'footer'] }
];

let report = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(themesDir, file), 'utf8');
  
  if (content.includes('import CinematicTheme') || content.includes('import MasterTheme')) {
    return; // Wrappers that use full themes
  }
  
  let missing = [];
  requiredSections.forEach(sec => {
    let found = false;
    for (let kw of sec.keywords) {
      if (content.includes(kw) || new RegExp(kw, 'i').test(content)) {
        found = true;
        break;
      }
    }
    if (!found) {
      missing.push(sec.name);
    }
  });
  
  report.push({ name: file.replace('.tsx', ''), missing });
});

console.log("THEME AUDIT REPORT:");
report.forEach(r => {
  let status = r.missing.length === 0 ? 'Complete' : (r.missing.length > 3 ? 'Critical' : 'Incomplete');
  console.log(`${r.name}|${r.missing.length > 0 ? r.missing.join(',') : 'None'}|${status}`);
});
