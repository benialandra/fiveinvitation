const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../../src/themes/cinematic-variants');

const themesData = [
  { id: 2, name: 'GoldenTaupe', bg: 'bg-stone-900', text: 'text-stone-100', primary: 'text-yellow-600', font: 'font-serif' },
  { id: 3, name: 'MidnightOlive', bg: 'bg-zinc-950', text: 'text-zinc-200', primary: 'text-lime-600', font: 'font-mono' },
  { id: 4, name: 'RoyalMauve', bg: 'bg-slate-900', text: 'text-slate-100', primary: 'text-fuchsia-400', font: 'font-serif' },
  { id: 5, name: 'ElegantMist', bg: 'bg-neutral-50', text: 'text-neutral-900', primary: 'text-cyan-700', font: 'font-sans' },
  { id: 6, name: 'ClassicMonochrome', bg: 'bg-black', text: 'text-white', primary: 'text-gray-400', font: 'font-serif' },
  { id: 7, name: 'VintageSepia', bg: 'bg-[#2d1b10]', text: 'text-[#faf6f0]', primary: 'text-[#df9f28]', font: 'font-serif' },
  { id: 8, name: 'ModernMinimalist', bg: 'bg-white', text: 'text-black', primary: 'text-neutral-500', font: 'font-sans' },
  { id: 9, name: 'VelvetNight', bg: 'bg-[#1a0b1c]', text: 'text-[#fce4ff]', primary: 'text-[#d946ef]', font: 'font-serif' },
  { id: 10, name: 'EarthyTerracotta', bg: 'bg-[#2c1810]', text: 'text-[#fff1e6]', primary: 'text-[#ea580c]', font: 'font-serif' },
  { id: 11, name: 'OceanicPearl', bg: 'bg-slate-950', text: 'text-slate-100', primary: 'text-teal-400', font: 'font-serif' }
];

themesData.forEach(theme => {
  const fileContent = `import React from 'react';
import { Hero, BrideGroom, Countdown, Story, Gallery, RSVP, Gift } from '../../components/Theme';

export default function CinematicAutumnRustic_${theme.id}({ data, lang = 'id' }: any) {
  return (
    <div className="${theme.bg} ${theme.text} ${theme.font} min-h-screen overflow-x-hidden selection:bg-current selection:text-white">
      <Hero 
        data={data} 
        lang={lang} 
        className="h-screen rounded-b-[4rem] shadow-2xl overflow-hidden" 
      />
      
      <div className="py-24 space-y-32">
        <Countdown 
          data={data} 
          lang={lang} 
          className="${theme.primary} drop-shadow-lg" 
        />
        
        <BrideGroom 
          data={data} 
          lang={lang} 
          className="bg-white/5 mx-4 rounded-3xl backdrop-blur-sm border border-white/10" 
        />

        <Story 
          data={data} 
          lang={lang} 
          className="bg-white/5 mx-4 rounded-3xl backdrop-blur-sm border border-white/10" 
        />
        
        <Gallery 
          data={data} 
          lang={lang} 
        />
        
        <RSVP 
          data={data} 
          lang={lang} 
          className="max-w-2xl" 
        />
        
        <Gift 
          data={data} 
          lang={lang} 
          className="${theme.primary}" 
        />
      </div>
      
      <footer className="py-12 text-center opacity-60 text-sm tracking-widest uppercase">
        {lang === 'id' ? 'Terima Kasih' : 'Thank You'} <br/>
        {data?.groom_name || 'Groom'} & {data?.bride_name || 'Bride'}
      </footer>
    </div>
  );
}
`;

  const filePath = path.join(themesDir, `CinematicAutumnRustic_${theme.id}.tsx`);
  fs.writeFileSync(filePath, fileContent);
  console.log(`Created ${filePath}`);
});
