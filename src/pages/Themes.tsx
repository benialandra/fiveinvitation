import React, { useState, useMemo } from 'react';
import { THEME_REGISTRY, ThemeCategory } from '../themes/registry';
import { Link, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Eye, ShoppingCart, ExternalLink } from 'lucide-react';

export default function Themes() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ThemeCategory | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(12);
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

  const [dbThemes, setDbThemes] = useState<any[]>([]);

  React.useEffect(() => {
     fetch('/api/themes')
       .then(res => res.json())
       .then(data => {
          if (Array.isArray(data) && data.length > 0) {
             setDbThemes(data);
          }
       })
       .catch(err => console.error("Failed to fetch themes", err));
  }, []);

  const uploadedThemes = useMemo(() => {
    try {
      const stored = localStorage.getItem('uploadedThemes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const filteredThemes = useMemo(() => {
    const baseThemes = (() => {
      const map = new Map();
      [...THEME_REGISTRY, ...uploadedThemes].forEach(t => map.set(t.id, t));
      dbThemes.forEach(dbT => {
        const existing = map.get(dbT.id) || {};
        map.set(dbT.id, { 
           ...existing, 
           ...dbT, 
           thumbnail: dbT.thumbnail || existing.thumbnail 
        });
      });
      return Array.from(map.values());
    })();
    return baseThemes.filter(theme => {
      const matchSearch = theme.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || theme.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category, uploadedThemes, dbThemes]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const categories: (ThemeCategory | 'All')[] = ['All', 'Elegant', 'Dark', 'Minimalist', 'Islamic', 'Floral'];

  return (
    <div className="w-full min-h-screen bg-transparent py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight font-serif mb-4">
             {lang === 'id' ? 'Katalog Tema' : 'Theme Catalog'}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
             {lang === 'id' ? 'Pilih desain undangan pernikahan yang merepresentasikan cinta Anda. Setiap tema dapat diakses secara eksklusif.' : 'Choose a wedding invitation design that represents your love. Every theme is exclusively accessible.'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={lang === 'id' ? 'Cari tema...' : 'Search themes...'} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 dark:text-white outline-none focus:border-[#C5A059] transition-colors"
            />
          </div>
          
          {/* Dropdown category */}
          <div className="relative min-w-[200px]">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as ThemeCategory | 'All')}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 dark:text-white outline-none appearance-none focus:border-[#C5A059] transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? (lang === 'id' ? 'Semua Kategori' : 'All Categories') : cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        <motion.div 
          layout
          variants={{
             hidden: { opacity: 0 },
             show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredThemes.slice(0, visibleCount).map((theme) => (
              <motion.div 
                layout
                key={theme.id}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="group bg-white dark:bg-black/40 rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden flex flex-col hover:shadow-xl dark:hover:shadow-[#C5A059]/10 transition-all duration-300"
              >
                <div className="w-full aspect-[4/5] bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                  <img 
                    src={theme.thumbnail} 
                    alt={theme.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm text-gray-900 dark:text-white border border-black/5 dark:border-white/10">
                      {theme.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{theme.name}</h3>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5" title={lang === 'id' ? 'Dilihat' : 'Views'}><Eye size={14} /> {theme.id.length * 142}</span>
                    <span className="flex items-center gap-1.5" title={lang === 'id' ? 'Terjual' : 'Sold'}><ShoppingCart size={14} /> {theme.id.length * 23}</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                    <span className="font-bold text-[#C5A059] whitespace-nowrap text-[13px] sm:text-sm">
                      Rp {theme.price.toLocaleString('id-ID')}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link 
                        to={`/preview/${theme.id}`}
                        target="_blank"
                        rel="noopener"
                        className="px-2 sm:px-3 h-8 sm:h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
                      >
                        Preview
                      </Link>
                      <Link 
                        to={`/order/${theme.id}`}
                        className="px-3 sm:px-4 h-8 sm:h-9 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-[#C5A059] dark:hover:bg-gray-200 transition-colors whitespace-nowrap"
                      >
                        {lang === 'id' ? 'Pesan' : 'Order'}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredThemes.length === 0 && (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">
            {lang === 'id' ? 'Tidak ada tema yang cocok dengan pencarian Anda.' : 'No themes match your search.'}
          </div>
        )}

        {visibleCount < filteredThemes.length && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={loadMore}
              className="px-8 py-3 rounded-full border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              {lang === 'id' ? 'Muat Lebih Banyak' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
