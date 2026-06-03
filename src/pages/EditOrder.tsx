import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, Save, ArrowLeft, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function EditOrder() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
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
    hero_image: ''
  });
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderCode}`);
        if (response.ok) {
          const data = await response.json();
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
            hero_image: data.hero_image || ''
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'hero') => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'cover') setCoverFile(e.target.files[0]);
      if (type === 'hero') setHeroFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'cover_image' || key === 'hero_image') return; // Skip image string values

        const val = (formData as any)[key];
        if (key === 'akad_date' || key === 'resepsi_date') {
          dataToSubmit.append(key, val ? new Date(val).toISOString() : '');
        } else {
           dataToSubmit.append(key, val);
        }
      });
      
      let finalCoverImage = formData.cover_image;
      if (coverFile) {
        const coverName = `${Date.now()}_${coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const { error } = await supabase.storage.from('fiveinvitation-bucket').upload(`uploads/${coverName}`, coverFile, {
            cacheControl: '3600',
            upsert: false
        });
        if (error) throw error;
        const { data } = supabase.storage.from('fiveinvitation-bucket').getPublicUrl(`uploads/${coverName}`);
        finalCoverImage = data.publicUrl;
      }
      
      let finalHeroImage = formData.hero_image;
      if (heroFile) {
        const heroName = `${Date.now()}_${heroFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const { error } = await supabase.storage.from('fiveinvitation-bucket').upload(`uploads/${heroName}`, heroFile, {
            cacheControl: '3600',
            upsert: false
        });
        if (error) throw error;
        const { data } = supabase.storage.from('fiveinvitation-bucket').getPublicUrl(`uploads/${heroName}`);
        finalHeroImage = data.publicUrl;
      }

      if (finalCoverImage) dataToSubmit.append('cover_image', finalCoverImage);
      if (finalHeroImage) dataToSubmit.append('hero_image', finalHeroImage);

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
          setFormData(prev => ({ ...prev, maps_link: `https://www.google.com/maps?q=${lat},${lng}` }));
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

  const labelClass = "block text-sm font-medium text-gray-700 dark:text-white/80 mb-2";

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(`/track/${orderCode}`)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={16} className="mr-2" />
        {lang === 'id' ? 'Kembali ke Status' : 'Back to Status'}
      </button>

      <div className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-3">
          {lang === 'id' ? 'Lengkapi Data Undangan' : 'Complete Invitation Data'}
        </h1>
        <p className="text-gray-500 dark:text-white/60">
          {lang === 'id' ? 'Silakan lengkapi informasi detail untuk undangan pernikahan Anda' : 'Please complete the detailed information for your wedding invitation'} (Kode: {orderCode}).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* URL Undangan */}
        <div className={`p-6 md:p-8 rounded-2xl ${themeMode === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-gray-100'}`}>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">{lang === 'id' ? 'URL Undangan' : 'Invitation URL'}</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Slug Undangan (URL Akhir)' : 'Invitation Slug (URL End)'}</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <span className="px-4 py-3 rounded-l-xl border-y border-l bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50 border-gray-200 dark:border-white/20">
                    yoursite.com/invitation/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    disabled
                    className={`${inputClass} rounded-l-none border-l-0 opacity-70 cursor-not-allowed`}
                  />
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-500">{lang === 'id' ? '* URL ini telah otomatis dibuat secara permanen saat pesanan dan tidak dapat diubah lagi.' : '* This URL was auto-generated permanently during order and cannot be changed.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mempelai */}
        <div className={`p-6 md:p-8 rounded-2xl ${themeMode === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-gray-100'}`}>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">{lang === 'id' ? 'Data Mempelai' : 'Couple Data'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Nama Mempelai Pria' : 'Groom Name'}</label>
              <input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Nama Orang Tua Mempelai Pria' : 'Groom Parents Name'}</label>
              <input type="text" name="groom_parents" value={formData.groom_parents} onChange={handleChange} placeholder={lang === 'id' ? "Putra dari Bapak ... & Ibu ..." : "Son of Mr. ... & Mrs. ..."} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Nama Mempelai Wanita' : 'Bride Name'}</label>
              <input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Nama Orang Tua Mempelai Wanita' : 'Bride Parents Name'}</label>
              <input type="text" name="bride_parents" value={formData.bride_parents} onChange={handleChange} placeholder={lang === 'id' ? "Putri dari Bapak ... & Ibu ..." : "Daughter of Mr. ... & Mrs. ..."} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Acara */}
        <div className={`p-6 md:p-8 rounded-2xl ${themeMode === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-gray-100'}`}>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">{lang === 'id' ? 'Detail Acara' : 'Event Details'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Waktu Akad / Pemberkatan' : 'Matrimony Time'}</label>
              <div className="relative">
                <input type="datetime-local" name="akad_date" value={formData.akad_date} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} className={`${inputClass} cursor-pointer shadow-sm`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Waktu Resepsi' : 'Reception Time'}</label>
              <div className="relative">
                <input type="datetime-local" name="resepsi_date" value={formData.resepsi_date} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} className={`${inputClass} cursor-pointer shadow-sm`} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>{lang === 'id' ? 'Nama & Alamat Lokasi' : 'Venue Name & Address'}</label>
              <textarea name="location_name" value={formData.location_name} onChange={handleChange} className={`${inputClass} min-h-[100px]`} placeholder={lang === 'id' ? "Contoh: Gedung Serbaguna ABC, Jl. Raya No. 123..." : "E.g. Grand Ballroom, 123 Main St..."} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>{lang === 'id' ? 'Link Google Maps' : 'Google Maps Link'}</label>
              <div className="flex gap-3">
                <input type="url" name="maps_link" value={formData.maps_link} onChange={handleChange} className={inputClass} placeholder="https://maps.app.goo.gl/..." />
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors whitespace-nowrap flex items-center font-medium shadow-sm"
                >
                  <MapPin size={18} className="mr-2 text-[#C5A059]" />
                  {lang === 'id' ? 'Cari Lokasi Saat Ini' : 'Find Current Location'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tambahan & Wallpaper */}
        <div className={`p-6 md:p-8 rounded-2xl ${themeMode === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-gray-100'}`}>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">{lang === 'id' ? 'Foto & Wallpaper Tema' : 'Photos & Theme Wallpaper'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Foto Sampul Undangan (Awal Masuk / Cover)' : 'Invitation Cover Photo'}</label>
              {formData.cover_image && !coverFile && (
                <img src={formData.cover_image} className="w-full h-32 object-cover rounded-xl mb-3 border border-gray-200 dark:border-white/10" alt="Cover" />
              )}
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'cover')} className={`${inputClass} !py-2`} />
            </div>
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Wallpaper Tema (Background Hero Section)' : 'Theme Wallpaper'}</label>
              {formData.hero_image && !heroFile && (
                <img src={formData.hero_image} className="w-full h-32 object-cover rounded-xl mb-3 border border-gray-200 dark:border-white/10" alt="Wallpaper" />
              )}
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'hero')} className={`${inputClass} !py-2`} />
            </div>
          </div>

          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">{lang === 'id' ? 'Cerita & Musik' : 'Story & Music'}</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Kisah Cinta (Opsional)' : 'Love Story (Optional)'}</label>
              <textarea name="story" value={formData.story} onChange={handleChange} className={`${inputClass} min-h-[120px]`} placeholder={lang === 'id' ? "Ceritakan singkat perjalanan cinta Anda..." : "Tell your love story briefly..."} />
            </div>
            <div>
              <label className={labelClass}>{lang === 'id' ? 'Pilih Musik Latar' : 'Background Music'}</label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{lang === 'id' ? 'Musik yang akan diputar otomatis ketika undangan dibuka' : 'Music that auto-plays when invitation is opened'}</p>
              <select name="music_url" value={formData.music_url} onChange={(e) => setFormData(prev => ({...prev, music_url: e.target.value}))} className={`${inputClass} cursor-pointer appearance-none`}>
                <option value="">{lang === 'id' ? '-- Tidak Memakai Musik --' : '-- No Music --'}</option>
                <option value="romantic_1.mp3">A Thousand Years - Instrumental</option>
                <option value="romantic_2.mp3">Perfect - Cover Acoustic</option>
                <option value="romantic_3.mp3">Canon in D - Piano</option>
                <option value="romantic_4.mp3">Beautiful in White - Piano</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-[#C5A059] text-white rounded-xl font-medium hover:bg-[#b08d4a] focus:ring-4 focus:ring-[#C5A059]/20 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                {lang === 'id' ? 'Simpan Data Undangan' : 'Save Invitation Data'}
              </>
            )}
          </button>
        </div>
      </form>

      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl relative ${themeMode === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'}`}>
            <button 
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-white/50"
            >
              <X size={20} />
            </button>
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-[#C5A059]" />
              </div>
              <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-2">Ambil Lokasi Saat Ini</h3>
              <p className="text-sm text-gray-500 dark:text-white/60">
                Kami akan meminta akses lokasi pada browser Anda untuk membuat letak peta secara otomatis.
              </p>
            </div>
            
            <button
              onClick={handleGetLocation}
              disabled={locLoading}
              className="w-full py-4 bg-[#C5A059] text-white rounded-xl font-medium hover:bg-[#b08d4a] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {locLoading ? (
                <><Loader2 size={20} className="animate-spin mr-2" /> Mengambil Lokasi...</>
              ) : (
                'Izinkan & Ambil Lokasi'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
