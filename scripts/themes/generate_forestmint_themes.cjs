const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../../src/themes/cinematic-variants');

const themesData = [
  { id: 2, name: 'EmeraldGold', bg: 'bg-emerald-950', text: 'text-emerald-50', primary: 'text-yellow-500', font: 'font-serif' },
  { id: 3, name: 'SageWhisper', bg: 'bg-[#d3dfd8]', text: 'text-neutral-900', primary: 'text-emerald-800', font: 'font-serif' },
  { id: 4, name: 'DeepTeal', bg: 'bg-teal-950', text: 'text-teal-50', primary: 'text-cyan-400', font: 'font-sans' },
  { id: 5, name: 'MintFrost', bg: 'bg-[#ebfbf3]', text: 'text-slate-800', primary: 'text-teal-600', font: 'font-sans' },
  { id: 6, name: 'PineSilver', bg: 'bg-[#102a20]', text: 'text-slate-200', primary: 'text-slate-400', font: 'font-serif' },
  { id: 7, name: 'ForestVelvet', bg: 'bg-[#0a1f15]', text: 'text-[#e2ebd0]', primary: 'text-[#558661]', font: 'font-serif' },
  { id: 8, name: 'OliveMist', bg: 'bg-[#404c40]', text: 'text-[#e6f0e6]', primary: 'text-[#a1d99b]', font: 'font-serif' },
  { id: 9, name: 'JadeGlow', bg: 'bg-[#002f23]', text: 'text-emerald-50', primary: 'text-emerald-400', font: 'font-serif' },
  { id: 10, name: 'SeafoamLuxury', bg: 'bg-[#e0f2ed]', text: 'text-[#1a3832]', primary: 'text-[#277861]', font: 'font-sans' },
  { id: 11, name: 'MalachiteDream', bg: 'bg-[#00170a]', text: 'text-[#dcfce7]', primary: 'text-[#22c55e]', font: 'font-serif' }
];

themesData.forEach(theme => {
  const fileContent = `import React from 'react';
import { Hero, BrideGroom, Countdown, Story, Gallery, RSVP, Gift } from '../../components/Theme';

export default function CinematicForestMint_${theme.id}({ data, lang = 'id' }: any) {
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

  const filePath = path.join(themesDir, `CinematicForestMint_${theme.id}.tsx`);
  fs.writeFileSync(filePath, fileContent);
  console.log(`Created ${filePath}`);
});
