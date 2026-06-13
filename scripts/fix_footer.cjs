const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'themes');

const targetThemes = [
  'CinematicLoveStory',
  'DarkPremium',
  'FairytaleCastle',
  'GlassmorphismElegance',
  'IslamicElegant',
  'MinimalistMonochrome',
  'OceanBreeze',
  'RealisticRomance',
  'ScandinavianMinimalist',
  'UltraPremiumInteractive'
];

targetThemes.forEach(theme => {
  const filePath = path.join(themesDir, `${theme}.tsx`);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Fix lang="id" instead of typeof lang
  content = content.replace(/lang=\{typeof lang !== 'undefined' \? lang : 'id'\}/g, 'lang="id"');
  
  // 2. Remove Footer import
  content = content.replace(/import Footer from '\.\.\/components\/Theme\/Footer';\n?/g, '');
  
  // 3. Remove <Footer />
  content = content.replace(/<Footer[^>]*\/>\n?/g, '');
  
  // 4. Also remove Story if it was accidentally omitted in CinematicLoveStory? 
  // No, I didn't inject Story in CinematicLoveStory.

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed Footer import and lang in ${theme}.tsx`);
  }
});
