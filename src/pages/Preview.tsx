import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { THEME_REGISTRY } from '../themes/registry';
import MasterTheme from '../themes/MasterTheme';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2, Smartphone, Tablet, Monitor } from 'lucide-react';

export default function Preview() {
  const { themeId } = useParams();
  const [theme, setTheme] = useState<any>(THEME_REGISTRY.find(t => t.id === themeId));
  const [loading, setLoading] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'mobile'|'tablet'|'desktop'>('mobile');

  useEffect(() => {
    const fetchTheme = async () => {
       try {
         const { data } = await supabase.from('themes').select('*').eq('id', themeId).single();
         if (data) {
             // Merge with registry component if it exists
             const registryTheme = THEME_REGISTRY.find(t => t.id === themeId);
             setTheme({ ...registryTheme, ...data });
         }
       } catch (err) {
         console.error(err);
         // If fetch fails, we retain the initial state from THEME_REGISTRY
       } finally {
         setLoading(false);
       }
    };
    fetchTheme();
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
      akad_date: "2026-12-12T09:00:00Z"
    }
  };

  let content = null;
  if (theme.config_json) {
     content = <MasterTheme {...sampleProps} config_json={theme.config_json} hero_image={theme.thumbnail} />;
  } else {
     const ThemeComponent = theme.component;
     if (ThemeComponent) {
        content = <ThemeComponent {...sampleProps} />;
     } else {
        content = <div className="p-8 text-center">Komponen Tema tidak tersedia</div>;
     }
  }

  return (
    <div className="w-full relative min-h-screen bg-gray-100/50 dark:bg-[#0A0A0B] flex flex-col items-center p-4 pt-20">
      <div className="fixed top-4 left-4 z-[100]">
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
             {content}
          </div>
      </div>
    </div>
  );
}
