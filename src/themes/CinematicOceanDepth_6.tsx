import React from 'react';
import CinematicTheme, { CinematicConfig } from './CinematicTheme';

export default function CinematicOceanDepth_6({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'sakura',
    colors: {
      bgBase: '#083344',
      bgMid: '#0e7490',
      bgLight: '#0891b2',
      primary: '#22d3ee',
      primaryHover: '#67e8f9',
      textMain: '#ecfeff',
      textMuted: '#a5f3fc'
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
