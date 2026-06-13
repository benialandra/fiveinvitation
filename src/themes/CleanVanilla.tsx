import React from 'react';
import MasterTheme from './MasterTheme';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function CleanVanilla({ data, guestName, lang = 'id' }: ThemeProps) {
  // Tema mockup ini menggunakan MasterTheme secara default
  return (
    <MasterTheme 
      groom={data?.groom_name || "Groom"} 
      bride={data?.bride_name || "Bride"} 
      date={data?.akad_date ? new Date(data.akad_date).toLocaleDateString() : "12 Dec 2026"}
      hero_image={data?.hero_image || "https://elglmntxhbxrysewliqb.supabase.co/storage/v1/object/public/fiveinvitation-bucket/uploads/1780461197556_Screenshot2024-11-29205020.png"}
      cover_image={data?.cover_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=60&w=2000&fm=webp&q=60"}
      groom_image={data?.groom_image}
      bride_image={data?.bride_image}
      gallery_1={data?.gallery_1}
      gallery_2={data?.gallery_2}
      gallery_3={data?.gallery_3}
      gallery_4={data?.gallery_4}
      guestName={guestName}
      lang={lang}
      config_json={data?.config_json}
    />
  );
}
