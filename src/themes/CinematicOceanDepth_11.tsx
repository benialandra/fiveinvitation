import React from 'react';
import CinematicTheme, { CinematicConfig } from './CinematicTheme';

export default function CinematicOceanDepth_11({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'snow',
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
