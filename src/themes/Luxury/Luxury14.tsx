import React from 'react';
import CinematicTheme, { CinematicConfig } from '../CinematicTheme';

export default function CinematicSpringBlossom_12({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'sparkles',
    colors: {
      bgBase: '#fff0f5',
      bgMid: '#ffe4e1',
      bgLight: '#ffb6c1',
      primary: '#db2777',
      primaryHover: '#be185d',
      textMain: '#4c1d95',
      textMuted: '#831843'
    },
    fonts: {
      heading: "'Cinzel', serif",
      body: "'Inter', sans-serif"
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
