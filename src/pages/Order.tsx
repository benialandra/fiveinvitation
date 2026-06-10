import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { THEME_REGISTRY } from '../themes/registry';
import { generateOrderCode } from '../lib/utils';
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Floating label input component
function FloatingInput({ id, label, type = 'text', required = false, value, onChange, placeholder = ' ', min }: {
  id: string; label: string; type?: string; required?: boolean; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; min?: string;
}) {
  return (
    <div className="relative group">
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="peer w-full px-4 pt-6 pb-2 h-14 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/30 text-gray-900 dark:text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-[10px] font-semibold uppercase tracking-widest text-[#C5A059] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-gray-400 peer-placeholder-shown:uppercase-none peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#C5A059]"
      >
        {label}
      </label>
    </div>
  );
}


const useScript = (url: string) => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, [url]);
};

export default function Order() {
  const { themeId } = useParams();
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();
  const [theme, setTheme] = useState(THEME_REGISTRY.find(t => t.id === themeId));
  const navigate = useNavigate();
  
  React.useEffect(() => {
     fetch('/api/themes')
       .then(res => res.json())
       .then(data => {
          if (Array.isArray(data) && data.length > 0) {
             const dbTheme = data.find(t => t.id === themeId);
             if (dbTheme) setTheme(dbTheme);
          }
       })
       .catch(err => console.error(err));
  }, [themeId]);

  // Midtrans snap script sandbox
  useScript('https://app.sandbox.midtrans.com/snap/snap.js');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    groom_name: '',
    bride_name: '',
    akad_date: '',
    email: '',
    slug: ''
  });

  if (!theme) return <div className="p-12 text-center text-gray-500">{lang === 'id' ? 'Tema tidak ditemukan.' : 'Theme not found.'}</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const orderCode = generateOrderCode();
      
      let slugVal = formData.slug;
      if (!slugVal) {
         const baseSlug = `${formData.groom_name}-${formData.bride_name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'invitation';
         const randomSuffix = Math.random().toString(36).substring(2, 6);
         slugVal = `${baseSlug}-${randomSuffix}`;
      }
      
      // 1. Send all data to backend (Express) to create order & Midtrans token
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderCode,
          gross_amount: theme.price,
          first_name: formData.groom_name,
          email: formData.email,
          groom_name: formData.groom_name,
          bride_name: formData.bride_name,
          theme_id: theme.id,
          akad_date: formData.akad_date ? new Date(formData.akad_date).toISOString() : null,
          slug: slugVal
        })
      });
      
      const payload = await res.json();
      
      if (!res.ok) {
        toast.error(payload.error || (lang === 'id' ? "Gagal memproses pesanan." : "Failed to process order."));
        setErrorMessage(payload.error || (lang === 'id' ? "Gagal memproses pesanan. Silakan periksa kembali data Anda." : "Failed to process order. Please check your data."));
        setLoading(false);
        return;
      }
      
      const { token } = payload;
      toast.success(lang === 'id' ? 'Pesanan berhasil dibuat! Menunggu pembayaran...' : 'Order created! Waiting for payment...');
      
      // 2. We now rely completely on the backend to store data into Google Sheets
      // instead of using Supabase here.

      // 3. Trigger Midtrans Popup
      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        window.snap.pay(token, {
          onSuccess: function(result: any){
            navigate(`/track/${orderCode}?status=success`);
          },
          onPending: function(result: any){
            navigate(`/track/${orderCode}?status=pending`);
          },
          onError: function(result: any){
            navigate(`/track/${orderCode}?status=error`);
          },
          onClose: function(){
            navigate(`/track/${orderCode}?status=closed`);
          }
        });
      } else {
        toast.error(lang === 'id' ? "Gagal memuat sistem pembayaran" : "Failed to load payment system");
        setErrorMessage(lang === 'id' ? "Gagal memuat sistem pembayaran" : "Payment system not loaded");
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || (lang === 'id' ? "Terjadi kesalahan. Pastikan backend berjalan." : "An error occurred."));
      setErrorMessage(lang === 'id' ? "Terjadi kesalahan. Pastikan backend berjalan." : "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent py-12">
      <div className="max-w-6xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {lang === 'id' ? 'Kembali' : 'Back'}
        </button>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3 text-sm overflow-hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p>{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           {/* Bagian Kiri: Ringkasan Pesanan */}
           <div className="lg:col-span-5 bg-white dark:bg-[#111] rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-[0_0_20px_rgba(255,255,255,0.02)] sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-black/5 dark:border-white/10 pb-4">
                 {lang === 'id' ? 'Ringkasan Pesanan' : 'Order Summary'}
              </h2>
              <div className="aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-black/50 overflow-hidden mb-6 relative group">
                 {/* Asumsi theme.image ada, atau gunakan placeholder */}
                 <img src={(theme as any).image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"} alt={theme.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                    <div>
                       <span className="text-xs uppercase tracking-widest text-[#C5A059] mb-1 font-semibold block">{lang === 'id' ? 'Pilihan Anda' : 'Your Choice'}</span>
                       <span className="text-white font-serif text-2xl">{theme.name}</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Kategori Tema' : 'Theme Category'}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{(theme as any).category || 'Premium Design'}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Masa Aktif' : 'Active Period'}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{lang === 'id' ? 'Selamanya (Lifetime)' : 'Lifetime'}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Revisi Data' : 'Data Revision'}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{lang === 'id' ? 'Unlimited' : 'Unlimited'}</span>
                 </div>
              </div>
              <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10 flex justify-between items-end">
                 <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Total Biaya' : 'Total Cost'}</span>
                 <span className="text-3xl font-bold text-rose-600">Rp {theme.price.toLocaleString('id-ID')}</span>
              </div>
           </div>

           {/* Bagian Kanan: Form Data */}
           <div className="lg:col-span-7 bg-white dark:bg-[#111] rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-black/5 dark:border-white/10 pb-4">
                 {lang === 'id' ? 'Informasi & Pembayaran' : 'Information & Payment'}
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. {lang === 'id' ? 'Data Pemesan & Mempelai' : 'Customer & Couple Data'}</h2>
                
                <FloatingInput
                  id="email"
                  label={lang === 'id' ? 'Email Pemesan' : 'Customer Email'}
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    id="groom"
                    label={lang === 'id' ? 'Nama Panggilan Pria' : 'Groom Nickname'}
                    required
                    value={formData.groom_name}
                    onChange={e => setFormData({...formData, groom_name: e.target.value})}
                  />
                  <FloatingInput
                    id="bride"
                    label={lang === 'id' ? 'Nama Panggilan Wanita' : 'Bride Nickname'}
                    required
                    value={formData.bride_name}
                    onChange={e => setFormData({...formData, bride_name: e.target.value})}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. {lang === 'id' ? 'Data Acara' : 'Event Data'}</h2>
                  <FloatingInput
                    id="akad_date"
                    label={lang === 'id' ? 'Tanggal Akad' : 'Matrimony Date'}
                    type="datetime-local"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    value={formData.akad_date}
                    onChange={e => setFormData({...formData, akad_date: e.target.value})}
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. {lang === 'id' ? 'URL Undangan Anda' : 'Your Invitation URL'}</h2>
                  <p className="text-sm text-gray-500 mb-2">{lang === 'id' ? 'Ini akan menjadi link/url unik untuk undangan Anda yang bisa dibagikan' : 'This will be your unique invitation link to share'}</p>
                  <div className="flex items-center">
                    <span className="h-11 px-4 bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded-lg flex items-center text-sm text-gray-500 whitespace-nowrap w-full overflow-hidden text-ellipsis">
                      yoursite.com/invitation/{(formData.groom_name || formData.bride_name) ? `${formData.groom_name.toLowerCase()}-${formData.bride_name.toLowerCase()}`.replace(/\s+/g, '-') : (lang === 'id' ? 'nama-pasangan' : 'couple-name')}
                    </span>
                  </div>
                </div>
                
                <div className="pt-8 flex justify-end border-t border-black/5 dark:border-white/5">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="h-12 w-full sm:w-auto px-8 bg-black dark:bg-[#C5A059] text-white rounded-full font-medium inline-flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-[#b08d4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10 dark:shadow-[#C5A059]/20"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === 'id' ? 'Pilih Metode Pembayaran' : 'Choose Payment Method')}
                    {!loading && <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
