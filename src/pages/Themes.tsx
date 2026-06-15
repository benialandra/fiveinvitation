import React, { useState, useMemo } from 'react';
import { THEME_REGISTRY, ThemeCategory } from '../themes/registry';
import { useOutletContext, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, ShoppingCart, ArrowUpDown } from 'lucide-react';
import RippleLink from '../components/RippleLink';

function ThemeSkeleton() {
  return (
    <div className="bg-white dark:bg-black/40 rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/5] bg-gray-200 dark:bg-white/10" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
          <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function Themes() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ThemeCategory | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

  const [dbThemes, setDbThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
     fetch('/api/themes')
       .then(res => res.json())
       .then(data => {
          if (Array.isArray(data) && data.length > 0) {
             setDbThemes(data);
          }
       })
       .catch(err => console.error("Failed to fetch themes", err))
       .finally(() => setLoading(false));
  }, []);

  const uploadedThemes = useMemo(() => {
    try {
      const stored = localStorage.getItem('uploadedThemes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const baseThemes = useMemo(() => {
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
  }, [uploadedThemes, dbThemes]);

  const filteredThemes = useMemo(() => {
    let result = baseThemes.filter(theme => {
      const themeName = theme.name || 'Unknown Theme';
      const matchSearch = themeName.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || theme.category === category;
      return matchSearch && matchCategory;
    });
    
    result.sort((a, b) => {
      const nameA = a.name || 'Unknown Theme';
      const nameB = b.name || 'Unknown Theme';
      if (sortOrder === 'asc') return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });
    
    return result;
  }, [baseThemes, search, category, sortOrder]);

  const totalPages = Math.ceil(filteredThemes.length / itemsPerPage);
  const paginatedThemes = filteredThemes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sortOrder]);

  const categories: (ThemeCategory | 'All')[] = ['All', 'Elegant', 'Dark', 'Minimalist', 'Islamic', 'Floral'];
  const categoryLabels: Record<string, string> = {
    All: lang === 'id' ? 'Semua' : 'All',
    Elegant: 'Elegant', Dark: 'Dark', Minimalist: 'Minimalist', Islamic: 'Islamic', Floral: 'Floral'
  };

  return (
    <div className="w-full min-h-screen bg-transparent py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight font-serif mb-4">
             {lang === 'id' ? 'Katalog Tema' : 'Theme Catalog'}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
             {lang === 'id' ? 'Pilih desain undangan pernikahan yang merepresentasikan cinta Anda. Setiap tema dapat diakses secara eksklusif.' : 'Choose a wedding invitation design that represents your love. Every theme is exclusively accessible.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6 mb-12"
        >
          {/* Search bar */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={lang === 'id' ? 'Cari tema...' : 'Search themes...'} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 dark:text-white outline-none focus:border-[#C5A059] transition-colors"
            />
          </div>
          
          {/* Dropdown Category Filter & Sort */}
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-48 relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ThemeCategory | 'All')}
                className="w-full h-12 pl-4 pr-10 appearance-none rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 dark:text-white outline-none focus:border-[#C5A059] transition-colors cursor-pointer text-sm font-medium"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="text-gray-900">
                    {categoryLabels[cat]}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="h-12 px-4 flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 dark:text-white hover:border-[#C5A059] transition-colors"
              title={lang === 'id' ? 'Urutkan Nama' : 'Sort Name'}
            >
              <ArrowUpDown size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium hidden sm:block">
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </span>
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <ThemeSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div 
            variants={{
               hidden: { opacity: 0 },
               show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {paginatedThemes.map((theme) => (
                <motion.div 
                  key={theme.id}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.98 }}
                  variants={{
                    hidden: { opacity: 0, y: 15, scale: 0.98 },
                    show: { opacity: 1, y: 0, scale: 1 }
                  }}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeOut"
                  }}
                  className="group bg-white dark:bg-black/40 rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden flex flex-col hover:shadow-xl dark:hover:shadow-[#C5A059]/10 transition-all duration-300"
                >
                  <div className="w-full aspect-[4/5] bg-gray-100 dark:bg-gray-900 overflow-hidden relative group/image active:scale-[0.98] transition-transform duration-200 cursor-pointer">
                    <Link to={`/preview/${theme.id}`} className="block w-full h-full">
                      <img 
                        src={theme.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60'} 
                        alt={theme.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                        className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 pointer-events-none" />
                    </Link>
                    
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                      <span className="px-3 py-1 bg-white/95 dark:bg-black/90 text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm text-gray-900 dark:text-white border border-black/5 dark:border-white/10">
                        {theme.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 shrink-0 opacity-100 translate-y-0 lg:opacity-0 lg:group-hover/image:opacity-100 lg:translate-y-4 lg:group-hover/image:translate-y-0 transition-all duration-300 z-20">
                        <RippleLink 
                          to={`/preview/${theme.id}`}
                          target="_blank"
                          rel="noopener"
                          className="flex-1 h-10 flex items-center justify-center rounded-xl border border-white/20 bg-black/60 text-white hover:bg-black/80 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                          Preview
                        </RippleLink>
                        <RippleLink 
                          to={`/order/${theme.id}`}
                          className="flex-1 h-10 flex items-center justify-center bg-[#C5A059] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#b08d4a] transition-colors shadow-lg shadow-black/20"
                        >
                          {lang === 'id' ? 'Pesan' : 'Order'}
                        </RippleLink>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{theme.name}</h3>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1.5" title={lang === 'id' ? 'Dilihat' : 'Views'}><Eye size={14} /> {(theme.id?.length || 5) * 142}</span>
                      <span className="flex items-center gap-1.5" title={lang === 'id' ? 'Terjual' : 'Sold'}><ShoppingCart size={14} /> {(theme.id?.length || 5) * 23}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                      <span className="font-bold text-[#C5A059] text-[15px]">
                        Rp {(theme.price || 149000).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredThemes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-4"
          >
            <Search size={40} className="opacity-30" />
            <p>{lang === 'id' ? 'Tidak ada tema yang cocok dengan pencarian Anda.' : 'No themes match your search.'}</p>
          </motion.div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button 
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {lang === 'id' ? 'Seb.' : 'Prev'}
            </button>
            
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {lang === 'id' ? 'Halaman' : 'Page'} {currentPage} {lang === 'id' ? 'dari' : 'of'} {totalPages}
            </span>

            <button 
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {lang === 'id' ? 'Lanjut' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
