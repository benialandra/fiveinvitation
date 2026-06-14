const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../src/themes');
const luxury11Path = path.join(themesDir, 'Luxury/Luxury11.tsx');

if (!fs.existsSync(luxury11Path)) {
  console.error("Master theme Luxury11.tsx not found!");
  process.exit(1);
}

const masterCode = fs.readFileSync(luxury11Path, 'utf8');

const originalColors = {
  bgBase: '#120804', bgCover: '#180d07', bgGradMid: '#1c0f08', bgGradAlt: '#1e0f08',
  cardBg: '#2d1b10', recipientBg: '#2e1f16', iconBg: '#3d2417',
  textMain: '#faf6f0', textMuted: '#d5c2b0',
  accentMain: '#df9f28', accentDark: '#b45309', accentHover: '#f59e0b', accentHoverDark: '#d97706'
};

const categories = {
  Dark: {
    colors: {
      bgBase: '#0a0a0a', bgCover: '#111111', bgGradMid: '#1a1a1a', bgGradAlt: '#1f1f1f',
      cardBg: '#222222', recipientBg: '#262626', iconBg: '#333333',
      textMain: '#f0f0f0', textMuted: '#a0a0a0',
      accentMain: '#c0c0c0', accentDark: '#808080', accentHover: '#e0e0e0', accentHoverDark: '#a0a0a0'
    },
    fonts: { body: 'Inter', heading: 'Playfair Display' },
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap'
  },
  Floral: {
    colors: {
      bgBase: '#fffdfc', bgCover: '#fff5f5', bgGradMid: '#fdf2f4', bgGradAlt: '#fae8eb',
      cardBg: '#ffffff', recipientBg: '#fcf3f5', iconBg: '#f5e1e6',
      textMain: '#4a2c31', textMuted: '#8a656c',
      accentMain: '#d48c9b', accentDark: '#b56879', accentHover: '#e6a6b3', accentHoverDark: '#cc7a8c'
    },
    fonts: { body: 'Lato', heading: 'Cormorant Garamond' },
    fontUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&display=swap'
  },
  Islamic: {
    colors: {
      bgBase: '#0b1c14', bgCover: '#0d2419', bgGradMid: '#112b1f', bgGradAlt: '#143324',
      cardBg: '#1b402e', recipientBg: '#1d4531', iconBg: '#25523b',
      textMain: '#f5f0e6', textMuted: '#c2bcae',
      accentMain: '#d4af37', accentDark: '#aa8c2c', accentHover: '#edc43e', accentHoverDark: '#c2a032'
    },
    fonts: { body: 'Outfit', heading: 'Amiri' },
    fontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap'
  },
  Minimalist: {
    colors: {
      bgBase: '#ffffff', bgCover: '#fcfcfc', bgGradMid: '#f9f9f9', bgGradAlt: '#f5f5f5',
      cardBg: '#ffffff', recipientBg: '#f0f0f0', iconBg: '#e0e0e0',
      textMain: '#1a1a1a', textMuted: '#666666',
      accentMain: '#333333', accentDark: '#111111', accentHover: '#555555', accentHoverDark: '#222222'
    },
    fonts: { body: 'Inter', heading: 'Inter' },
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  },
  Rustic: {
    colors: {
      bgBase: '#f4f1ea', bgCover: '#ebe7de', bgGradMid: '#e3ded1', bgGradAlt: '#dcd6c7',
      cardBg: '#ffffff', recipientBg: '#faf8f5', iconBg: '#e8e2d5',
      textMain: '#3b3327', textMuted: '#7a6f5d',
      accentMain: '#8c7050', accentDark: '#6b5338', accentHover: '#a68764', accentHoverDark: '#806342'
    },
    fonts: { body: 'Lora', heading: 'Playfair Display' },
    fontUrl: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap'
  },
  Tropical: {
    colors: {
      bgBase: '#0d2121', bgCover: '#102929', bgGradMid: '#143030', bgGradAlt: '#173636',
      cardBg: '#1f4545', recipientBg: '#224a4a', iconBg: '#2a5757',
      textMain: '#effcf7', textMuted: '#a3c2ba',
      accentMain: '#2abf88', accentDark: '#1d9467', accentHover: '#38d99d', accentHoverDark: '#24a877'
    },
    fonts: { body: 'Montserrat', heading: 'Prata' },
    fontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Prata&display=swap'
  },
  Luxury: {
    colors: originalColors,
    fonts: { body: 'Plus Jakarta Sans', heading: 'Playfair Display' },
    fontUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap'
  }
};

function getCategory(filePath) {
  for (const cat of Object.keys(categories)) {
    if (filePath.includes(`/${cat}/`) || filePath.includes(`\\${cat}\\`) || filePath.toLowerCase().includes(cat.toLowerCase())) {
      return cat;
    }
  }
  return 'Luxury'; // default
}

function processFile(filePath) {
  const fileName = path.basename(filePath);
  if (['Luxury11.tsx', 'MasterTheme.tsx', 'registry.tsx', 'CinematicTheme.tsx'].includes(fileName)) {
    return; // skip master files
  }

  const componentName = fileName.replace('.tsx', '');
  const catName = getCategory(filePath);
  const catConfig = categories[catName];

  let newCode = masterCode;

  // Replace colors
  Object.keys(originalColors).forEach(key => {
    const origColor = originalColors[key];
    const newColor = catConfig.colors[key];
    const regex = new RegExp(origColor, 'gi');
    newCode = newCode.replace(regex, newColor);
  });

  // Replace component name
  newCode = newCode.replace(/export default function \w+\(/, `export default function ${componentName}(`);

  // Replace fonts in standard places
  newCode = newCode.replace(/"Plus Jakarta Sans"/g, `"${catConfig.fonts.body}"`);
  newCode = newCode.replace(/"Playfair Display"/g, `"${catConfig.fonts.heading}"`);
  
  // Replace font url
  newCode = newCode.replace(/https:\/\/fonts\.googleapis\.com\/css2\?family=Cinzel[^'"]+/, catConfig.fontUrl);

  // Write back to file
  fs.writeFileSync(filePath, newCode, 'utf8');
  console.log(`Updated ${fileName} with category ${catName}`);
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
console.log("All themes standardized successfully!");
