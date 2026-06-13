const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../src/themes');

const palettes = [
  { name: 'Midnight Gold', bgBase: '#0a0f18', bgMid: '#121826', bgLight: '#1f2937', primary: '#fbbf24', primaryHover: '#f59e0b', textMain: '#f8fafc', textMuted: '#94a3b8' },
  { name: 'Spring Blossom', bgBase: '#fff0f5', bgMid: '#ffe4e1', bgLight: '#ffb6c1', primary: '#db2777', primaryHover: '#be185d', textMain: '#4c1d95', textMuted: '#831843' },
  { name: 'Forest Mint', bgBase: '#0f172a', bgMid: '#064e3b', bgLight: '#047857', primary: '#10b981', primaryHover: '#34d399', textMain: '#f0fdf4', textMuted: '#a7f3d0' },
  { name: 'Winter Frost', bgBase: '#f8fafc', bgMid: '#e2e8f0', bgLight: '#cbd5e1', primary: '#0284c7', primaryHover: '#0369a1', textMain: '#0f172a', textMuted: '#334155' },
  { name: 'Autumn Rustic', bgBase: '#1c1917', bgMid: '#292524', bgLight: '#44403c', primary: '#d97706', primaryHover: '#b45309', textMain: '#fafaf9', textMuted: '#d6d3d1' },
  { name: 'Regal Purple', bgBase: '#1e1b4b', bgMid: '#2e1065', bgLight: '#4c1d95', primary: '#c084fc', primaryHover: '#a855f7', textMain: '#f3e8ff', textMuted: '#d8b4fe' },
  { name: 'Rose Gold', bgBase: '#fffbf9', bgMid: '#ffe4e6', bgLight: '#fecdd3', primary: '#e11d48', primaryHover: '#be123c', textMain: '#4c0519', textMuted: '#881337' },
  { name: 'Ocean Depth', bgBase: '#083344', bgMid: '#0e7490', bgLight: '#0891b2', primary: '#22d3ee', primaryHover: '#67e8f9', textMain: '#ecfeff', textMuted: '#a5f3fc' },
];

const fontPairs = [
  { heading: 'Playfair Display', body: 'Plus Jakarta Sans' },
  { heading: 'Cinzel', body: 'Inter' },
  { heading: 'Lora', body: 'Lato' },
  { heading: 'Dancing Script', body: 'Poppins' },
  { heading: 'Great Vibes', body: 'Montserrat' },
  { heading: 'Merriweather', body: 'Open Sans' },
  { heading: 'Cormorant Garamond', body: 'Source Sans Pro' },
];

const particles = ['leaves', 'sakura', 'snow', 'sparkles', 'raindrops'];

const getFiles = (dir) => fs.readdirSync(dir).filter(f => f.startsWith('SampleMotif') && f.endsWith('.tsx'));

const files = getFiles(themesDir);

let count = 0;

for (const file of files) {
  const filePath = path.join(themesDir, file);
  const componentName = file.replace('.tsx', '');
  
  // Randomize config
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  const fontPair = fontPairs[Math.floor(Math.random() * fontPairs.length)];
  const particle = particles[Math.floor(Math.random() * particles.length)];
  
  const content = `import React from 'react';
import CinematicTheme, { CinematicConfig } from './CinematicTheme';

export default function ${componentName}({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: '${particle}',
    colors: {
      bgBase: '${palette.bgBase}',
      bgMid: '${palette.bgMid}',
      bgLight: '${palette.bgLight}',
      primary: '${palette.primary}',
      primaryHover: '${palette.primaryHover}',
      textMain: '${palette.textMain}',
      textMuted: '${palette.textMuted}'
    },
    fonts: {
      heading: "'${fontPair.heading}', serif",
      body: "'${fontPair.body}', sans-serif"
    }
  };

  return (
    <CinematicTheme 
      data={data} 
      guestName={guestName} 
      lang={lang} 
      config={uniqueConfig} 
    />
  );
}
`;

  fs.writeFileSync(filePath, content);
  count++;
}

console.log("Successfully transformed " + count + " SampleMotif files.");
