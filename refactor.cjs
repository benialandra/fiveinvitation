const fs = require('fs');
const path = require('path');

const files = ['BrideGroom.tsx', 'Story.tsx', 'Gallery.tsx', 'Countdown.tsx', 'RSVP.tsx', 'Gift.tsx'];

files.forEach(f => {
  const p = path.join(__dirname, 'src/components/Theme', f);
  if (!fs.existsSync(p)) return;
  
  let c = fs.readFileSync(p, 'utf8');
  
  // Replace import
  c = c.replace(/import\s+\{\s*motion\s*\}\s+from\s+['"]framer-motion['"]/g, "import { m } from 'framer-motion'");
  
  // Replace motion.div with m.div
  c = c.replace(/<motion\./g, '<m.');
  c = c.replace(/<\/motion\./g, '</m.');
  
  // Add loading="lazy" to Gallery images if not there
  if (f === 'Gallery.tsx') {
    if (!c.includes('loading="lazy"')) {
      c = c.replace(/<img/g, '<img loading="lazy"');
    }
  }

  fs.writeFileSync(p, c);
});

console.log('Refactor complete');
