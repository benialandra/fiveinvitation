import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { THEME_REGISTRY } from '../themes/registry';
import { generateOrderCode } from '../utils/utils';
import { ChevronRight, ChevronLeft, ArrowLeft, Loader2, CheckCircle2, Paintbrush, Type } from 'lucide-react';
import { supabase } from '../supabase/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Floating label input component
function FloatingInput({ id, label, type = 'text', required = false, value, onChange, placeholder = ' ', min, disabled = false }: {
  id: string; label: string; type?: string; required?: boolean; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; min?: string; disabled?: boolean;
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
        disabled={disabled}
        className={`peer w-full px-4 pt-6 pb-2 h-14 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/30 text-gray-900 dark:text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all placeholder-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      <label
        htmlFor={id}
        className="absolute left-4 right-4 top-2 text-[10px] font-semibold uppercase tracking-widest text-[#C5A059] transition-all whitespace-nowrap overflow-hidden text-ellipsis peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-gray-400 peer-placeholder-shown:uppercase-none peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#C5A059]"
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
     window.scrollTo(0, 0);
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

  useScript('https://app.sandbox.midtrans.com/snap/snap.js');

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Validation States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');

  // Customization States
  const [customFont, setCustomFont] = useState('default');
  const [customColor, setCustomColor] = useState('default');

  const [formData, setFormData] = useState({
    groom_name: '',
    bride_name: '',
    akad_date: '',
    email: '',
    slug: ''
  });

  if (!theme) return <div className="p-12 text-center text-gray-500">{lang === 'id' ? 'Tema tidak ditemukan.' : 'Theme not found.'}</div>;

  const isPremium = customFont !== 'default' || customColor !== 'default';
  const premiumCost = isPremium ? 20000 : 0;
  const totalPrice = theme.price + premiumCost;

  const premiumFonts = [
    { id: 'default', name: lang === 'id' ? 'Bawaan Tema (Gratis)' : 'Default (Free)' },
    { id: 'Playfair Display', name: 'Playfair Display (Premium)' },
    { id: 'Great Vibes', name: 'Great Vibes (Premium)' },
    { id: 'Montserrat', name: 'Montserrat (Premium)' }
  ];

  const premiumColors = [
    { id: 'default', name: lang === 'id' ? 'Bawaan Tema (Gratis)' : 'Default (Free)', hex: '#ccc' },
    { id: '#C5A059', name: 'Rose Gold (Premium)', hex: '#C5A059' },
    { id: '#8F9779', name: 'Sage Green (Premium)', hex: '#8F9779' },
    { id: '#1A2A3A', name: 'Navy Blue (Premium)', hex: '#1A2A3A' }
  ];

  const carouselImages = (() => {
    let imgs: string[] = [];
    if (theme.config_json?.gallery && Array.isArray(theme.config_json.gallery) && theme.config_json.gallery.length > 0) {
       imgs = [...theme.config_json.gallery];
    }
    const mainImg = (theme as any).image || theme.thumbnail;
    if (mainImg && !imgs.includes(mainImg)) {
       imgs.unshift(mainImg);
    }
    if (imgs.length === 0) {
       imgs.push("https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=60&w=800&fm=webp&q=60");
    }
    return imgs;
  })();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImage = () => setCurrentImageIndex(prev => prev === 0 ? carouselImages.length - 1 : prev - 1);
  const nextImage = () => setCurrentImageIndex(prev => prev === carouselImages.length - 1 ? 0 : prev + 1);

  const handleSendOTP = async () => {
    if (!formData.email) return toast.error("Masukkan email terlebih dahulu!");
    setOtpLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim OTP");
      setOtpSent(true);
      toast.success("OTP terkirim ke email Anda!");
    } catch (err: any) {
      setErrorMessage(err.message);
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Masukkan kode OTP!");
    setOtpLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: formData.email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP salah");
      setOtpVerified(true);
      toast.success("Email berhasil diverifikasi!");
    } catch (err: any) {
      setErrorMessage(err.message);
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) {
       toast.error("Silakan verifikasi email Anda terlebih dahulu.");
       return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      const orderCode = generateOrderCode();
      let slugVal = formData.slug;
      if (!slugVal) {
         const baseSlug = `${formData.groom_name}-${formData.bride_name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'invitation';
         let dateSuffix = '';
         if (formData.akad_date) {
            const d = new Date(formData.akad_date);
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yy = String(d.getFullYear()).slice(-2);
            dateSuffix = `-${dd}${mm}${yy}`;
         } else {
            dateSuffix = `-${Math.random().toString(36).substring(2, 6)}`;
         }
         slugVal = `${baseSlug}${dateSuffix}`;
      }
      
      const customizations = { font: customFont, color: customColor };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderCode,
          gross_amount: totalPrice,
          first_name: formData.groom_name,
          email: formData.email,
          groom_name: formData.groom_name,
          bride_name: formData.bride_name,
          theme_id: theme.id,
          akad_date: formData.akad_date ? new Date(formData.akad_date).toISOString() : null,
          slug: slugVal,
          customizations: customizations
        })
      });
      
      const payload = await res.json();
      
      if (!res.ok) {
        toast.error(payload.error || (lang === 'id' ? "Gagal memproses pesanan." : "Failed to process order."));
        setErrorMessage(payload.error || (lang === 'id' ? "Gagal memproses pesanan." : "Failed to process order."));
        setLoading(false);
        return;
      }
      
      const { token } = payload;
      toast.success(lang === 'id' ? 'Pesanan berhasil dibuat! Menunggu pembayaran...' : 'Order created! Waiting for payment...');
      
      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        window.snap.pay(token, {
          onSuccess: function(result: any){ navigate(`/track/${orderCode}?status=success`); },
          onPending: function(result: any){ navigate(`/track/${orderCode}?status=pending`); },
          onError: function(result: any){ navigate(`/track/${orderCode}?status=error`); },
          onClose: function(){ navigate(`/track/${orderCode}?status=closed`); }
        });
      } else {
        toast.error("Gagal memuat sistem pembayaran");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan. Pastikan backend berjalan.");
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <p>{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           {/* Bagian Kiri: Ringkasan Pesanan */}
           <div className="lg:col-span-5 bg-white dark:bg-[#111] rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-black/5 dark:border-white/10 pb-4">
                 {lang === 'id' ? 'Ringkasan Pesanan' : 'Order Summary'}
              </h2>
              <div className="aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-black/50 overflow-hidden mb-4 relative group">
                 <AnimatePresence mode="wait">
                   <motion.img 
                     key={currentImageIndex}
                     src={carouselImages[currentImageIndex]} 
                     alt={theme.name} 
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                     className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" 
                   />
                 </AnimatePresence>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5 z-10">
                    <div>
                       <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold block">Tema</span>
                       <span className="text-white font-serif text-2xl">{theme.name}</span>
                    </div>
                 </div>
              </div>
              <a 
                href={`/preview/${theme.id}?font=${customFont}&color=${encodeURIComponent(customColor || '')}`} 
                target="_blank" 
                className="w-full mb-6 bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl flex justify-center text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Lihat Live Preview Kustomisasi
              </a>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Harga Dasar</span>
                    <span className="font-medium text-gray-900 dark:text-white">Rp {theme.price.toLocaleString('id-ID')}</span>
                 </div>
                 {isPremium && (
                    <div className="flex justify-between text-sm">
                       <span className="text-[#C5A059] flex items-center gap-1">Biaya Kustomisasi (Premium)</span>
                       <span className="font-medium text-[#C5A059]">+ Rp 20.000</span>
                    </div>
                 )}
              </div>
              <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10 flex justify-between items-end">
                 <span className="block text-sm font-medium text-gray-500">Total Biaya</span>
                 <span className="text-3xl font-bold text-rose-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
           </div>

           {/* Bagian Kanan: Form Data */}
           <div className="lg:col-span-7 bg-white dark:bg-[#111] rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-black/5 dark:border-white/10 pb-4">
                 {lang === 'id' ? 'Informasi & Pembayaran' : 'Information & Payment'}
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
                
                <div className="space-y-8">
                      
                      {/* 1. Kustomisasi Tema */}
                      <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          1. Kustomisasi Tema <span className="text-xs bg-[#C5A059] text-white px-2 py-0.5 rounded-full">Opsional</span>
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Font Selector */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                              <Type size={16} /> Pilihan Font
                            </label>
                            <div className="space-y-2">
                              {premiumFonts.map(font => (
                                <button
                                  key={font.id} type="button"
                                  onClick={() => setCustomFont(font.id)}
                                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${customFont === font.id ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-semibold' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:border-gray-300'}`}
                                >
                                  {font.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Color Selector */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                              <Paintbrush size={16} /> Palet Warna
                            </label>
                            <div className="space-y-2">
                              {premiumColors.map(color => (
                                <button
                                  key={color.id} type="button"
                                  onClick={() => setCustomColor(color.id)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${customColor === color.id ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-semibold' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:border-gray-300'}`}
                                >
                                  <span className="w-5 h-5 rounded-full shadow-sm border border-black/10" style={{ background: color.hex }}></span>
                                  {color.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. Data Mempelai */}
                      <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Data Mempelai</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FloatingInput
                            id="groom" label="Nama Panggilan Pria" required
                            value={formData.groom_name} onChange={e => setFormData({...formData, groom_name: e.target.value})}
                          />
                          <FloatingInput
                            id="bride" label="Nama Panggilan Wanita" required
                            value={formData.bride_name} onChange={e => setFormData({...formData, bride_name: e.target.value})}
                          />
                        </div>
                      </div>

                      {/* 4. Data Acara */}
                      <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Data Acara</h2>
                        <FloatingInput
                          id="akad_date" label="Tanggal Akad" type="datetime-local" required
                          min={new Date().toISOString().slice(0, 16)}
                          value={formData.akad_date} onChange={e => setFormData({...formData, akad_date: e.target.value})}
                        />
                      </div>

                      {/* 4. Verifikasi Email */}
                      <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          4. Validasi Kontak {otpVerified && <CheckCircle2 className="text-green-500 w-5 h-5" />}
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <FloatingInput
                              id="email" label="Email Pemesan" type="email" required
                              disabled={otpVerified || otpSent} value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                          {!otpVerified && (
                            <button 
                              type="button" onClick={handleSendOTP} disabled={otpLoading || otpSent || !formData.email}
                              className="h-14 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50"
                            >
                              {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (otpSent ? 'Terkirim' : 'Kirim OTP')}
                            </button>
                          )}
                        </div>

                        <AnimatePresence>
                          {otpSent && !otpVerified && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col sm:flex-row gap-4 pt-2">
                              <div className="flex-1">
                                <FloatingInput
                                  id="otp" label="Masukkan 4 Digit OTP" required
                                  value={otp} onChange={e => setOtp(e.target.value)}
                                />
                              </div>
                              <button 
                                type="button" onClick={handleVerifyOTP} disabled={otpLoading || !otp}
                                className="h-14 px-6 rounded-xl bg-[#C5A059] text-white font-semibold text-sm hover:opacity-90"
                              >
                                Verifikasi
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {/* Submit */}
                      <div className="pt-8 flex justify-end border-t border-black/5 dark:border-white/5">
                        <motion.button 
                          type="submit" disabled={loading}
                          animate={{ width: loading ? 56 : 'auto', borderRadius: loading ? '50%' : '9999px' }}
                          className="h-14 px-8 bg-black dark:bg-[#C5A059] text-white font-medium inline-flex items-center justify-center gap-2 overflow-hidden shadow-xl"
                        >
                          <AnimatePresence mode="wait">
                            {loading ? (
                              <motion.span key="spinner" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><Loader2 className="w-5 h-5 animate-spin" /></motion.span>
                            ) : (
                              <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 whitespace-nowrap">
                                Bayar Rp {totalPrice.toLocaleString('id-ID')} <ChevronRight className="w-5 h-5" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
