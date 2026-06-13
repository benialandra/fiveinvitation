import React from 'react';
import CinematicTheme, { CinematicConfig } from '../CinematicTheme';

export default function CinematicSpringBlossom_7({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'raindrops',
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
      heading: "'Cormorant Garamond', serif",
      body: "'Source Sans Pro', sans-serif"
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
