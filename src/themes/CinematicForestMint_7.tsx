import React from 'react';
import { Hero, BrideGroom, Countdown, Story, Gallery, RSVP, Gift } from '../../components/Theme';

export default function CinematicForestMint_7({ data, lang = 'id' }: any) {
  return (
    <div className="bg-[#0a1f15] text-[#e2ebd0] font-serif min-h-screen overflow-x-hidden selection:bg-current selection:text-white">
      <Hero 
        data={data} 
        lang={lang} 
        className="h-screen rounded-b-[4rem] shadow-2xl overflow-hidden" 
      />
      
      <div className="py-24 space-y-32">
        <Countdown 
          data={data} 
          lang={lang} 
          className="text-[#558661] drop-shadow-lg" 
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
          className="text-[#558661]" 
        />
      </div>
      
      <footer className="py-12 text-center opacity-60 text-sm tracking-widest uppercase">
        {lang === 'id' ? 'Terima Kasih' : 'Thank You'} <br/>
        {data?.groom_name || 'Groom'} & {data?.bride_name || 'Bride'}
      </footer>
    </div>
  );
}
