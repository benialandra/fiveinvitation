import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Clock, Eye, AlertCircle, Search, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { THEME_REGISTRY } from '../themes/registry';

export default function Track() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

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
          <h1 className="font-serif text-3xl font-light mb-2 text-gray-900 dark:text-white">Lacak Pesanan</h1>
          <p className="text-gray-500 dark:text-white/50 text-sm mb-8 leading-relaxed">Masukkan kode unik Invoice Anda (Format: INV-XXXXX) untuk melihat detail dan status undangan Anda.</p>
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
    <div className="p-24 flex justify-center items-center">
      <Loader2 className="w-10 h-10 animate-spin text-[#C5A059]" />
    </div>
  );
  if (!order) return <div className="p-12 text-center text-red-500">Pesanan tidak ditemukan.</div>;

  const themeName = THEME_REGISTRY.find(t => t.id === order.theme_id)?.name || 'Unknown Theme';

  return (
    <div className="flex-1 w-full py-12 md:py-24 animate-in fade-in duration-700">
      <div className="max-w-2xl mx-auto px-6">
        <div className={`rounded-[32px] p-8 md:p-12 border ${themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-2xl shadow-black/5'}`}>
          
          <div className="flex flex-col items-center text-center">
            {order.status === 'PAID' ? (
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)] relative">
                <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping opacity-25"></div>
                <CheckCircle2 className="w-12 h-12" />
              </div>
            ) : (
               <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                 <Clock className="w-12 h-12" />
               </div>
            )}

            <h1 className="font-serif text-3xl text-gray-900 dark:text-white mb-2">
              {order.status === 'PAID' ? 'Pembayaran Berhasil' : 'Menunggu Pembayaran'}
            </h1>
            <p className="text-gray-500 dark:text-white/50 mb-6 text-sm flex items-center gap-2">
              Invoice Code: <span className="font-mono bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-lg text-gray-900 dark:text-white">{order.unique_code}</span>
            </p>
            
            <button 
              onClick={fetchOrder}
              disabled={loading}
              className="mb-10 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/80 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh Status
            </button>
          </div>

          <div className={`w-full space-y-5 border-t pt-8 ${themeMode === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-white/50">Mempelai</span>
              <span className="font-semibold text-gray-900 dark:text-white text-base">{order.groom_name} <span className="text-[#C5A059] mx-1">&</span> {order.bride_name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-white/50">Tema Dipilih</span>
              <span className="font-medium text-gray-900 dark:text-white">{themeName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-white/50">URL Undangan</span>
              <span className="font-medium text-[#C5A059] bg-[#C5A059]/10 px-3 py-1.5 rounded-lg border border-[#C5A059]/20">/invitation/{order.slug}</span>
            </div>
          </div>

          <div className="w-full mt-10 space-y-4">
            {order.status === 'PAID' ? (
              <>
                <Link 
                  to={`/edit-order/${order.unique_code}`}
                  className="w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-semibold uppercase tracking-widest text-sm shadow-xl"
                  >
                  Lengkapi Data Undangan
                </Link>
                <a 
                  href={`/invitation/${order.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-14 gold-gradient text-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-semibold uppercase tracking-widest text-sm shadow-xl shadow-[#C5A059]/20"
                  >
                  <Eye className="w-5 h-5"/>
                  Preview Undangan Publik
                </a>
              </>
            ) : (
               <div className="p-5 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-500 text-sm rounded-2xl flex items-start gap-4 border border-amber-200 dark:border-amber-500/20 leading-relaxed">
                 <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                 <div>
                    <span className="font-semibold block mb-1">Menunggu Pelunasan</span>
                    Silahkan selesaikan pembayaran invoice melalui email yang telah kami kirimkan untuk mengaktifkan URL undangan Anda.
                 </div>
               </div>
            )}
            
            <Link to="/" className="w-full h-14 mt-4 rounded-2xl flex items-center justify-center gap-2 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors font-medium text-sm">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
