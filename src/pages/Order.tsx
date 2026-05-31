import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { THEME_REGISTRY } from '../themes/registry';
import { generateOrderCode } from '../lib/utils';
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Helper hook
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

  if (!theme) return <div className="p-12 text-center text-gray-500">Tema tidak ditemukan.</div>;

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
        toast.error(payload.error || "Gagal memproses pesanan.");
        setErrorMessage(payload.error || "Gagal memproses pesanan. Silakan periksa kembali data Anda.");
        setLoading(false);
        return;
      }
      
      const { token } = payload;
      toast.success('Pesanan berhasil dibuat! Menunggu pembayaran...');
      
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
        toast.error("Gagal memuat sistem pembayaran");
        setErrorMessage("Midtrans script not loaded");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan. Pastikan backend berjalan.");
      setErrorMessage("Terjadi kesalahan. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] dark:bg-transparent py-12">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{errorMessage}</p>
          </div>
        )}
        
        <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-[0_0_20px_rgba(255,255,255,0.02)]">
          <div className="flex items-start justify-between border-b border-black/5 dark:border-white/10 pb-8 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Checkout Undangan</h1>
              <p className="text-gray-500 dark:text-gray-400">Tema: <span className="font-semibold text-black dark:text-white">{theme.name}</span></p>
            </div>
            <div className="text-right">
              <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Total Biaya</span>
              <span className="text-2xl font-bold text-rose-600">Rp {theme.price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Data Pemesan & Mempelai</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Pemesan</label>
              <input 
                type="email" 
                required
                placeholder="Contoh: user@email.com"
                className="w-full px-4 h-11 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/30 text-gray-900 dark:text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Panggilan Pria</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Beni"
                  className="w-full px-4 h-11 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/30 text-gray-900 dark:text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                  value={formData.groom_name}
                  onChange={e => setFormData({...formData, groom_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Panggilan Wanita</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Salsa"
                  className="w-full px-4 h-11 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/30 text-gray-900 dark:text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                  value={formData.bride_name}
                  onChange={e => setFormData({...formData, bride_name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Data Acara</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Akad</label>
                <div className="relative">
                  <input 
                    type="datetime-local" 
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 h-11 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/30 text-gray-900 dark:text-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/50 outline-none transition-all shadow-sm cursor-pointer appearance-none"
                    value={formData.akad_date}
                    onChange={e => setFormData({...formData, akad_date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Upload Foto Pre-Wedding</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Pilih hingga 5 foto pre-wedding. Maksimal 2MB per foto.</p>
              
              <div className="flex items-center gap-4">
                <input 
                  type="file"
                  multiple
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#C5A059]/10 file:text-[#C5A059] hover:file:bg-[#C5A059]/20 transition-colors file:cursor-pointer"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const maxFiles = 5;
                      const maxSize = 2 * 1024 * 1024; // 2MB
                      
                      if (files.length > maxFiles) {
                        setErrorMessage("Maksimal 5 foto yang diizinkan.");
                        e.target.value = '';
                        return;
                      }

                      for (let i = 0; i < files.length; i++) {
                        if (files[i].size > maxSize) {
                          setErrorMessage(`Menolak foto "${files[i].name}" karena melebihi 2MB.`);
                          e.target.value = '';
                          return;
                        }
                      }
                      
                      setErrorMessage(''); // clear error if valid
                    }
                  }}
                />
              </div>
            </div>

            {/* URL Auto-generated, no longer an input field here */}
            <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. URL Undangan Anda</h2>
              <div className="flex items-center">
                <span className="h-11 px-4 bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded-lg flex items-center text-sm text-gray-500 whitespace-nowrap w-full">
                  fiveinvitation.com/invitation/{(formData.groom_name || formData.bride_name) ? `${formData.groom_name.toLowerCase()}-${formData.bride_name.toLowerCase()}`.replace(/\s+/g, '-') : 'nama-pasangan'}
                </span>
              </div>
            </div>
            
            <div className="pt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="h-12 px-8 bg-black dark:bg-[#C5A059] text-white rounded-full font-medium inline-flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-[#b08d4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bayar Sekarang"}
                {!loading && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
