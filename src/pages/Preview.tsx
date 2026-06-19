import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { THEME_REGISTRY } from '../themes/registry';
import MasterTheme from '../themes/MasterTheme';
import { supabase } from '../supabase/supabase';
import { ArrowLeft, Loader2, Smartphone, Tablet, Monitor } from 'lucide-react';
import { LazyMotion, domAnimation } from 'framer-motion';

export default function Preview() {
  const { themeId } = useParams();
  const [theme, setTheme] = useState<any>(THEME_REGISTRY.find(t => t.id === themeId));
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const font = searchParams.get('font');
  const color = searchParams.get('color');

  useEffect(() => {
    const controller = new AbortController();
    const fetchTheme = async () => {
       try {
         const res = await fetch(`/api/themes?id=${themeId}`, { signal: controller.signal });
         if (res.ok) {
             const data = await res.json();
             const registryTheme = THEME_REGISTRY.find(t => t.id === themeId);
             setTheme({ ...registryTheme, ...data, thumbnail: data.thumbnail || registryTheme?.thumbnail });
         }
       } catch (err: any) {
         if (err.name !== 'AbortError') console.error(err);
       } finally {
         setLoading(false);
       }
    };
    fetchTheme();
    return () => controller.abort();
  }, [themeId]);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0B]"><Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" /></div>;
  }

  if (!theme) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
        <h1 className="text-2xl font-bold mb-4">Tema tidak ditemukan</h1>
        <Link to="/themes" className="px-4 py-2 bg-black text-white rounded-full">Kembali ke Katalog</Link>
      </div>
    );
  }

  let parsedConfig: any = {};
  try {
    parsedConfig = typeof theme?.config_json === 'string' && theme.config_json.trim() ? JSON.parse(theme.config_json) : (theme?.config_json || {});
  } catch (e) {
    console.warn("Invalid config_json in Preview", e);
  }
  const customGallery = parsedConfig.gallery || [];

  // We should pass sample data to the theme
  const sampleProps = {
    groom: "Beni",
    bride: "Salsa",
    date: new Date("2026-12-12T09:00:00").toLocaleDateString(),
    location: "Hotel Mulia, Jakarta",
    quotes: "And among His signs is this, that He created for you mates from among yourselves...",
    data: {
      groom_name: "Beni",
      bride_name: "Salsa",
      groom_parents: "Bpk. Budi & Ibu Ani",
      bride_parents: "Bpk. Surya & Ibu Tari",
      akad_date: "2026-12-12T09:00:00Z",
      resepsi_date: "2026-12-12T11:00:00Z",
      location_name: "Grand Ballroom Hotel Mulia, Jl. Asia Afrika, Senayan, Jakarta",
      maps_link: "https://maps.google.com",
      story: "Kami bertemu di bangku kuliah, menjalin persahabatan, hingga akhirnya memutuskan untuk hidup bersama dalam ikatan suci.",
      cover_image: theme?.thumbnail || "https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=1200&fm=webp&q=60",
      hero_image: (customGallery.length > 0 ? customGallery[0] : null) || theme?.thumbnail || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=1200&fm=webp&q=60",
      gallery_1: customGallery[0] || null,
      gallery_2: customGallery[1] || null,
      gallery_3: customGallery[2] || null,
      gallery_4: customGallery[3] || null,
      gallery_5: customGallery[4] || null,
    }
  };

  let content = null;
  const ThemeComponent = theme.component;
  
  if (ThemeComponent) {
      content = (
        <React.Suspense fallback={<div className="h-full min-h-[500px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" /></div>}>
          <LazyMotion features={domAnimation}>
            <ThemeComponent {...sampleProps} />
          </LazyMotion>
        </React.Suspense>
      );
  } else {
      content = <MasterTheme {...sampleProps} config_json={parsedConfig} hero_image={theme.thumbnail} />;
  }

  let customStyles = null;
  const styles = [];
  if (font && font !== 'default') {
    styles.push(`@import url('https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}&display=swap');`);
    styles.push(`* { font-family: '${font}', serif !important; }`);
  }
  if (color && color !== 'default') {
    styles.push(`.text-\\[\\#C5A059\\] { color: ${color} !important; }`);
    styles.push(`.bg-\\[\\#C5A059\\] { background-color: ${color} !important; }`);
    styles.push(`.border-\\[\\#C5A059\\] { border-color: ${color} !important; }`);
    styles.push(`svg *[fill="#C5A059"] { fill: ${color} !important; }`);
    styles.push(`svg *[stroke="#C5A059"] { stroke: ${color} !important; }`);
  }
  if (styles.length > 0) {
    customStyles = <style dangerouslySetInnerHTML={{ __html: styles.join('\n') }} />;
  }

  return (
      <div className="w-full h-[100vh] overflow-y-auto no-scrollbar relative bg-white">
         {customStyles}
         {content}
      </div>
  );
}
