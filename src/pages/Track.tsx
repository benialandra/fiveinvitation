import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import { CheckCircle2, Clock, Eye, AlertCircle, Search, ArrowRight, Loader2, RefreshCw, PartyPopper, Copy, Check, FileText, ExternalLink, Send } from 'lucide-react';
import { THEME_REGISTRY } from '../themes/registry';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import RippleButton from '../components/RippleButton';

export default function Track() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWAModal, setShowWAModal] = useState(false);
  const [waNumber, setWaNumber] = useState('');
  const [copied, setCopied] = useState(false);

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
      const response = await fetch(`/api/orders?orderCode=${orderCode}`);
      if (!response.ok) {
         setOrder(null);
      } else {
         const data = await response.json();
         setOrder(data);
      }
    } catch(e) {
      setOrder(null);
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
  if (!order) {
    return (
      <div className="flex-1 w-full py-12 md:py-24 bg-transparent animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto px-6">
          <div className={`rounded-[32px] p-8 md:p-12 border ${
            themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-2xl shadow-black/5'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Left Column: Creative Illustration */}
              <div className="relative flex items-center justify-center py-6">
                {/* Background Glow */}
                <div className="absolute w-64 h-64 rounded-full bg-red-500/10 dark:bg-red-500/5 blur-3xl -z-10" />
                <div className="absolute w-48 h-48 rounded-full bg-amber-500/10 dark:bg-[#C5A059]/5 blur-2xl -z-10 translate-x-12 translate-y-12" />
                
                {/* Interactive CSS/SVG Lost Invoice Illustration */}
                <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
                  {/* Outer Orbit Rings */}
                  <div className="absolute inset-0 border border-dashed border-gray-300/30 dark:border-white/10 rounded-full animate-[spin_40s_linear_infinite]" />
                  <div className="absolute inset-8 border border-dashed border-gray-300/40 dark:border-white/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
                  
                  {/* Magnifying Glass */}
                  <motion.div 
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute z-20 -right-4 -bottom-4 w-32 h-32 text-gray-400 dark:text-white/20 pointer-events-none"
                  >
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-lg">
                      <circle cx="45" cy="45" r="25" stroke="currentColor" strokeWidth="6" />
                      <line x1="62.5" y1="62.5" x2="88" y2="88" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                      {/* Highlight reflection */}
                      <path d="M30 30 A18 18 0 0 1 50 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-50" />
                    </svg>
                  </motion.div>

                  {/* Lost Document Sheet */}
                  <motion.div 
                    animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-48 h-60 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-5 flex flex-col justify-between relative"
                  >
                    {/* Glowing Accent Corner */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/10 rounded-bl-3xl border-b border-l border-red-500/20" />
                    
                    {/* Tiny Red Alert Badge */}
                    <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                      <AlertCircle className="w-4.5 h-4.5" />
                    </div>

                    {/* Dummy text lines representing lost invoice */}
                    <div className="space-y-3.5 flex-1">
                      <div className="h-4 w-28 bg-gray-200 dark:bg-white/10 rounded-md" />
                      <div className="h-3 w-36 bg-gray-200 dark:bg-white/5 rounded-md" />
                      <div className="h-3 w-20 bg-gray-200 dark:bg-white/5 rounded-md" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-white/5 rounded-md" />
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 dark:border-white/10 pt-4 mt-2">
                      <div className="h-3.5 w-14 bg-red-500/20 rounded-md" />
                      <div className="h-3.5 w-10 bg-gray-200 dark:bg-white/10 rounded-md" />
                    </div>
                  </motion.div>

                  {/* Floating sparkly dust particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [0.8, 1.2, 0.8], 
                        opacity: [0.3, 0.8, 0.3],
                        x: [0, Math.sin(i) * 15, 0],
                        y: [0, Math.cos(i) * 15, 0]
                      }}
                      transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute w-2.5 h-2.5 rounded-full bg-red-500/30"
                      style={{
                        top: `${20 + i * 12}%`,
                        left: `${15 + (i % 3) * 25}%`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Error Details and Form */}
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {lang === 'id' ? 'Tidak Ditemukan' : 'Not Found'}
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-gray-900 dark:text-white leading-tight">
                    {lang === 'id' ? 'Pesanan Tidak Terdaftar' : 'Order Not Registered'}
                  </h2>
                  <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed">
                    {lang === 'id' 
                      ? `Maaf, invoice "${orderCode}" tidak ditemukan di database kami. Ini bisa disebabkan kesalahan ketik atau order belum selesai dibuat.` 
                      : `Sorry, invoice "${orderCode}" was not found in our database. This might be due to a typo or incomplete checkout.`}
                  </p>
                </div>

                {/* Input Search Form */}
                <div className="p-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center shadow-inner">
                  <Search size={18} className="text-gray-400 dark:text-white/30 ml-3 shrink-0" />
                  <input 
                    type="text" 
                    placeholder={lang === 'id' ? 'Masukkan nomor invoice...' : 'Enter invoice number...'} 
                    className="flex-1 h-12 bg-transparent px-3 text-sm outline-none uppercase tracking-widest text-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                        navigate(`/track/${e.currentTarget.value.trim()}`);
                      }
                    }}
                  />
                  <button 
                    onClick={(e) => {
                      const val = (e.currentTarget.previousElementSibling as HTMLInputElement).value.trim();
                      if (val) navigate(`/track/${val}`);
                    }}
                    className="h-12 px-6 bg-[#C5A059] hover:bg-[#b08d4a] text-white rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer shrink-0"
                  >
                    {lang === 'id' ? 'Cari' : 'Search'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Link 
                    to="/track/search" 
                    className="w-full h-13 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center text-xs font-semibold uppercase tracking-widest transition-all text-gray-700 dark:text-white/80"
                  >
                    {lang === 'id' ? 'Kembali Melacak' : 'Back to Tracking'}
                  </Link>
                  <a 
                    href="https://wa.me/628123456789?text=Halo%20Admin,%20saya%20mengalami%20kendala%20saat%20melacak%20pesanan%20dengan%20kode%20invoice%20saya."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-13 rounded-xl bg-[#25D366] text-white hover:bg-[#128C7E] flex items-center justify-center text-xs font-semibold uppercase tracking-widest transition-all gap-2 shadow-md shadow-[#25D366]/15 cursor-pointer"
                  >
                    {lang === 'id' ? 'Hubungi Bantuan' : 'Contact Support'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success(lang === 'id' ? 'Link berhasil disalin!' : 'Link copied successfully!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 w-full py-12 md:py-20 animate-in fade-in bg-transparent duration-700">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* Top Row: Info cards side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Card 1: Payment Status Card */}
          <div className={`lg:col-span-3 rounded-[32px] p-8 md:p-10 border ${
            themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-xl shadow-black/5'
          } flex flex-col justify-between relative overflow-hidden`}>
            
            {/* Subtle background glow */}
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full ${order.status === 'PAID' ? 'bg-green-500/5' : 'bg-amber-500/5'} blur-3xl -z-10`} />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {order.status === 'PAID' ? (
                <div className="relative shrink-0">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20 shadow-[0_0_35px_rgba(34,197,94,0.15)] relative">
                    <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping opacity-25"></div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}>
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                  </div>
                  
                  {/* Confetti burst particles */}
                  {[...Array(12)].map((_, i) => {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 25 + Math.random() * 45;
                    return (
                      <motion.div
                        key={`confetti-${i}`}
                        initial={{ opacity: 1, scale: 0, x: '-50%', y: '-50%' }}
                        animate={{ 
                          opacity: [1, 1, 0], 
                          scale: [0, 1.2, 0.8], 
                          x: `calc(-50% + ${Math.cos(angle) * distance}px)`, 
                          y: `calc(-50% + ${Math.sin(angle) * distance}px)` 
                        }}
                        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 rounded-sm"
                        style={{ 
                          width: '5px', 
                          height: '5px',
                          background: ['#C5A059','#22c55e','#3b82f6','#f59e0b','#ec4899'][Math.floor(Math.random() * 5)] 
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-[0_0_35px_rgba(245,158,11,0.15)] relative shrink-0">
                  <div className="absolute inset-0 border border-amber-500/20 rounded-full animate-ping opacity-30" />
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                    <Clock className="w-8 h-8" />
                  </motion.div>
                </div>
              )}

              <div className="text-center sm:text-left space-y-2 flex-1">
                <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${
                  order.status === 'PAID' 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {order.status === 'PAID' ? (lang === 'id' ? 'Lunas' : 'Paid') : (lang === 'id' ? 'Tertunda' : 'Pending')}
                </span>
                
                <h1 className="font-serif text-2xl md:text-3xl font-light text-gray-900 dark:text-white leading-tight">
                  {order.status === 'PAID' 
                    ? (lang === 'id' ? 'Pembayaran Berhasil' : 'Payment Successful') 
                    : (lang === 'id' ? 'Menunggu Pembayaran' : 'Awaiting Payment')}
                </h1>
                
                <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed max-w-md">
                  {order.status === 'PAID'
                    ? (lang === 'id' ? 'Terima kasih atas kepercayaan Anda! Pembayaran Anda telah kami terima dan detail pesanan Anda kini siap dikelola.' : 'Thank you for your trust! We have received your payment and your invitation details are now ready to be configured.')
                    : (lang === 'id' ? 'Kami sedang menunggu pembayaran Anda. Silakan selesaikan pembayaran sesuai tagihan untuk mengaktifkan tautan undangan.' : 'We are waiting for your payment. Please complete the billing details to activate your digital invitation link.')}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-white/5 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-white/40 font-semibold uppercase tracking-wider">
                  {lang === 'id' ? 'KODE INVOICE:' : 'INVOICE CODE:'}
                </span>
                <span className="font-mono bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-lg text-sm text-gray-900 dark:text-white font-medium border border-gray-200/50 dark:border-white/5">
                  {order.unique_code}
                </span>
              </div>

              <RippleButton 
                onClick={fetchOrder}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white/80 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-transparent dark:border-white/5"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                {lang === 'id' ? 'Perbarui Status' : 'Refresh Status'}
              </RippleButton>
            </div>
          </div>

          {/* Card 2: Order Details */}
          <div className={`lg:col-span-2 rounded-[32px] p-8 md:p-10 border ${
            themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-xl shadow-black/5'
          } flex flex-col justify-between`}>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white font-serif tracking-wide border-b pb-3 border-gray-100 dark:border-white/5 mb-5 flex items-center gap-2">
                <PartyPopper size={16} className="text-[#C5A059]" />
                {lang === 'id' ? 'Ringkasan Pesanan' : 'Order Details'}
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-start text-sm">
                  <span className="text-gray-400 dark:text-white/40 shrink-0">{lang === 'id' ? 'Mempelai' : 'The Couple'}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right">
                    {order.groom_name} <span className="text-[#C5A059] mx-0.5">&</span> {order.bride_name}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 dark:text-white/40 shrink-0">{lang === 'id' ? 'Tema Pilihan' : 'Chosen Theme'}</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 text-xs font-medium">
                    {themeName}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 pt-2">
                  <span className="text-xs text-gray-400 dark:text-white/40 font-semibold uppercase tracking-wider">
                    {lang === 'id' ? 'Tautan Undangan Anda' : 'Your Invitation Link'}
                  </span>
                  <div className="p-1.5 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium text-gray-700 dark:text-white/70 overflow-hidden text-ellipsis whitespace-nowrap pl-2 select-all">
                      {fullUrl.replace(/^https?:\/\//, '')}
                    </span>
                    <button 
                      onClick={handleCopyLink}
                      className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-white/80 rounded-lg shrink-0 transition-colors cursor-pointer border border-transparent dark:border-white/5"
                      title={lang === 'id' ? 'Salin Link' : 'Copy Link'}
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 text-center">
              <Link to="/" className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-semibold uppercase tracking-widest">
                {lang === 'id' ? '← Kembali ke Beranda' : '← Back to Home'}
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Row: Steps (If Paid) or Awaiting Info (If Not Paid) */}
        {order.status === 'PAID' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white font-serif tracking-wide flex items-center gap-2">
                <PartyPopper size={20} className="text-[#C5A059]" />
                {lang === 'id' ? 'Langkah Selanjutnya' : 'What to Do Next'}
              </h2>
              <p className="text-xs text-gray-400 dark:text-white/40">
                {lang === 'id' ? 'Selesaikan 3 langkah mudah ini untuk menyebarkan undangan Anda' : 'Complete these 3 simple steps to share your invitation'}
              </p>
            </div>

            {/* Grid of 3 Steps Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1 Card */}
              <div className={`rounded-3xl p-6 border ${
                themeMode === 'dark' ? 'border-white/5 bg-[#111]/40' : 'border-gray-100 bg-white shadow-lg shadow-black/5'
              } flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#C5A059]/20`}>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/20 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 dark:text-white/30 font-bold uppercase tracking-widest">Langkah 1</span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{lang === 'id' ? 'Lengkapi Data' : 'Fill Invitation Data'}</h4>
                    <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">
                      {lang === 'id' 
                        ? 'Isi info mempelai, akad, resepsi, peta Google Maps, galeri foto, & rekening kado digital.' 
                        : 'Complete groom/bride profiles, wedding schedule, Google Maps coordinates, image gallery, & gifts details.'}
                    </p>
                  </div>
                </div>
                <div className="pt-6">
                  <Link 
                    to={`/edit-order/${order.unique_code}`}
                    className="w-full h-11 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl flex items-center justify-center text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    {lang === 'id' ? 'Isi Data Undangan' : 'Edit Wedding Data'}
                  </Link>
                </div>
              </div>

              {/* Step 2 Card */}
              <div className={`rounded-3xl p-6 border ${
                themeMode === 'dark' ? 'border-white/5 bg-[#111]/40' : 'border-gray-100 bg-white shadow-lg shadow-black/5'
              } flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#C5A059]/20`}>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-sm">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 dark:text-white/30 font-bold uppercase tracking-widest">Langkah 2</span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{lang === 'id' ? 'Tinjau Desain' : 'Live Preview'}</h4>
                    <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">
                      {lang === 'id' 
                        ? 'Tinjau hasil sementara undangan digital Anda secara live sesuai dengan data yang telah Anda lengkapi.' 
                        : 'View live preview of your invitation template populated with your saved wedding data.'}
                    </p>
                  </div>
                </div>
                <div className="pt-6">
                  <a 
                    href={`/invitation/${order.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-11 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span>{lang === 'id' ? 'Tinjau Live' : 'Open Preview'}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Step 3 Card */}
              <div className={`rounded-3xl p-6 border ${
                themeMode === 'dark' ? 'border-white/5 bg-[#111]/40' : 'border-gray-100 bg-white shadow-lg shadow-black/5'
              } flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#C5A059]/20`}>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center border border-[#25D366]/20 shadow-sm">
                    <Send className="w-5 h-5 translate-x-px" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 dark:text-white/30 font-bold uppercase tracking-widest">Langkah 3</span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{lang === 'id' ? 'Sebarkan Undangan' : 'Share Invitation'}</h4>
                    <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">
                      {lang === 'id' 
                        ? 'Gunakan asisten share WhatsApp kami untuk mengirim undangan otomatis lengkap dengan link ke para tamu.' 
                        : 'Use our WhatsApp sharing wizard to send invitations with direct guest links effortlessly.'}
                    </p>
                  </div>
                </div>
                <div className="pt-6">
                  <button 
                    onClick={() => setShowWAModal(true)}
                    className="w-full h-11 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition-colors shadow-sm shadow-[#25D366]/10 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'id' ? 'Kirim via WA' : 'Share WhatsApp'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Awaiting Payment Row (if status !== 'PAID') */
          <div className={`rounded-3xl p-6 md:p-8 border ${
            themeMode === 'dark' ? 'border-amber-500/10 bg-amber-500/5' : 'border-amber-200 bg-amber-50/50'
          } flex flex-col sm:flex-row items-start gap-4`}>
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h4 className="text-base font-bold text-amber-800 dark:text-amber-500">{lang === 'id' ? 'Detail Pembayaran Tertunda' : 'Payment Instruction'}</h4>
              <p className="text-sm text-amber-700/80 dark:text-amber-500/70 leading-relaxed">
                {lang === 'id' 
                  ? 'Silakan selesaikan pembayaran invoice melalui email/tampilan transaksi sebelumnya untuk mengaktifkan url undangan digital Anda.' 
                  : 'Please complete the invoice payment via the transaction view/email to activate your invitation URL.'}
              </p>
            </div>
          </div>
        )}

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
                    className="flex-1 h-12 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {lang === 'id' ? 'Kirim' : 'Send'}
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
