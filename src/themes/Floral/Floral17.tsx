import React from 'react';
import CinematicTheme, { CinematicConfig } from '../CinematicTheme';

export default function CinematicRegalPurple_7({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'sparkles',
    colors: {
      bgBase: '#1e1b4b',
      bgMid: '#2e1065',
      bgLight: '#4c1d95',
      primary: '#c084fc',
      primaryHover: '#a855f7',
      textMain: '#f3e8ff',
      textMuted: '#d8b4fe'
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
