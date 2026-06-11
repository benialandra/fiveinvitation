import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent({ lang }: { lang: 'id' | 'en' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted or declined cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay before showing the banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto bg-white/95 dark:bg-[#111]/95 backdrop-blur-lg border border-black/10 dark:border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pointer-events-auto relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            
            <div className="flex-1 relative z-10">
              <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">
                {lang === 'id' ? 'Penggunaan Cookie' : 'Cookie Policy'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
                {lang === 'id' 
                  ? 'Kami menggunakan cookie untuk memastikan Anda mendapatkan pengalaman terbaik di situs web kami, seperti menyimpan preferensi tema dan bahasa Anda. Dengan melanjutkan, Anda menyetujui penggunaan cookie kami.' 
                  : 'We use cookies to ensure you get the best experience on our website, such as saving your theme and language preferences. By continuing to use this site, you agree to our use of cookies.'}
                {' '}
                <a href="/privacy" className="text-[#C5A059] hover:underline">
                  {lang === 'id' ? 'Pelajari lebih lanjut' : 'Learn more'}
                </a>.
              </p>
            </div>
            
            <div className="flex w-full md:w-auto items-center gap-3 relative z-10 shrink-0">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                {lang === 'id' ? 'Tolak' : 'Decline'}
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl gold-gradient text-black text-sm font-bold hover:opacity-90 transition-opacity"
              >
                {lang === 'id' ? 'Terima' : 'Accept'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
