import React from 'react';
import CinematicTheme, { CinematicConfig } from '../CinematicTheme';

export default function CinematicMidnightGold_2({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'snow',
    colors: {
      bgBase: '#0a0f18',
      bgMid: '#121826',
      bgLight: '#1f2937',
      primary: '#fbbf24',
      primaryHover: '#f59e0b',
      textMain: '#f8fafc',
      textMuted: '#94a3b8'
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
