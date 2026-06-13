import React from 'react';
import CinematicTheme, { CinematicConfig } from './CinematicTheme';

export default function CinematicRegalPurple_4({ data, guestName, lang = 'id' }: any) {
  const uniqueConfig: CinematicConfig = {
    particleType: 'leaves',
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
