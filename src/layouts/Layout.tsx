import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun, MessageCircle, X, Mail, ArrowUp } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const [themeMode, setThemeMode] = useState<'light'|'dark'>('light');
  const [lang, setLang] = useState<'id'|'en'>('id');
  const [csOpen, setCsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.glass-card').forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (saved) {
      setThemeMode(saved);
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(isSystemDark ? 'dark' : 'light');
    }

    // Listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('app-theme')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app-theme', 'light');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-[#0A0A0B] text-gray-900 dark:text-[#E5E5E5] flex flex-col font-sans relative overflow-x-hidden">
      {themeMode === 'dark' && <div className="absolute inset-0 bg-noise pointer-events-none z-0"></div>}
      <nav className="fixed top-0 w-full h-20 px-6 md:px-12 flex items-center justify-between border-b border-black/5 dark:border-white/5 z-50 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group relative overflow-hidden p-2">
          <div className="w-10 h-10 border border-[#C5A059] rotate-45 flex items-center justify-center transition-all duration-500 group-hover:border-[#fcdb92] group-hover:shadow-[0_0_20px_#C5A059] relative overflow-hidden bg-transparent shrink-0">
            {/* Light sweep effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite] -skew-x-12 z-0" />
            <span className="-rotate-45 font-serif text-2xl font-bold text-[#C5A059] transition-colors duration-500 group-hover:text-[#fcdb92] group-hover:drop-shadow-[0_0_15px_#C5A059] relative z-10">V</span>
          </div>
          <span className="hidden lg:block font-serif text-2xl tracking-[0.2em] font-light transition-colors duration-500 group-hover:text-[#fcdb92] group-hover:drop-shadow-[0_0_10px_#C5A059]">FIVEINVITATION</span>
        </Link>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium dark:font-light">
          <Link to="/themes" className="hover:text-[#C5A059] transition-colors">{lang === 'id' ? 'Katalog Tema' : 'Themes'}</Link>
          <Link to="/track/search" className="hover:text-[#C5A059] transition-colors">{lang === 'id' ? 'Lacak Order' : 'Track Order'}</Link>
          <Link to="/socials" className="hover:text-[#C5A059] transition-colors">{lang === 'id' ? 'Sosial Media' : 'Socials'}</Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4 w-auto justify-end">
          <button 
             onClick={() => setLang(prev => prev === 'en' ? 'id' : 'en')} 
             className="text-[10px] font-bold uppercase tracking-widest w-12 h-8 rounded-full flex items-center justify-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {lang === 'id' ? (
               <><img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-4 h-3 object-cover rounded-sm" /> ID</>
            ) : (
               <><img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-4 h-3 object-cover rounded-sm" /> EN</>
            )}
          </button>
          <button 
             onClick={toggleTheme} 
             className="flex w-10 h-10 rounded-full items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
        <motion.div 
           className="absolute bottom-0 left-0 right-0 h-[2px] origin-left gold-gradient" 
           style={{ scaleX }}
        />
      </nav>

      <main className="flex-1 w-full flex flex-col relative z-10 pt-20">
        <Outlet context={{ lang, themeMode }} />
      </main>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/p6.png')] z-0"></div>
      
      {/* CS & Workflow Modal */}
      <AnimatePresence>
        {csOpen && (
          <motion.div
            key="cs-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setCsOpen(false); }}
          >
             <motion.div
               key="cs-modal"
               initial={{ opacity: 0, scale: 0.92, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.92, y: 20 }}
               transition={{ type: 'spring', stiffness: 300, damping: 28 }}
               className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 w-full max-w-lg rounded-[32px] p-8 relative shadow-2xl"
             >
               <button onClick={() => setCsOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <X size={20} className="text-gray-900 dark:text-white" />
               </button>
               
               <h3 className="font-serif text-3xl text-gray-900 dark:text-white mb-2">{lang === 'id' ? 'Pusat Bantuan' : 'Help Center'}</h3>
               <p className="text-gray-500 dark:text-white/60 text-sm mb-8">{lang === 'id' ? 'Panduan pemesanan dan dukungan pelanggan FiveInvitation.' : 'Ordering guide and customer support for FiveInvitation.'}</p>
               
               <div className="space-y-6 mb-8">
                 <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold mb-6">{lang === 'id' ? 'Alur Pemesanan' : 'Order Workflow'}</h4>
                    <div className="space-y-0">
                       {[
                         { step: 1, title: lang === 'id' ? 'Pilih Tema & Isi Data' : 'Select Theme & Enter Data', desc: lang === 'id' ? 'Pilih desain dan isi form detail mempelai.' : 'Choose design and fill wedding details.' },
                         { step: 2, title: lang === 'id' ? 'Pembayaran Instan' : 'Instant Payment', desc: lang === 'id' ? 'Selesaikan pembayaran dengan aman melalui berbagai metode yang tersedia.' : 'Complete your payment securely through various available methods.' },
                         { step: 3, title: lang === 'id' ? 'Undangan Terbit' : 'Invitation Published', desc: lang === 'id' ? 'Link undangan Anda langsung aktif dan siap disebar.' : 'Your link is instantly active and ready to share.' },
                       ].map(({ step, title, desc }, i, arr) => (
                         <motion.div
                           key={step}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
                           className="flex gap-4"
                         >
                           <div className="flex flex-col items-center">
                             <span className="w-7 h-7 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-xs text-[#C5A059] font-bold shrink-0">{step}</span>
                             {i < arr.length - 1 && <div className="w-[1px] h-8 bg-[#C5A059]/20 my-1" />}
                           </div>
                           <div className="pb-6">
                             <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                             <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{desc}</p>
                           </div>
                         </motion.div>
                       ))}
                    </div>
                 </div>
               </div>

               <div className="space-y-3">
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-colors">
                     <MessageCircle size={16} /> WhatsApp Support
                  </a>
                  <a href="mailto:support@fiveinvitation.com" className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-medium text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                     <Mail size={16} /> Email Support
                  </a>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
               key="scroll-top"
               initial={{ opacity: 0, scale: 0.5, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.5, y: 10 }}
               transition={{ type: 'spring', stiffness: 300, damping: 20 }}
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
            >
               <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button 
           whileHover={{ scale: 1.08 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => setCsOpen(true)}
           className="w-14 h-14 bg-[#C5A059] text-white rounded-full shadow-2xl shadow-[#C5A059]/30 flex items-center justify-center relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
           <MessageCircle size={24} className="relative z-10" />
        </motion.button>
      </div>
    </div>
  );
}
