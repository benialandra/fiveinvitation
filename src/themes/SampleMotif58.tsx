import React from 'react';
import MasterTheme from './MasterTheme';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function SampleMotif58({ data, guestName, lang = 'id' }: ThemeProps) {
  // Tema mockup ini menggunakan MasterTheme secara default
  return (
    <MasterTheme 
      groom={data?.groom_name || "Groom"} 
      bride={data?.bride_name || "Bride"} 
      date={data?.akad_date ? new Date(data.akad_date).toLocaleDateString() : "12 Dec 2026"}
      hero_image={data?.hero_image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop"}
      cover_image={data?.cover_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2000"}
      guestName={guestName}
      lang={lang}
      config_json={data?.config_json}
    />
  );
}
