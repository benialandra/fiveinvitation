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

  // Replace lang={lang} with lang={typeof lang !== 'undefined' ? lang : 'id'}
  content = content.replace(/lang=\{lang\}/g, "lang={typeof lang !== 'undefined' ? lang : 'id'}");
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed lang undefined in ${theme}.tsx`);
  }
});
