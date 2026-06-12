import React from 'react';
import CinematicTheme, { CinematicConfig } from './CinematicTheme';

export default function CinematicForestMint_4({ data, guestName, lang = 'id' }: any) {
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
      heading: "'Merriweather', serif",
      body: "'Open Sans', sans-serif"
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
