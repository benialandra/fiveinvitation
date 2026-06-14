import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext, Link } from 'react-router-dom';
import { Loader2, Save, ArrowLeft, MapPin, X, Heart, Image as ImageIcon, Sparkles, Eye, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { THEME_REGISTRY } from '../themes/registry';
import { isSupabaseConfigured, supabase } from '../supabase/supabase';
import RippleButton from '../components/RippleButton';

export default function EditOrder() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [themeId, setThemeId] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'events' | 'media' | 'extra'>('info');

  const [formData, setFormData] = useState({
    groom_name: '',
    bride_name: '',
    groom_parents: '',
    bride_parents: '',
    akad_date: '',
    resepsi_date: '',
    location_name: '',
    maps_link: '',
    story: '',
    music_url: '',
    slug: '',
    cover_image: '',
    hero_image: '',
    // Customizations images
    groom_image: '',
    bride_image: '',
    gallery_1: '',
    gallery_2: '',
    gallery_3: '',
    gallery_4: '',
    bank_name: '',
    bank_account: '',
    bank_owner: '',
    live_stream_url: ''
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    cover_image: null,
    hero_image: null,
    groom_image: null,
    bride_image: null,
    gallery_1: null,
    gallery_2: null,
    gallery_3: null,
    gallery_4: null
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderCode}`);
        if (response.ok) {
          const data = await response.json();
          setThemeId(data.theme_id || '');
          const cust = data.customizations || {};
          setFormData({
            groom_name: data.groom_name || '',
            bride_name: data.bride_name || '',
            groom_parents: data.groom_parents || '',
            bride_parents: data.bride_parents || '',
            akad_date: data.akad_date ? new Date(data.akad_date).toISOString().slice(0, 16) : '',
            resepsi_date: data.resepsi_date ? new Date(data.resepsi_date).toISOString().slice(0, 16) : '',
            location_name: data.location_name || '',
            maps_link: data.maps_link || '',
            story: data.story || '',
            music_url: data.music_url || '',
            slug: data.slug || '',
            cover_image: data.cover_image || '',
            hero_image: data.hero_image || '',
            groom_image: cust.groom_image || '',
            bride_image: cust.bride_image || '',
            gallery_1: cust.gallery_1 || '',
            gallery_2: cust.gallery_2 || '',
            gallery_3: cust.gallery_3 || '',
            gallery_4: cust.gallery_4 || '',
            bank_name: cust.bank_name || '',
            bank_account: cust.bank_account || '',
            bank_owner: cust.bank_owner || '',
            live_stream_url: cust.live_stream_url || ''
          });
        } else {
          toast.error('Pesanan tidak ditemukan.');
          navigate('/');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderCode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSubmit = new FormData();

      // Standard text fields
      const textKeys = [
        'groom_name', 'bride_name', 'groom_parents', 'bride_parents',
        'location_name', 'maps_link', 'story', 'music_url', 'slug'
      ];
      textKeys.forEach(key => {
        dataToSubmit.append(key, (formData as any)[key]);
      });

      // Dates fields
      dataToSubmit.append('akad_date', formData.akad_date ? new Date(formData.akad_date).toISOString() : '');
      dataToSubmit.append('resepsi_date', formData.resepsi_date ? new Date(formData.resepsi_date).toISOString() : '');

      // Upload files
      const uploadedUrls: { [key: string]: string } = {};
      const supabaseConfigured = isSupabaseConfigured();

      for (const [key, file] of Object.entries(files)) {
        if (file) {
          if (!supabaseConfigured) {
            uploadedUrls[key] = URL.createObjectURL(file);
          } else {
            const fileName = `${Date.now()}_${key}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
            const { error } = await supabase.storage.from('fiveinvitation-bucket').upload(`uploads/${fileName}`, file, {
              cacheControl: '3600',
              upsert: false
            });
            if (error) throw error;
            const { data } = supabase.storage.from('fiveinvitation-bucket').getPublicUrl(`uploads/${fileName}`);
            uploadedUrls[key] = data.publicUrl;
          }
        }
      }

      const finalCoverImage = uploadedUrls.cover_image || formData.cover_image;
      const finalHeroImage = uploadedUrls.hero_image || formData.hero_image;

      if (finalCoverImage) dataToSubmit.append('cover_image', finalCoverImage);
      if (finalHeroImage) dataToSubmit.append('hero_image', finalHeroImage);

      // Customizations
      const finalCustomizations = {
        groom_image: uploadedUrls.groom_image || formData.groom_image,
        bride_image: uploadedUrls.bride_image || formData.bride_image,
        gallery_1: uploadedUrls.gallery_1 || formData.gallery_1,
        gallery_2: uploadedUrls.gallery_2 || formData.gallery_2,
        gallery_3: uploadedUrls.gallery_3 || formData.gallery_3,
        gallery_4: uploadedUrls.gallery_4 || formData.gallery_4,
        bank_name: formData.bank_name,
        bank_account: formData.bank_account,
        bank_owner: formData.bank_owner,
        live_stream_url: formData.live_stream_url
      };

      dataToSubmit.append('customizations', JSON.stringify(finalCustomizations));

      const response = await fetch(`/api/orders/${orderCode}`, {
        method: 'PUT',
        body: dataToSubmit
      });

      if (response.ok) {
        toast.success(lang === 'id' ? 'Data berhasil disimpan!' : 'Data saved successfully!');
        navigate(`/track/${orderCode}`);
      } else {
        const result = await response.json().catch(() => ({}));
        toast.error(`${lang === 'id' ? 'Gagal menyimpan data' : 'Failed to save data'}: ${result.error || 'Server Error'}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`${lang === 'id' ? 'Terjadi kesalahan' : 'An error occurred'}: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleGetLocation = () => {
    setLocLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData((prev) => ({ ...prev, maps_link: `https://www.google.com/maps?q=${lat},${lng}` }));
          setLocLoading(false);
          setShowMapModal(false);
        },
        (error) => {
          toast.error('Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.');
          setLocLoading(false);
        }
      );
    } else {
      toast.error('Browser Anda tidak mendukung geolokasi.');
      setLocLoading(false);
    }
  };

  const renderImageField = (label: string, key: string, currentUrl: string) => {
    const file = files[key];
    const previewUrl = file ? URL.createObjectURL(file) : currentUrl;

    return (
      <div className="flex flex-col gap-2.5 p-4 bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 rounded-2xl">
        <label className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-4">
          {previewUrl ? (
            <img src={previewUrl} className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-white/10 shrink-0 shadow-sm" alt={label} />
          ) : (
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center shrink-0">
              <ImageIcon className="text-gray-400 w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, key)}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-[#C5A059]/10 file:text-[#C5A059] file:hover:bg-[#C5A059]/20 file:cursor-pointer"
            />
            {file && (
              <p className="text-[10px] text-green-500 font-medium mt-1">✓ File siap diunggah</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
        <p className="mt-4 text-gray-500 dark:text-white/60">Memuat data...</p>
      </div>
    );
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 transition-all ${
    themeMode === 'dark'
      ? 'bg-black/50 border-white/20 text-white focus:border-[#C5A059]'
      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#C5A059]'
  }`;

  const labelClass = 'block text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2';

  const tabs = [
    { id: 'info', label: lang === 'id' ? 'Profil Pengantin' : 'Couple Profile', icon: Heart },
    { id: 'events', label: lang === 'id' ? 'Jadwal & Lokasi' : 'Events & Location', icon: MapPin },
    { id: 'media', label: lang === 'id' ? 'Galeri & Media' : 'Gallery & Media', icon: ImageIcon },
    { id: 'extra', label: lang === 'id' ? 'Cerita, Musik & Hadiah' : 'Story, Music & Gift', icon: Sparkles }
  ];

  const SelectedTheme = THEME_REGISTRY.find((t) => t.id === themeId);
  const ThemeComponent = SelectedTheme?.component;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(`/track/${orderCode}`)}
            className="flex items-center text-xs text-gray-500 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors mb-3 uppercase tracking-wider font-semibold"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            {lang === 'id' ? 'Kembali ke Status' : 'Back to Status'}
          </button>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white leading-tight">
            {lang === 'id' ? 'Lengkapi Data Undangan' : 'Complete Invitation Data'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
            {lang === 'id' ? 'Isi formulir di sebelah kiri untuk melihat pembaruan desain Anda secara instan di sebelah kanan.' : 'Fill out the form on the left to see your design update instantly on the right.'} (Invoice: {orderCode})
          </p>
        </div>
      </div>

      {/* Main Side-by-Side Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Column: Form Panel (60% width) */}
        <div className="flex-1 w-full space-y-8">
          
          {/* Tab Navigation Menu */}
          <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl gap-1 overflow-x-auto no-scrollbar border border-gray-200/50 dark:border-white/5 shadow-inner">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex-1 ${
                    isActive 
                      ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/10' 
                      : 'text-gray-500 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
                  }`}
                >
                  <TabIcon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Tab Content: Info (Mempelai) */}
            {activeTab === 'info' && (
              <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-xl shadow-black/5'} space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <h2 className="text-xl font-serif text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-white/5">{lang === 'id' ? 'Profil Mempelai' : 'Couple Profile'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>{lang === 'id' ? 'Nama Mempelai Pria' : 'Groom Name'}</label>
                    <input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'id' ? 'Nama Orang Tua Mempelai Pria' : 'Groom Parents'}</label>
                    <input type="text" name="groom_parents" value={formData.groom_parents} onChange={handleChange} placeholder={lang === 'id' ? "Putra dari Bapak ... & Ibu ..." : "Son of Mr. ... & Mrs. ..."} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'id' ? 'Nama Mempelai Wanita' : 'Bride Name'}</label>
                    <input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'id' ? 'Nama Orang Tua Mempelai Wanita' : 'Bride Parents'}</label>
                    <input type="text" name="bride_parents" value={formData.bride_parents} onChange={handleChange} placeholder={lang === 'id' ? "Putri dari Bapak ... & Ibu ..." : "Daughter of Mr. ... & Mrs. ..."} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Events (Acara) */}
            {activeTab === 'events' && (
              <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-xl shadow-black/5'} space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <h2 className="text-xl font-serif text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-white/5">{lang === 'id' ? 'Detail Acara & Lokasi' : 'Event Details & Venue'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>{lang === 'id' ? 'Waktu Akad / Pemberkatan' : 'Matrimony Time'}</label>
                    <input type="datetime-local" name="akad_date" value={formData.akad_date} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'id' ? 'Waktu Resepsi' : 'Reception Time'}</label>
                    <input type="datetime-local" name="resepsi_date" value={formData.resepsi_date} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>{lang === 'id' ? 'Nama & Alamat Lokasi' : 'Venue Name & Address'}</label>
                    <textarea name="location_name" value={formData.location_name} onChange={handleChange} className={`${inputClass} min-h-[100px]`} placeholder={lang === 'id' ? "Contoh: Gedung Serbaguna ABC, Jl. Raya No. 123..." : "E.g. Grand Ballroom, 123 Main St..."} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>{lang === 'id' ? 'Link Google Maps' : 'Google Maps Link'}</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input type="url" name="maps_link" value={formData.maps_link} onChange={handleChange} className={inputClass} placeholder="https://maps.app.goo.gl/..." />
                      <button
                        type="button"
                        onClick={() => setShowMapModal(true)}
                        className="px-5 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors whitespace-nowrap flex items-center justify-center font-semibold text-xs uppercase tracking-wider shrink-0 shadow-sm border border-transparent dark:border-white/5 cursor-pointer"
                      >
                        <MapPin size={14} className="mr-1.5 text-[#C5A059]" />
                        {lang === 'id' ? 'Cari Lokasi Anda' : 'Find My Location'}
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>{lang === 'id' ? 'Link Live Streaming (Opsional)' : 'Live Streaming Link (Optional)'}</label>
                    <input type="url" name="live_stream_url" value={formData.live_stream_url} onChange={handleChange} className={inputClass} placeholder="https://youtube.com/live/..." />
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Media (Galeri Foto) */}
            {activeTab === 'media' && (
              <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-xl shadow-black/5'} space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div>
                  <h2 className="text-xl font-serif text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-white/5">{lang === 'id' ? 'Wallpaper & Foto Utama' : 'Wallpaper & Main Photos'}</h2>
                  <p className="text-xs text-gray-400 dark:text-white/40 mt-1.5">{lang === 'id' ? 'Foto utama untuk halaman sampul dan background undangan Anda.' : 'Main photos for invitation cover and background.'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderImageField(lang === 'id' ? 'Foto Sampul Undangan (Cover)' : 'Cover Image', 'cover_image', formData.cover_image)}
                  {renderImageField(lang === 'id' ? 'Wallpaper Tema (Hero Background)' : 'Hero Wallpaper', 'hero_image', formData.hero_image)}
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                  <h3 className="text-base font-serif text-gray-900 dark:text-white mb-2">{lang === 'id' ? 'Foto Pengantin & Galeri Undangan' : 'Couple Photos & Wedding Gallery'}</h3>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-5">{lang === 'id' ? 'Unggah foto detail mempelai serta foto-foto galeri yang akan tampil di dalam undangan Anda.' : 'Upload groom/bride photos and other gallery items.'}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderImageField(lang === 'id' ? 'Foto Mempelai Pria' : 'Groom Photo', 'groom_image', formData.groom_image)}
                    {renderImageField(lang === 'id' ? 'Foto Mempelai Wanita' : 'Bride Photo', 'bride_image', formData.bride_image)}
                    {renderImageField(lang === 'id' ? 'Foto Galeri 1' : 'Gallery Photo 1', 'gallery_1', formData.gallery_1)}
                    {renderImageField(lang === 'id' ? 'Foto Galeri 2' : 'Gallery Photo 2', 'gallery_2', formData.gallery_2)}
                    {renderImageField(lang === 'id' ? 'Foto Galeri 3' : 'Gallery Photo 3', 'gallery_3', formData.gallery_3)}
                    {renderImageField(lang === 'id' ? 'Foto Galeri 4' : 'Gallery Photo 4', 'gallery_4', formData.gallery_4)}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Extra (Cerita & Musik) */}
            {activeTab === 'extra' && (
              <div className={`p-6 md:p-8 rounded-3xl border ${themeMode === 'dark' ? 'border-white/10 glass-card bg-[#111]/80' : 'border-gray-200 bg-white shadow-xl shadow-black/5'} space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <h2 className="text-xl font-serif text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-white/5">{lang === 'id' ? 'Kisah Cinta & Musik Latar' : 'Love Story & Audio'}</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className={labelClass}>{lang === 'id' ? 'Kisah Cinta (Opsional)' : 'Love Story (Optional)'}</label>
                    <textarea name="story" value={formData.story} onChange={handleChange} className={`${inputClass} min-h-[140px]`} placeholder={lang === 'id' ? "Ceritakan secara singkat bagaimana Anda berdua bertemu dan memutuskan melangkah ke pelaminan..." : "Tell your love story briefly..."} />
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'id' ? 'Pilih Musik Latar' : 'Background Music'}</label>
                    <select name="music_url" value={formData.music_url} onChange={(e) => setFormData(prev => ({...prev, music_url: e.target.value}))} className={`${inputClass} cursor-pointer appearance-none`}>
                      <option value="">{lang === 'id' ? '-- Tanpa Musik Latar --' : '-- No Music --'}</option>
                      <option value="romantic_1.mp3">A Thousand Years - Instrumental</option>
                      <option value="romantic_2.mp3">Perfect - Cover Acoustic</option>
                      <option value="romantic_3.mp3">Canon in D - Piano</option>
                      <option value="romantic_4.mp3">Beautiful in White - Piano</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-6">
                  <h3 className="text-base font-serif text-gray-900 dark:text-white mb-2">{lang === 'id' ? 'Amplop Digital (Angpao / Rekening)' : 'Digital Envelope'}</h3>
                  <p className="text-xs text-gray-400 dark:text-white/40 mb-5">{lang === 'id' ? 'Kosongkan jika Anda tidak ingin mengaktifkan fitur amplop digital pada undangan Anda.' : 'Leave blank if you do not want to use digital envelopes.'}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>{lang === 'id' ? 'Nama Bank / E-Wallet' : 'Bank / E-Wallet Name'}</label>
                      <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} className={inputClass} placeholder="BCA / Mandiri / GoPay" />
                    </div>
                    <div>
                      <label className={labelClass}>{lang === 'id' ? 'Nomor Rekening / No. HP' : 'Account Number'}</label>
                      <input type="text" name="bank_account" value={formData.bank_account} onChange={handleChange} className={inputClass} placeholder="1234567890" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>{lang === 'id' ? 'Nama Pemilik Rekening' : 'Account Holder Name'}</label>
                      <input type="text" name="bank_owner" value={formData.bank_owner} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="flex justify-between items-center pt-4">
              <p className="text-xs text-gray-400 dark:text-white/30">{lang === 'id' ? '* Semua perubahan akan disimpan secara permanen di database.' : '* All changes will be saved permanently to the database.'}</p>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-4 bg-[#C5A059] text-white rounded-xl font-semibold uppercase tracking-wider text-xs hover:bg-[#b08d4a] focus:ring-4 focus:ring-[#C5A059]/20 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#C5A059]/10"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    {lang === 'id' ? 'Menyimpan...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {lang === 'id' ? 'Simpan Perubahan' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Right Column: Live Mockup Preview Panel (40% width) */}
        <div className="hidden lg:block w-[375px] sticky top-8 shrink-0 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <Eye size={14} className="text-[#C5A059]" />
              {lang === 'id' ? 'Tampilan Live Undangan' : 'Live Invitation Preview'}
            </span>
            <span className="text-[10px] text-green-500 font-semibold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 animate-pulse">
              Interactive
            </span>
          </div>

          <div className="w-[375px] h-[720px] rounded-[52px] border-[12px] border-zinc-950 dark:border-zinc-800 overflow-hidden shadow-2xl relative bg-[#f8fafd] dark:bg-zinc-900 flex flex-col ring-4 ring-[#C5A059]/10">
            {/* iPhone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-black z-[100] flex items-center justify-between px-6 text-[10px] text-white font-medium">
              <span>9:41</span>
              <div className="w-16 h-4 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1" />
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-1.5 border border-white rounded-[2px] relative" />
              </div>
            </div>

            {/* Inner Live Content */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar relative pt-6 bg-white dark:bg-zinc-950">
              {ThemeComponent ? (
                <React.Suspense fallback={
                  <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mb-2" />
                    <span className="text-xs text-gray-400">{lang === 'id' ? 'Memuat Pratinjau...' : 'Loading Preview...'}</span>
                  </div>
                }>
                  <ThemeComponent data={{
                    ...formData,
                    // Preview selected files in real-time
                    cover_image: files.cover_image ? URL.createObjectURL(files.cover_image) : formData.cover_image,
                    hero_image: files.hero_image ? URL.createObjectURL(files.hero_image) : formData.hero_image,
                    groom_image: files.groom_image ? URL.createObjectURL(files.groom_image) : formData.groom_image,
                    bride_image: files.bride_image ? URL.createObjectURL(files.bride_image) : formData.bride_image,
                    gallery_1: files.gallery_1 ? URL.createObjectURL(files.gallery_1) : formData.gallery_1,
                    gallery_2: files.gallery_2 ? URL.createObjectURL(files.gallery_2) : formData.gallery_2,
                    gallery_3: files.gallery_3 ? URL.createObjectURL(files.gallery_3) : formData.gallery_3,
                    gallery_4: files.gallery_4 ? URL.createObjectURL(files.gallery_4) : formData.gallery_4
                  }} guestName={lang === 'id' ? 'Nama Tamu' : 'Guest Name'} />
                </React.Suspense>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-gray-400 bg-gray-50 dark:bg-zinc-900">
                  {lang === 'id' ? 'Gagal memuat pratinjau tema' : 'Failed to load theme preview'}
                </div>
              )}
            </div>

            {/* Simulated Home Indicator */}
            <div className="absolute bottom-1 inset-x-0 h-1 z-[100] flex justify-center">
              <div className="w-24 h-1 bg-black/60 dark:bg-white/30 rounded-full" />
            </div>
          </div>
        </div>

      </div>

      {/* Map coordinates modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl relative ${themeMode === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'}`}>
            <button 
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-white/50 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#C5A059]/20">
                <MapPin size={32} className="text-[#C5A059]" />
              </div>
              <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-2">{lang === 'id' ? 'Ambil Lokasi Saat Ini' : 'Get Current Location'}</h3>
              <p className="text-xs text-gray-500 dark:text-white/60 leading-relaxed">
                {lang === 'id' 
                  ? 'Kami akan meminta akses lokasi pada browser Anda untuk membuat letak peta koordinat Google Maps secara otomatis.' 
                  : 'We will ask for your browser location access to generate Google Maps coordinates automatically.'}
              </p>
            </div>
            
            <button
              onClick={handleGetLocation}
              disabled={locLoading}
              className="w-full py-4 bg-[#C5A059] text-white rounded-xl font-semibold uppercase tracking-wider text-xs hover:bg-[#b08d4a] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {locLoading ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> {lang === 'id' ? 'Mengambil Lokasi...' : 'Retrieving Location...'}</>
              ) : (
                lang === 'id' ? 'Izinkan & Ambil Lokasi' : 'Allow & Get Location'
              )}
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}
