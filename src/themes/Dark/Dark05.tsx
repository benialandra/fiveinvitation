import React from 'react';
import CinematicTheme, { CinematicConfig } from '../CinematicTheme';

export default function CinematicWinterFrost_9({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'snow',
    colors: {
      bgBase: '#f8fafc',
      bgMid: '#e2e8f0',
      bgLight: '#cbd5e1',
      primary: '#0284c7',
      primaryHover: '#0369a1',
      textMain: '#0f172a',
      textMuted: '#334155'
    },
    fonts: {
      heading: "'Lora', serif",
      body: "'Lato', sans-serif"
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
