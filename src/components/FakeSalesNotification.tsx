import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { THEME_REGISTRY } from '../themes/registry';
import { ShoppingBag } from 'lucide-react';

const FAKE_NAMES = [
  'b***i', 'a***i', 's***a', 'd***s', 'r***a', 'm***a', 'k***n', 'l***a', 
  'i***n', 'b***a', 'f***r', 't***i', 'n***a', 'p***i', 'd***a', 'c***a',
  'j***o', 'e***o', 'g***a', 'h***i', 'y***i', 'v***a', 'w***i', 'z***a'
];

export default function FakeSalesNotification() {
  const location = useLocation();

  useEffect(() => {
    // Only show on home and themes page to avoid blocking forms
    if (location.pathname !== '/' && location.pathname !== '/themes') {
      return;
    }

    // Show a fake notification every 30 seconds
    const interval = setInterval(() => {
      // Pick a random name
      const randomName = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
      
      // Pick a random theme
      const randomTheme = THEME_REGISTRY[Math.floor(Math.random() * THEME_REGISTRY.length)]?.name || 'Tema Eksklusif';
      
      // Show toast
      toast.custom((t) => (
        <div
          onClick={() => toast.dismiss(t.id)}
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 overflow-hidden relative cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors`}
        >
          {/* Progress bar overlay */}
          <div 
             className="absolute bottom-0 left-0 h-1 bg-[#C5A059] transition-all"
             style={{ 
               width: '100%',
               animation: 'toast-progress 5s linear forwards'
             }}
          />
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes toast-progress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}} />
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Pesanan Baru! 🎉
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-white/60 leading-relaxed">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{randomName}</span> baru saja memesan <span className="italic text-[#C5A059]">{randomTheme}</span>
                </p>
                <p className="mt-1.5 text-xs text-gray-400 dark:text-white/40">
                  Beberapa detik yang lalu
                </p>
              </div>
            </div>
          </div>
        </div>
      ), { id: 'fake-order-toast', duration: 5000, position: 'bottom-center' });
      
      // Force dismiss after 5 seconds to prevent it getting stuck if user touches it (which pauses the timer)
      setTimeout(() => toast.dismiss('fake-order-toast'), 5000);
      
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
      toast.dismiss('fake-order-toast'); // Dismiss instantly if user navigates away
    };
  }, [location.pathname]);

  return null;
}
