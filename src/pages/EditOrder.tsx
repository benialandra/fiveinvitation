import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, Save, ArrowLeft, MapPin, X } from 'lucide-react';

export default function EditOrder() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const { themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

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
    slug: ''
  });

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
            slug: data.slug || ''
          });
        } else {
          alert('Pesanan tidak ditemukan.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${orderCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          akad_date: formData.akad_date ? new Date(formData.akad_date).toISOString() : null,
          resepsi_date: formData.resepsi_date ? new Date(formData.resepsi_date).toISOString() : null,
        }),
      });

      if (response.ok) {
        alert('Data berhasil disimpan!');
        navigate(`/track/${orderCode}`);
      } else {
        alert('Gagal menyimpan data.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
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
          alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.');
          setLocLoading(false);
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolokasi.');
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
        Kembali ke Status
      </button>

      <div className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-3">
          Lengkapi Data Undangan
        </h1>
        <p className="text-gray-500 dark:text-white/60">
          Silakan lengkapi informasi detail untuk undangan pernikahan Anda (Kode: {orderCode}).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* URL Undangan */}
        <div className={`p-6 md:p-8 rounded-2xl ${themeMode === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-gray-100'}`}>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">URL Undangan</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className={labelClass}>Slug Undangan (URL)</label>
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
              <p className="mt-2 text-xs text-gray-500 dark:text-white/40">URL ini otomatis dibuat dan tidak dapat diubah lagi.</p>
            </div>
          </div>
        </div>

        {/* Mempelai */}
        <div className={`p-6 md:p-8 rounded-2xl ${themeMode === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-gray-100'}`}>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">Data Mempelai</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nama Mempelai Pria</label>
              <input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Nama Orang Tua Mempelai Pria</label>
              <input type="text" name="groom_parents" value={formData.groom_parents} onChange={handleChange} placeholder="Putra dari Bapak ... & Ibu ..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nama Mempelai Wanita</label>
              <input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Nama Orang Tua Mempelai Wanita</label>
              <input type="text" name="bride_parents" value={formData.bride_parents} onChange={handleChange} placeholder="Putri dari Bapak ... & Ibu ..." className={inputClass} />
            </div>
          </div>
        </div>

        {/* Acara */}
        <div className={`p-6 md:p-8 rounded-2xl ${themeMode === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-gray-100'}`}>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">Detail Acara</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Waktu Akad / Pemberkatan</label>
              <div className="relative">
                <input type="datetime-local" name="akad_date" value={formData.akad_date} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} className={`${inputClass} cursor-pointer shadow-sm`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Waktu Resepsi</label>
              <div className="relative">
                <input type="datetime-local" name="resepsi_date" value={formData.resepsi_date} onChange={handleChange} min={new Date().toISOString().slice(0, 16)} className={`${inputClass} cursor-pointer shadow-sm`} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Nama & Alamat Lokasi</label>
              <textarea name="location_name" value={formData.location_name} onChange={handleChange} className={`${inputClass} min-h-[100px]`} placeholder="Contoh: Gedung Serbaguna ABC, Jl. Raya No. 123..." />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Link Google Maps</label>
              <div className="flex gap-3">
                <input type="url" name="maps_link" value={formData.maps_link} onChange={handleChange} className={inputClass} placeholder="https://maps.app.goo.gl/..." />
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors whitespace-nowrap flex items-center font-medium shadow-sm"
                >
                  <MapPin size={18} className="mr-2 text-[#C5A059]" />
                  Cari Lokasi Saat Ini
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tambahan */}
        <div className={`p-6 md:p-8 rounded-2xl ${themeMode === 'dark' ? 'bg-white/5 ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-gray-100'}`}>
          <h2 className="text-xl font-serif text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">Tambahan</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className={labelClass}>Kisah Cinta (Opsional)</label>
              <textarea name="story" value={formData.story} onChange={handleChange} className={`${inputClass} min-h-[120px]`} placeholder="Ceritakan singkat perjalanan cinta Anda..." />
            </div>
            <div>
              <label className={labelClass}>Pilih Musik Latar (Mockup)</label>
              <select name="music_url" value={formData.music_url} onChange={(e) => setFormData(prev => ({...prev, music_url: e.target.value}))} className={`${inputClass} cursor-pointer appearance-none`}>
                <option value="">-- Tidak Memakai Musik --</option>
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
                Simpan Data Undangan
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
