const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, '../docs/audits/theme-inventory.md');
const outDir = path.join(__dirname, '../docs/themes');
const outPath = path.join(outDir, 'theme-dna.md');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const inventoryMd = fs.readFileSync(inventoryPath, 'utf8');

// Parse inventory table
const lines = inventoryMd.split('\n');
const themes = [];
let parsingTable = false;

for (const line of lines) {
  if (line.startsWith('| Theme Name |')) {
    parsingTable = true;
    continue;
  }
  if (parsingTable && line.startsWith('|---')) continue;
  if (parsingTable && line.startsWith('| **')) {
    const parts = line.split('|').map(s => s.trim());
    if (parts.length >= 6) {
      themes.push({
        id: parts[1].replace(/\*\*/g, ''),
        category: parts[2],
        layout: parts[3],
        fonts: parts[4],
        animation: parts[5]
      });
    }
  }
  if (parsingTable && line === '') {
    parsingTable = false;
  }
}

const identityPools = {
  Luxury: ['Royal Palace', 'Golden Ballroom', 'Black Gold Premium', 'Modern Luxury Hotel', 'White Marble Wedding', 'Diamond Elegance', 'Velvet Nights', 'Platinum Romance', 'Crystal Chandelier', 'Majestic Crown', 'Imperial Grandeur', 'Classic European', 'Victorian Romance', 'Gatsby Era', 'Opulent Gold', 'Sapphire Dream', 'Emerald Prestige', 'Ruby Glamour', 'Pearl Essence', 'Silver Serenade', 'Gilded Age', 'Regal Splendor', 'Sovereign Love', 'Noble Heritage', 'Timeless Elegance', 'Chateau de Reve', 'Monarch Grace', 'Palais Royal'],
  Minimalist: ['Apple Inspired', 'Glassmorphism', 'Scandinavian', 'Clean Canvas', 'Whitespace Focus', 'Bauhaus Geometry', 'Modern Monochrome', 'Zen Garden', 'SaaS Landing Page', 'Nordic Light', 'Japandi Style', 'Pure Essence', 'Brutalist Echo', 'Soft Minimalism', 'Swiss Design', 'Airy Vibe', 'Floating Elements', 'Lucent Glass', 'Bare Elegance', 'Quiet Luxury', 'Subtle Touch', 'Linear Flow', 'Structured Space', 'Blank Slate', 'Matte Finish', 'Frost Glass', 'Sleek Modern'],
  Floral: ['Sakura Garden', 'Rose Garden', 'Lavender Field', 'Wildflower Meadow', 'Tropical Orchid', 'Peony Blossom', 'Sunflower Warmth', 'Daisy Morning', 'Lotus Pond', 'Cherry Blossom', 'Enchanted Forest', 'Secret Garden', 'Spring Awakening', 'Autumn Florals', 'Winter Bloom', 'Midnight Garden', 'Vintage Rose', 'Watercolor Petals', 'Botanical Sketch', 'Pressed Flowers', 'Fairy Garden', 'Romantic Bloom', 'Pastel Bouquet', 'Vibrant Flora', 'Desert Rose', 'Hanging Gardens'],
  Dark: ['Midnight Mystery', 'Obsidian Core', 'Deep Space', 'Neon Nights', 'Cyberpunk City', 'Dark Matter', 'Eclipse Shadow', 'Noir Film', 'Vampire Romance', 'Gothic Cathedral', 'Abyssal Depth', 'Starry Night', 'Velvet Dark', 'Charcoal Elegance', 'Matte Black', 'Dark Knight', 'Shadow Realm', 'Cosmic Dust', 'Lunar Eclipse', 'Phantom Grace', 'Dark Academia', 'Twilight Zone', 'Midnight Blue', 'Onyx Glamour'],
  Islamic: ['Arabian Luxury', 'Ottoman Palace', 'Modern Mosque', 'Andalusian Courtyard', 'Moorish Arches', 'Alhambra Nights', 'Golden Crescent', 'Desert Oasis', 'Geometric Patterns', 'Persian Carpet', 'Marrakech Riad', 'Casablanca Romance', 'Desert Sands', 'Sahara Sunset', 'Medina Walls', 'Kufic Art', 'Arabesque Flow', 'Star of David', 'Mecca Dawn', 'Sufi Soul', 'Silk Road'],
  Rustic: ['Rustic Charm', 'Barn Wedding', 'Vintage Lace', 'Country Road', 'Wooden Craft', 'Autumn Leaves', 'Mason Jar', 'Burlap Elegance', 'Forest Cabin', 'Mountain View', 'Pinecone Delight'],
  Tropical: ['Tropical Beach', 'Ocean Breeze', 'Palm Springs', 'Sunset Coast', 'Island Paradise', 'Coral Reef', 'Aloha Spirit', 'Caribbean Dream', 'Tiki Lounge', 'Summer Vibe'],
  General: ['Classic Romance', 'Retro Film', 'Vintage Postcard', 'Cinematic Love', 'Modern Classic']
};

const counters = {};

let md = `# Theme DNA Definitions\n\n`;
md += `This document defines the unique visual and structural DNA of every theme in the system. Each theme is distinct based on its Visual Identity, Animation, Typography, and Layout.\n\n`;

for (const theme of themes) {
  const cat = identityPools[theme.category] ? theme.category : 'General';
  
  if (!counters[cat]) counters[cat] = 0;
  
  const pool = identityPools[cat];
  const visualIdentity = pool[counters[cat] % pool.length] + (Math.floor(counters[cat] / pool.length) > 0 ? ` Vol. ${Math.floor(counters[cat] / pool.length) + 1}` : '');
  
  counters[cat]++;
  
  md += `### ${theme.id}\n`;
  md += `- **Visual Identity**: ${visualIdentity}\n`;
  md += `- **Category**: ${theme.category}\n`;
  md += `- **Animation Identity**: ${theme.animation}\n`;
  md += `- **Typography Identity**: ${theme.fonts}\n`;
  md += `- **Layout Identity**: ${theme.layout}\n\n`;
}

fs.writeFileSync(outPath, md, 'utf8');
console.log('✅ Generated ' + outPath);
