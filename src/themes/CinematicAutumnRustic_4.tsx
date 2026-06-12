import React from 'react';
import CinematicTheme, { CinematicConfig } from './CinematicTheme';

export default function CinematicAutumnRustic_4({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'sparkles',
    colors: {
      bgBase: '#1c1917',
      bgMid: '#292524',
      bgLight: '#44403c',
      primary: '#d97706',
      primaryHover: '#b45309',
      textMain: '#fafaf9',
      textMuted: '#d6d3d1'
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
