const fs = require('fs');
const path = require('path');

function refactorFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  let c = fs.readFileSync(filepath, 'utf8');
  
  // Replace import
  c = c.replace(/import\s+\{([^}]*)motion([^}]*)\}\s+from\s+['"]framer-motion['"]/g, "import { $1m$2 } from 'framer-motion'");
  
  // Replace motion.div with m.div, motion.h1 with m.h1 etc.
  c = c.replace(/<motion\./g, '<m.');
  c = c.replace(/<\/motion\./g, '</m.');

  fs.writeFileSync(filepath, c);
}

refactorFile(path.join(__dirname, 'src/layouts/Layout.tsx'));
refactorFile(path.join(__dirname, 'src/pages/Home.tsx'));

// Specific fixes for Home.tsx LCP
const homePath = path.join(__dirname, 'src/pages/Home.tsx');
let homeContent = fs.readFileSync(homePath, 'utf8');

// Replace the background-image div with an img tag in the hero orders map
const oldHeroDiv = `<div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: \`url(\${order.image})\` }}></div>`;

const newHeroImg = `<img 
  src={order.image} 
  alt={order.names}
  fetchPriority={idx === 0 ? "high" : "auto"}
  loading={idx === 0 ? "eager" : "lazy"}
  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
/>`;

homeContent = homeContent.replace(oldHeroDiv, newHeroImg);

// Make sure other images in ABOUT_IMAGES and RECENT_ORDERS have loading="lazy"
homeContent = homeContent.replace(/<m\.img\s+(.*?)className=/g, '<m.img loading="lazy" $1className=');

fs.writeFileSync(homePath, homeContent);

console.log('Refactor complete');
