import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { THEME_REGISTRY } from '../themes/registry';
import MasterTheme from '../themes/MasterTheme';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2, Smartphone, Tablet, Monitor } from 'lucide-react';
import { LazyMotion, domAnimation } from 'framer-motion';

export default function Preview() {
  const { themeId } = useParams();
  const [theme, setTheme] = useState<any>(THEME_REGISTRY.find(t => t.id === themeId));
  const [loading, setLoading] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'mobile'|'tablet'|'desktop'>('mobile');
  const [searchParams] = useSearchParams();
  const font = searchParams.get('font');
  const color = searchParams.get('color');

  useEffect(() => {
    const controller = new AbortController();
    const fetchTheme = async () => {
       try {
         const { data } = await supabase.from('themes').select('*').eq('id', themeId).abortSignal(controller.signal).maybeSingle();
         if (data) {
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

  const parsedConfig = typeof theme?.config_json === 'string' ? JSON.parse(theme.config_json) : (theme?.config_json || {});
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
  if (theme.config_json && themeId !== 'winter-romance') {
     content = <MasterTheme {...sampleProps} config_json={theme.config_json} hero_image={theme.thumbnail} />;
  } else {
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
        content = <div className="p-8 text-center">Komponen Tema tidak tersedia</div>;
     }
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
    <div className="w-full relative min-h-screen bg-gray-100/50 dark:bg-[#0A0A0B] flex flex-col items-center p-4 pt-20">
      <div className="fixed bottom-6 left-6 z-[100]">
        <Link 
          to="/themes" 
          className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black backdrop-blur text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>
      </div>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex gap-2 p-1.5 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 rounded-full shadow-lg">
          <button onClick={() => setDeviceMode('mobile')} className={`p-2 rounded-full transition-all duration-300 ${deviceMode === 'mobile' ? 'bg-[#C5A059] text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
             <Smartphone size={18} />
          </button>
          <button onClick={() => setDeviceMode('tablet')} className={`p-2 rounded-full transition-all duration-300 ${deviceMode === 'tablet' ? 'bg-[#C5A059] text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
             <Tablet size={18} />
          </button>
          <button onClick={() => setDeviceMode('desktop')} className={`p-2 rounded-full transition-all duration-300 ${deviceMode === 'desktop' ? 'bg-[#C5A059] text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
             <Monitor size={18} />
          </button>
      </div>

      <div className={`hidden xl:block absolute left-12 top-1/2 -translate-y-1/2 max-w-sm transition-opacity duration-300 ${deviceMode === 'mobile' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         <h2 className="text-3xl font-serif text-gray-900 dark:text-white mb-4">Live Preview</h2>
         <p className="text-gray-500 dark:text-white/60 mb-6">Nikmati pengalaman melihat desain undangan Anda secara langsung dengan tampilan yang responsif, menyerupai layar perangkat tamu undangan Anda.</p>
         <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
               <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">1</div>
               <span>Tampilan mobile-first yang elegan</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
               <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">2</div>
               <span>Akses cepat dan ringan</span>
            </div>
         </div>
      </div>

      {/* Device Frame styling */}
      <div 
        className={`bg-white relative overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          deviceMode === 'mobile' ? 'w-full max-w-[400px] h-[800px] max-h-[85vh] rounded-[40px] border-[8px] border-gray-900 dark:border-gray-800' :
          deviceMode === 'tablet' ? 'w-full max-w-[768px] h-[1024px] max-h-[85vh] rounded-[24px] border-[12px] border-gray-900 dark:border-gray-800' :
          'w-full max-w-[1280px] h-[800px] max-h-[85vh] rounded-[16px] border-[16px] border-gray-900 dark:border-gray-800'
        }`}
      >
          <div className="w-full h-full overflow-y-auto no-scrollbar relative">
             {customStyles}
             {content}
          </div>
      </div>
    </div>
  );
}
