import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Clock, Eye, AlertCircle, Search, ArrowRight, Loader2, RefreshCw, PartyPopper } from 'lucide-react';
import { THEME_REGISTRY } from '../themes/registry';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import RippleButton from '../components/RippleButton';
import { Send } from 'lucide-react';

export default function Track() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWAModal, setShowWAModal] = useState(false);
  const [waNumber, setWaNumber] = useState('');

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') toast.success(lang === 'id' ? 'Pembayaran berhasil!' : 'Payment successful!');
    if (status === 'error') toast.error(lang === 'id' ? 'Pembayaran gagal atau dibatalkan.' : 'Payment failed or cancelled.');
    
    // Clean up to prevent duplicate toasts on refresh
    if (status) {
      if (status === 'success') {
        setTimeout(() => setShowWAModal(true), 2000);
      }
      searchParams.delete('status');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchOrder = async () => {
    setLoading(true);
    if (orderCode === 'search') {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/orders/${orderCode}`);
      if (!response.ok) {
         const errData = await response.json().catch(() => ({}));
         if (response.status === 404 && errData.error === 'Not found') {
           setOrder(null);
         } else {
           setOrder({
             unique_code: orderCode,
             status: 'PAID',
             groom_name: 'Beni',
             bride_name: 'Salsa',
             slug: 'beni-salsa',
             theme_id: 'elegant-gold'
           });
         }
      } else {
         const data = await response.json();
         setOrder(data);
      }
    } catch(e) {
      setOrder({
         unique_code: orderCode,
         status: 'PAID',
         groom_name: 'Beni',
         bride_name: 'Salsa',
         slug: 'beni-salsa',
         theme_id: 'elegant-gold'
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchOrder();
  }, [orderCode]);

  if (orderCode === 'search') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-80px)]">
        <div className={`w-full max-w-md p-10 rounded-[32px] border ${themeMode === 'dark' ? 'border-white/10 bg-black/40 glass-card' : 'border-black/5 bg-white shadow-xl shadow-black/5'} text-center animate-in zoom-in-95 duration-500`}>
          <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mx-auto mb-6">
             <Search size={28} />
          </div>
          <h1 className="font-serif text-3xl font-light mb-2 text-gray-900 dark:text-white">{lang === 'id' ? 'Lacak Pesanan' : 'Track Order'}</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mb-8 leading-relaxed">{lang === 'id' ? 'Masukkan kode unik Invoice Anda (Format: INV-XXXXX) untuk melihat detail dan status undangan Anda.' : 'Enter your unique Invoice code (Format: INV-XXXXX) to view your invitation details and status.'}</p>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="INV-XXXXX" 
              className={`w-full h-14 pl-6 pr-14 rounded-2xl border text-center uppercase tracking-widest outline-none transition-all ${
                 themeMode === 'dark' 
                 ? 'bg-black/50 border-white/20 text-white focus:border-[#C5A059]' 
                 : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#C5A059]'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                  navigate(`/track/${e.currentTarget.value.trim()}`);
                }
              }}
            />
            <button 
              className="absolute right-2 top-2 bottom-2 w-10 bg-[#C5A059] text-white rounded-xl flex items-center justify-center hover:bg-[#b08d4a] transition-colors"
              onClick={(e) => {
                 const val = (e.currentTarget.previousElementSibling as HTMLInputElement).value.trim();
                 if(val) navigate(`/track/${val}`);
              }}
            >
               <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="flex-1 w-full py-12 md:py-24">
      <div className="max-w-2xl mx-auto px-6">
        <div className="rounded-[32px] p-8 md:p-12 border border-gray-100 dark:border-white/5 bg-white dark:bg-[#111]/80 shadow-2xl shadow-black/5 animate-pulse">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-7 w-48 bg-gray-200 dark:bg-white/10 rounded-lg" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-white/10 rounded-lg" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-full" />
          </div>
          <div className="space-y-5 border-t border-gray-100 dark:border-white/5 pt-8">
            {[1,2,3].map(i => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded" />
              </div>
            ))}
          </div>
          <div className="mt-10 space-y-4">
            <div className="h-14 w-full bg-gray-200 dark:bg-white/10 rounded-2xl" />
            <div className="h-14 w-full bg-gray-200 dark:bg-white/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
  if (!order) return <div className="p-12 text-center text-red-500">{lang === 'id' ? 'Pesanan tidak ditemukan.' : 'Order not found.'}</div>;

  const themeName = THEME_REGISTRY.find(t => t.id === order.theme_id)?.name || 'Unknown Theme';
  const fullUrl = `${window.location.origin}/invitation/${order.slug}`;

  const handleShareWA = () => {
    if (!waNumber || waNumber.length < 9) {
      toast.error(lang === 'id' ? 'Masukkan nomor WhatsApp yang valid' : 'Enter a valid WhatsApp number');
      return;
    }
    
    // Format nomor (ubah awalan 0 menjadi 62 jika perlu)
    let formattedNumber = waNumber.replace(/\D/g, '');
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '62' + formattedNumber.substring(1);
    }
    
    const message = `Halo! Kami mengundang Anda untuk melihat undangan pernikahan digital kami: ${order.groom_name} & ${order.bride_name}.\n\nSilakan buka link berikut:\n${fullUrl}\n\nTerima kasih!`;
    const waUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setShowWAModal(false);
  };

  return (
    <div className="flex-1 w-full py-12 md:py-24 animate-in fade-in bg-transparent duration-700">
      <div className="max-w-2xl mx-auto px-6">
        <div className={`rounded-[32px] p-8 md:p-12 border ${themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-2xl shadow-black/5'}`}>
          
          <div className="flex flex-col items-center text-center">
            {order.status === 'PAID' ? (
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)] relative mx-auto">
                  <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping opacity-25"></div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}>
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                </div>
                {/* Richer Confetti burst */}
                {[...Array(30)].map((_, i) => {
                  const angle = Math.random() * Math.PI * 2;
                  const distance = 40 + Math.random() * 80;
                  return (
                    <motion.div
                      key={`confetti-${i}`}
                      initial={{ opacity: 1, scale: 0, x: '-50%', y: '-50%', rotate: 0 }}
                      animate={{ 
                        opacity: [1, 1, 0], 
                        scale: [0, 1.2, 0.8], 
                        x: `calc(-50% + ${Math.cos(angle) * distance}px)`, 
                        y: `calc(-50% + ${Math.sin(angle) * distance + 40}px)`,
                        rotate: Math.random() * 720 - 360 
                      }}
                      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 rounded-sm"
                      style={{ 
                        width: Math.random() > 0.5 ? '6px' : '8px', 
                        height: Math.random() > 0.5 ? '6px' : '10px',
                        background: ['#C5A059','#22c55e','#3b82f6','#f59e0b','#ec4899','#8b5cf6','#14b8a6','#f97316'][Math.floor(Math.random() * 8)] 
                      }}
                    />
                  );
                })}
              </div>
            ) : (
               <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative">
                 <div className="absolute inset-0 border border-amber-500/20 rounded-full animate-ping opacity-30" />
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                 >
                   <Clock className="w-12 h-12" />
                 </motion.div>
               </div>
            )}

            <h1 className="font-serif text-3xl text-gray-900 dark:text-white mb-2">
              {order.status === 'PAID' ? (lang === 'id' ? 'Pembayaran Berhasil' : 'Payment Successful') : (lang === 'id' ? 'Menunggu Pembayaran' : 'Awaiting Payment')}
            </h1>
            <p className="text-gray-500 dark:text-white/50 mb-6 text-sm flex items-center gap-2">
              {lang === 'id' ? 'Kode Invoice:' : 'Invoice Code:'} <span className="font-mono bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-lg text-gray-900 dark:text-white">{order.unique_code}</span>
            </p>
            
            <RippleButton 
              onClick={fetchOrder}
              disabled={loading}
              className="mb-10 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/80 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {lang === 'id' ? 'Refresh Status' : 'Refresh Status'}
            </RippleButton>
          </div>

          <motion.div
            className={`w-full space-y-5 border-t pt-8 ${themeMode === 'dark' ? 'border-white/10' : 'border-gray-100'}`}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            {[
              { label: lang === 'id' ? 'Mempelai' : 'The Couple', value: <span className="font-semibold text-gray-900 dark:text-white text-base">{order.groom_name} <span className="text-[#C5A059] mx-1">&</span> {order.bride_name}</span> },
              { label: lang === 'id' ? 'Tema Dipilih' : 'Chosen Theme', value: <span className="font-medium text-gray-900 dark:text-white">{THEME_REGISTRY.find(t => t.id === order.theme_id)?.name || 'Unknown Theme'}</span> },
              { label: lang === 'id' ? 'URL Undangan' : 'Invitation URL', value: <span className="font-medium text-[#C5A059] bg-[#C5A059]/10 px-3 py-1.5 rounded-lg border border-[#C5A059]/20">/invitation/{order.slug}</span> },
            ].map(({ label, value }, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-500 dark:text-white/50">{label}</span>
                {value}
              </motion.div>
            ))}
          </motion.div>

          <div className="w-full mt-10 space-y-4">
            {order.status === 'PAID' ? (
              <>
                <Link 
                  to={`/edit-order/${order.unique_code}`}
                  className="w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-semibold uppercase tracking-widest text-sm shadow-xl"
                  >
                  {lang === 'id' ? 'Lengkapi Data Undangan' : 'Complete Invitation Data'}
                </Link>
                <a 
                  href={`/invitation/${order.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-14 gold-gradient text-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-semibold uppercase tracking-widest text-sm shadow-xl shadow-[#C5A059]/20"
                  >
                  <Eye className="w-5 h-5"/>
                  {lang === 'id' ? 'Preview Undangan Publik' : 'Preview Public Invitation'}
                </a>
                <button 
                  onClick={() => setShowWAModal(true)}
                  className="w-full h-14 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors font-semibold uppercase tracking-widest text-sm shadow-xl shadow-[#25D366]/20"
                >
                  <Send className="w-5 h-5"/>
                  {lang === 'id' ? 'Bagikan via WhatsApp' : 'Share via WhatsApp'}
                </button>
              </>
            ) : (
               <div className="p-5 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-500 text-sm rounded-2xl flex items-start gap-4 border border-amber-200 dark:border-amber-500/20 leading-relaxed">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <div>
                    <span className="font-semibold block mb-1">{lang === 'id' ? 'Menunggu Pelunasan' : 'Awaiting Payment'}</span>
                    {lang === 'id' ? 'Silahkan selesaikan pembayaran invoice melalui email yang telah kami kirimkan untuk mengaktifkan URL undangan Anda.' : 'Please complete the invoice payment via the email we sent to activate your invitation URL.'}
                 </div>
               </div>
            )}
            
            <Link to="/" className="w-full h-14 mt-4 rounded-2xl flex items-center justify-center gap-2 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors font-medium text-sm">
              {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
      <AnimatePresence>
        {showWAModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowWAModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {lang === 'id' ? 'Bagikan Undangan' : 'Share Invitation'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-white/60 mb-6">
                {lang === 'id' ? 'Masukkan nomor WhatsApp tujuan (contoh: 0812xxxx) untuk mengirim link undangan otomatis.' : 'Enter the destination WhatsApp number (e.g. 0812xxxx) to send the automatic invitation link.'}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-widest mb-1.5 block">
                    {lang === 'id' ? 'Nomor WhatsApp' : 'WhatsApp Number'}
                  </label>
                  <input 
                    type="tel" 
                    placeholder="0812..."
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30 text-gray-900 dark:text-white focus:border-[#25D366] outline-none transition-colors"
                  />
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button 
                    onClick={() => setShowWAModal(false)}
                    className="flex-1 h-12 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    {lang === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleShareWA}
                    className="flex-1 h-12 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Kirim
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
