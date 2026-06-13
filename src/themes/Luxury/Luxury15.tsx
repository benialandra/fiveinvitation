import React from 'react';
import CinematicTheme, { CinematicConfig } from '../CinematicTheme';

export default function CinematicRoseGold_7({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'raindrops',
    colors: {
      bgBase: '#fffbf9',
      bgMid: '#ffe4e6',
      bgLight: '#fecdd3',
      primary: '#e11d48',
      primaryHover: '#be123c',
      textMain: '#4c0519',
      textMuted: '#881337'
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Plus Jakarta Sans', sans-serif"
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
