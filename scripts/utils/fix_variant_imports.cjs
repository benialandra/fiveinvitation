const fs = require('fs');
const path = require('path');
const dir = 'src/themes/cinematic-variants';

const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace import CinematicTheme from './CinematicTheme' with '../CinematicTheme'
    content = content.replace(/from\s+['"]\.\/CinematicTheme['"]/g, "from '../CinematicTheme'");
    fs.writeFileSync(filePath, content);
  }
}
console.log('Fixed relative imports in variants');
