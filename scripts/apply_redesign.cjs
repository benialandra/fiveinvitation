const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../src/themes');

// Layout variations (Hero must be first, RSVP/Gift at the end generally)
const layouts = [
  ['SharedHero', 'SharedStory', 'SharedCountdown', 'SharedGallery', 'SharedGift', 'SharedRSVP'],
  ['SharedHero', 'SharedCountdown', 'SharedGallery', 'SharedStory', 'SharedGift', 'SharedRSVP'],
  ['SharedHero', 'SharedStory', 'SharedGallery', 'SharedCountdown', 'SharedRSVP', 'SharedGift'],
  ['SharedHero', 'SharedGallery', 'SharedStory', 'SharedCountdown', 'SharedGift', 'SharedRSVP'],
  ['SharedHero', 'SharedCountdown', 'SharedStory', 'SharedGallery', 'SharedRSVP', 'SharedGift'],
  ['SharedHero', 'SharedGallery', 'SharedCountdown', 'SharedStory', 'SharedGift', 'SharedRSVP'],
];

// Typography differentiation by category
const typography = {
  Luxury: [
    { body: 'Cormorant', heading: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap' },
    { body: 'Lora', heading: 'Cinzel', url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Cinzel:wght@400;500;600;700&display=swap' }
  ],
  Minimalist: [
    { body: 'Manrope', heading: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&display=swap' },
    { body: 'Inter', heading: 'Outfit', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap' }
  ],
  Dark: [
    { body: 'Manrope', heading: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap' },
    { body: 'Inter', heading: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap' }
  ],
  Floral: [
    { body: 'Lato', heading: 'Parisienne', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Parisienne&display=swap' },
    { body: 'Outfit', heading: 'Great Vibes', url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Great+Vibes&display=swap' }
  ],
  Islamic: [
    { body: 'Noto Kufi Arabic', heading: 'Amiri', url: 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap' },
    { body: 'Outfit', heading: 'Aref Ruqaa', url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Aref+Ruqaa:wght@400;700&display=swap' }
  ],
  Rustic: [
    { body: 'Libre Baskerville', heading: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap' },
    { body: 'Lora', heading: 'Merriweather', url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap' }
  ],
  Tropical: [
    { body: 'Poppins', heading: 'Libre Baskerville', url: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap' },
    { body: 'Montserrat', heading: 'Prata', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Prata&display=swap' }
  ]
};

// Component markup templates
const compMarkup = {
  'SharedHero': `<SharedHero brideName={brideName} groomName={groomName} dateStr={format(weddingDate, 'EEEE, d MMMM yyyy', { locale: currentLocale })} heroImage={heroImage} colors={colors} fonts={fonts} />`,
  'SharedStory': `<div className="relative z-10 opacity-95 scale-100"><SharedStory storyText={storyText} colors={colors} fonts={fonts} /></div>`,
  'SharedCountdown': `<div className="relative z-10 opacity-95 scale-100"><SharedCountdown targetDate={weddingDate} colors={colors} fonts={fonts} /></div>`,
  'SharedGallery': `<div className="overflow-hidden bg-transparent"><SharedGallery colors={colors} fonts={fonts} images={galleryImages} /></div>`,
  'SharedGift': `<div className="overflow-hidden bg-transparent"><SharedGift colors={colors} fonts={fonts} bankName={bankName} bankAccount={bankAccount} bankOwner={bankOwner} /></div>`,
  'SharedRSVP': `<div className="relative z-10 opacity-95 scale-100"><SharedRSVP colors={colors} fonts={fonts} /></div>`
};

function getCategory(filePath) {
  for (const cat of Object.keys(typography)) {
    if (filePath.includes(`/${cat}/`) || filePath.includes(`\\\\${cat}\\\\`) || filePath.toLowerCase().includes(cat.toLowerCase())) {
      return cat;
    }
  }
  return 'Luxury'; // default
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function processFile(filePath) {
  const fileName = path.basename(filePath);
  if (['Luxury11.tsx', 'MasterTheme.tsx', 'registry.tsx', 'CinematicTheme.tsx', 'TEST.tsx'].includes(fileName)) {
    return; // skip master files and special files
  }

  let code = fs.readFileSync(filePath, 'utf8');
  const originalCode = code;
  
  const catName = getCategory(filePath);
  const hash = hashString(fileName);
  
  // 1. Differentiate Layout
  const layoutVariation = layouts[hash % layouts.length];
  const layoutCode = layoutVariation.map(comp => `          ${compMarkup[comp]}`).join('\n\n');
  
  // Replace the inside of SmoothScrollLayout
  // We use [\s\S]*? to match everything including newlines
  const regexLayout = /<SmoothScrollLayout>([\s\S]*?)<SharedFooter/g;
  code = code.replace(regexLayout, `<SmoothScrollLayout>\n${layoutCode}\n\n          <div className="relative z-10 opacity-100 scale-100 bg-transparent w-full">\n             <SharedFooter`);

  // 2. Differentiate Typography
  const typoOptions = typography[catName] || typography['Luxury'];
  const typo = typoOptions[hash % typoOptions.length];

  // Update fonts object inside component
  const regexFontsObj = /const fonts = \{[^}]+\};/g;
  if (code.match(regexFontsObj)) {
     code = code.replace(regexFontsObj, `const fonts = { heading: "${typo.heading}", body: "${typo.body}" };`);
  } else {
     // If inline
     code = code.replace(/fonts\s*=\s*\{\s*body:\s*'[^']+',\s*heading:\s*'[^']+'\s*\}/g, `fonts = { body: "${typo.body}", heading: "${typo.heading}" }`);
  }

  // Rewrite file
  if (code !== originalCode) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`✅ Redesigned ${fileName} | Layout: V${(hash % layouts.length) + 1} | Fonts: ${typo.heading}/${typo.body}`);
  } else {
    console.log(`⚠️ Skipped ${fileName} (No layout or fonts found to replace)`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(themesDir);
console.log("\n🎉 All themes completely redesigned, differentiated, and identities assigned successfully!");
