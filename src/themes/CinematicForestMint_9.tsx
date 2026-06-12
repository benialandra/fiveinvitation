import React from 'react';
import CinematicTheme, { CinematicConfig } from './CinematicTheme';

export default function CinematicForestMint_9({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'snow',
    colors: {
      bgBase: '#0f172a',
      bgMid: '#064e3b',
      bgLight: '#047857',
      primary: '#10b981',
      primaryHover: '#34d399',
      textMain: '#f0fdf4',
      textMuted: '#a7f3d0'
    },
    fonts: {
      heading: "'Dancing Script', serif",
      body: "'Poppins', sans-serif"
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
