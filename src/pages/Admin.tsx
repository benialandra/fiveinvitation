import React, { useState, useEffect, useMemo } from 'react';
import imageCompression from 'browser-image-compression';
import { LayoutDashboard, ShoppingBag, Palette, LogOut, CheckCircle2, Clock, Database, Menu, Moon, Sun, Info, Settings, Loader2, Home as HomeIcon, Search, ChevronLeft, ChevronRight, ArrowUpDown, X, Upload as UploadIcon, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { THEME_REGISTRY } from '../themes/registry';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', orders: 12 },
  { name: 'Tue', orders: 19 },
  { name: 'Wed', orders: 15 },
  { name: 'Thu', orders: 28 },
  { name: 'Fri', orders: 35 },
  { name: 'Sat', orders: 42 },
  { name: 'Sun', orders: 38 },
];

export default function Admin() {
  const navigate = useNavigate();
  const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem('adminToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('adminToken'));
  const [loginLoading, setLoginLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [themeOverrides, setThemeOverrides] = useState<Record<string, any>>({});
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'themes' | 'settings'>('dashboard');
  const [editingTheme, setEditingTheme] = useState<any>(null);
  const [showDocs, setShowDocs] = useState(false);
  
  // Gallery files state for Add/Edit Theme
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     if (!e.target.files?.length) return;
     const files = Array.from(e.target.files);
     const currentTotal = galleryFiles.length + existingGallery.length;
     if (currentTotal + files.length > 5) {
        toast.error('Maksimal 5 foto!');
        return;
     }

     const newFiles: File[] = [];
     const newPreviews: string[] = [];

     const toastId = toast.loading('Mengompresi gambar...');
     try {
        for (const file of files) {
           const options = {
              maxSizeMB: 2,
              maxWidthOrHeight: 1920,
              useWebWorker: true
           };
           const compressedFile = await imageCompression(file as File, options);
           newFiles.push(compressedFile);
           newPreviews.push(URL.createObjectURL(compressedFile));
        }
        setGalleryFiles(prev => [...prev, ...newFiles]);
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
        toast.success('Gambar berhasil ditambahkan', { id: toastId });
     } catch (err) {
        toast.error('Gagal mengompresi gambar', { id: toastId });
     }
  };

  const removeGalleryFile = (index: number) => {
     URL.revokeObjectURL(galleryPreviews[index]);
     setGalleryFiles(prev => prev.filter((_, i) => i !== index));
     setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingGallery = (index: number) => {
     setExistingGallery(prev => prev.filter((_, i) => i !== index));
  };

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(10);
  const [orderSortBy, setOrderSortBy] = useState('created_at');
  const [orderSortDesc, setOrderSortDesc] = useState(true);

  // Themes State
  const [themeSearch, setThemeSearch] = useState('');
  const [themePage, setThemePage] = useState(1);
  const [themeSortBy, setThemeSortBy] = useState<'detail' | 'bestseller'>('detail');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploadTsxModalOpen, setIsUploadTsxModalOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('admin-theme');
    return (saved as 'dark' | 'light') || 'dark';
  });
  const [uploadedThemes, setUploadedThemes] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('uploadedThemes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [dbThemes, setDbThemes] = useState<any[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const bgClass = themeMode === 'dark' ? 'bg-[#0A0A0B] text-[#E5E5E5]' : 'bg-[#F4F4F5] text-gray-900';
  const cardClass = themeMode === 'dark' ? 'glass-card border-white/5' : 'bg-white border-gray-200 shadow-xl shadow-black/5 border';
  const inputClass = themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900';
  const textDimClass = themeMode === 'dark' ? 'text-white/50' : 'text-gray-500';
  const textMutedClass = themeMode === 'dark' ? 'text-white/40' : 'text-gray-400';
  const hoverClass = themeMode === 'dark' ? 'hover:bg-white/5 hover:text-white text-white/60' : 'hover:bg-gray-100 hover:text-gray-900 text-gray-600';
  const activeTabClass = themeMode === 'dark' ? 'bg-[#C5A059]/10 text-[#C5A059] font-bold border border-[#C5A059]/20' : 'bg-[#C5A059] text-black font-bold border border-[#C5A059]';
  const headingClass = themeMode === 'dark' ? 'text-white' : 'text-gray-900';
  const borderDimClass = themeMode === 'dark' ? 'border-white/5' : 'border-gray-200';

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  }, [themeMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
       setLoadingOrders(true);
       fetch('/api/orders')
         .then(res => res.json())
         .then(data => {
            setOrders(data);
            setLoadingOrders(false);
         })
         .catch(err => {
            console.error("Failed to load orders", err);
            setLoadingOrders(false);
         });
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if ((activeTab === 'themes' || activeTab === 'dashboard') && isAuthenticated) {
       setLoadingThemes(true);
       fetch('/api/themes')
         .then(res => res.json())
         .then(data => {
            if (Array.isArray(data) && data.length > 0) {
               setDbThemes(data);
            }
            setLoadingThemes(false);
         })
         .catch(err => {
            console.error("Failed to load themes", err);
            setLoadingThemes(false);
         });
    }
  }, [activeTab, isAuthenticated]);

  const handleSeedThemes = async () => {
      setIsSeeding(true);
      try {
         const themesToSeed = THEME_REGISTRY.map(t => ({
             id: t.id,
             name: t.name,
             category: t.category,
             price: t.price,
             thumbnail: t.thumbnail,
             sales: 0
         }));
          const res = await fetch('/api/admin/themes/seed', {
              method: 'POST',
              headers: adminHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify({ themes: themesToSeed })
          });
         const data = await res.json();
         if (!res.ok) throw new Error(data.error || 'Failed to seed');
         
         // Refetch from DB to ensure TSX and DB data are perfectly synced in the UI
         const refetchRes = await fetch('/api/themes', { headers: adminHeaders() });
         const refetchData = await refetchRes.json();
         if (Array.isArray(refetchData)) {
            setDbThemes(refetchData);
         }

         toast.success('Data tema TSX dan Database berhasil disinkronisasi!');
      } catch (err: any) {
         toast.error(err.message);
      } finally {
         setIsSeeding(false);
      }
  };

  // Process Orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    
    // Search
    if (orderSearch) {
      const lowerSearch = orderSearch.toLowerCase();
      result = result.filter(o => 
        (o.unique_code && o.unique_code.toLowerCase().includes(lowerSearch)) ||
        (o.groom_name && o.groom_name.toLowerCase().includes(lowerSearch)) ||
        (o.bride_name && o.bride_name.toLowerCase().includes(lowerSearch)) ||
        (o.theme_id && o.theme_id.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Sort
    result.sort((a, b) => {
      let valA = a[orderSortBy];
      let valB = b[orderSortBy];
      
      if (!valA) valA = '';
      if (!valB) valB = '';
      
      if (valA < valB) return orderSortDesc ? 1 : -1;
      if (valA > valB) return orderSortDesc ? -1 : 1;
      return 0;
    });
    
    return result;
  }, [orders, orderSearch, orderSortBy, orderSortDesc]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (orderPage - 1) * orderPageSize;
    return filteredOrders.slice(startIndex, startIndex + orderPageSize);
  }, [filteredOrders, orderPage, orderPageSize]);

  // Process Themes (Use dbThemes if available)
  const processedThemes = useMemo(() => {
    const baseThemes = (() => {
      const map = new Map();
      [...THEME_REGISTRY, ...uploadedThemes].forEach(t => map.set(t.id, t));
      dbThemes.forEach(dbT => {
        const existing = map.get(dbT.id) || {};
        map.set(dbT.id, { 
           ...existing, 
           ...dbT, 
           thumbnail: dbT.thumbnail || existing.thumbnail 
        });
      });
      return Array.from(map.values());
    })();
    return baseThemes.map((t, idx) => {
      const override = themeOverrides[t.id] || {};
      return {
        ...t,
        ...override,
        // Simulate sales based on string length and index for consistent dummy data
        sales: t.sales || (t.id.length * 10 + (50 - idx * 5))
      };
    });
  }, [dbThemes, THEME_REGISTRY, uploadedThemes, themeOverrides]);

  const filteredThemes = useMemo(() => {
    let result = [...processedThemes];
    
    if (themeSearch) {
      const lowerSearch = themeSearch.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(lowerSearch) || 
        t.category.toLowerCase().includes(lowerSearch)
      );
    }
    
    if (themeSortBy === 'bestseller') {
      result.sort((a, b) => b.sales - a.sales);
    } else {
      // sort by detail (alphabetical name)
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return result;
  }, [processedThemes, themeSearch, themeSortBy]);

  const themePageSize = 9;
  const paginatedThemes = useMemo(() => {
    const startIndex = (themePage - 1) * themePageSize;
    return filteredThemes.slice(startIndex, startIndex + themePageSize);
  }, [filteredThemes, themePage]);

  // Helper to create auth headers for admin API calls
  const adminHeaders = (extra?: Record<string, string>): Record<string, string> => ({
    'Authorization': `Bearer ${adminToken}`,
    ...extra
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Login failed.');
        return;
      }
      sessionStorage.setItem('adminToken', data.token);
      setAdminToken(data.token);
      setIsAuthenticated(true);
      toast.success('Login berhasil!');
    } catch (err: any) {
      toast.error('Gagal menghubungi server. Pastikan backend berjalan.');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 font-sans transition-colors duration-700 ${bgClass}`}>
        <div className={`p-10 rounded-3xl w-full max-w-sm ${cardClass}`}>
          <div className="mb-8 text-center text-[#E5E5E5]">
             <h1 className={`font-serif text-3xl font-light mb-2 ${headingClass}`}>Admin Portal</h1>
             <p className={`text-xs uppercase tracking-[0.2em] ${textDimClass}`}>Secure Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              placeholder="Admin Password"
              className={`w-full h-12 px-4 rounded-xl focus:border-[#C5A059] outline-none transition-colors ${inputClass}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" disabled={loginLoading} className="w-full h-12 gold-gradient text-black rounded-xl font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              {loginLoading ? 'Authenticating...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className={`min-h-screen flex font-sans transition-colors duration-700 ${bgClass}`}>
       {/* Sidebar */}
       <div className={`${isSidebarOpen ? 'w-72 border-r' : 'w-0 border-0'} transition-all duration-500 ease-in-out overflow-hidden shrink-0 ${cardClass} rounded-none shadow-none z-20 relative`}>
          <div className="w-72 h-full flex flex-col p-6">
             <div className="mb-12 mt-4 flex flex-col">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 border border-[#C5A059] rotate-45 flex items-center justify-center shrink-0">
                      <span className="-rotate-45 font-serif text-xl font-bold text-[#C5A059]">V</span>
                   </div>
                   <div className="overflow-hidden">
                      <h1 className="font-serif text-[13px] tracking-[0.15em] font-bold text-gray-900 dark:text-white truncate">FIVEINVITATION</h1>
                      <p className="text-[9px] uppercase tracking-widest text-[#C5A059] mt-0.5">Workspace</p>
                   </div>
                </div>
             </div>
             <nav className="flex-1 space-y-2 w-full">
               <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest ${activeTab === 'dashboard' ? activeTabClass : hoverClass}`}>
                 <LayoutDashboard className="w-4 h-4 shrink-0" /> <span className="truncate">Dashboard</span>
               </button>
               <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest ${activeTab === 'orders' ? activeTabClass : hoverClass}`}>
                 <ShoppingBag className="w-4 h-4 shrink-0" /> <span className="truncate">Orders</span>
               </button>
               <button onClick={() => setActiveTab('themes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest ${activeTab === 'themes' ? activeTabClass : hoverClass}`}>
                 <Palette className="w-4 h-4 shrink-0" /> <span className="truncate">Themes</span>
               </button>
               <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest ${activeTab === 'settings' ? activeTabClass : hoverClass}`}>
                 <Settings className="w-4 h-4 shrink-0" /> <span className="truncate">Settings</span>
               </button>
             </nav>

             <div className="mt-auto space-y-2">
               <button onClick={() => navigate('/')} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest font-medium border ${themeMode === 'dark' ? 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10' : 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10'}`}>
                  <HomeIcon className="w-4 h-4 shrink-0" /> <span className="truncate">Go to Main Page</span>
               </button>
               <button onClick={async () => {
                   try {
                     await fetch('/api/admin/logout', {
                       method: 'POST',
                       headers: adminHeaders()
                     });
                   } catch {}
                   sessionStorage.removeItem('adminToken');
                   setAdminToken(null);
                   setIsAuthenticated(false);
                }} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm uppercase tracking-widest font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                  <LogOut className="w-4 h-4 shrink-0" /> <span className="truncate">Log Out</span>
               </button>
             </div>
          </div>
       </div>

       {/* Main */}
       <div className="flex-1 flex flex-col h-screen overflow-hidden">
         {/* Top Header Controls */}
         <div className={`h-16 border-b flex items-center justify-between px-6 z-10 sticky top-0 ${cardClass} rounded-none shadow-none`}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl transition-colors ${hoverClass}`}>
               <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-xl transition-colors ${hoverClass}`}>
               {themeMode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
         </div>
         
         <div className="flex-1 overflow-y-auto">
           <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
              {activeTab === 'dashboard' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
                <header className="mb-10">
                   <h2 className={`font-serif text-4xl mb-2 ${headingClass}`}>Dashboard Overview</h2>
                   <p className={`text-sm ${textDimClass}`}>Review your business performance.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: 'Total Orders', value: '142', trend: '+12% this month' },
                    { label: 'Total Revenue', value: 'Rp 24,5M', trend: '+8% this month' },
                    { label: 'Active Themes', value: '12', trend: 'Updated today' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-3xl relative overflow-hidden group ${cardClass}`}>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#C5A059]/20 transition-colors"></div>
                       <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-2">{stat.label}</p>
                       <p className={`text-4xl font-serif mb-4 ${headingClass}`}>{stat.value}</p>
                       <p className={`text-[10px] uppercase tracking-wider ${textMutedClass}`}>{stat.trend}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-8 rounded-3xl ${cardClass}`}>
                   <h3 className={`font-serif text-2xl mb-6 ${headingClass}`}>Weekly Order Trend</h3>
                   <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeMode === 'dark' ? '#ffffff10' : '#00000010'} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: themeMode === 'dark' ? '#ffffff50' : '#00000050', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: themeMode === 'dark' ? '#ffffff50' : '#00000050', fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{ 
                               backgroundColor: themeMode === 'dark' ? '#111' : '#fff', 
                               borderRadius: '12px', 
                               border: `1px solid ${themeMode === 'dark' ? '#ffffff10' : '#00000010'}`,
                               color: themeMode === 'dark' ? '#fff' : '#000'
                            }} 
                          />
                          <Area type="monotone" dataKey="orders" stroke="#C5A059" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className={`font-serif text-3xl mb-8 ${headingClass}`}>Sistem & Dokumentasi</h2>
                
                <div className="space-y-6">
                  {/* Database & Storage */}
                  <div className={`p-8 rounded-3xl border-2 ${themeMode === 'dark' ? 'border-[#C5A059]/30 glass-card text-white bg-black/20' : 'border-[#C5A059]/30 bg-white text-gray-900'} relative overflow-hidden shadow-xl`}>
                      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#C5A059]/5 to-transparent pointer-events-none"></div>
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                            <Database className="w-6 h-6" />
                         </div>
                         <div>
                           <h3 className="text-xl font-serif">1. Database & Storage (Supabase)</h3>
                           <p className={`text-xs ${themeMode === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Tabel dan Media Assets</p>
                         </div>
                      </div>
                      
                      <div className="relative z-10 w-full text-sm leading-relaxed text-opacity-80">
                         <p className="mb-3">Platform ini menggunakan Supabase PostgreSQL untuk penyimpanan data dan Supabase Storage untuk media aset (foto galeri). Pastikan Anda telah menjalankan file <code className="text-[#C5A059]">supabase_schema.sql</code> di editor SQL Supabase Anda untuk membuat tabel <b>themes</b> dan <b>orders</b>.</p>
                         <p>Jangan lupa untuk membuat Storage Bucket bernama <code>fiveinvitation-bucket</code> dan atur aksesnya menjadi <b>Public</b> agar foto tema dan klien dapat diakses.</p>
                      </div>
                  </div>

                  {/* Payment Gateway */}
                  <div className={`p-8 rounded-3xl border-2 ${themeMode === 'dark' ? 'border-[#C5A059]/30 glass-card text-white bg-black/20' : 'border-[#C5A059]/30 bg-white text-gray-900'} relative overflow-hidden shadow-xl`}>
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                            <Settings className="w-6 h-6" />
                         </div>
                         <div>
                           <h3 className="text-xl font-serif">2. Payment Gateway (Midtrans)</h3>
                           <p className={`text-xs ${themeMode === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Automasi Pembayaran</p>
                         </div>
                      </div>
                      
                      <div className="relative z-10 w-full text-sm leading-relaxed text-opacity-80">
                         <p className="mb-3">Untuk menerima pembayaran instan, daftarkan akun di Midtrans dan dapatkan <code>Client Key</code> serta <code>Server Key</code> Anda.</p>
                         <p>Setelah aplikasi Anda dihosting (misalnya di Vercel), atur <b>Payment Notification URL</b> di dashboard Midtrans agar mengarah ke <code>https://domain-anda.com/api/webhook/midtrans</code>. Status <b>PENDING</b> pada Order akan otomatis berubah menjadi <b>PAID</b> ketika pelanggan selesai membayar.</p>
                      </div>
                  </div>

                  {/* Deployment Guide */}
                  <div className={`p-8 rounded-3xl border-2 ${themeMode === 'dark' ? 'border-[#C5A059]/30 glass-card text-white bg-black/20' : 'border-[#C5A059]/30 bg-white text-gray-900'} relative overflow-hidden shadow-xl`}>
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 rounded-2xl shadow-xl shadow-[#C5A059]/30 bg-gradient-to-tr from-[#C5A059] to-[#b08d4a] flex items-center justify-center text-white">
                            <UploadIcon className="w-6 h-6" />
                         </div>
                         <div>
                           <h3 className="text-xl font-serif text-[#C5A059] dark:text-[#E2C384]">3. Deployment (Vercel)</h3>
                           <p className={`text-xs font-medium uppercase tracking-widest ${themeMode === 'dark' ? 'text-[#C5A059]/60' : 'text-[#C5A059]/60'}`}>Hosting & Environment</p>
                         </div>
                      </div>
                      
                      <div className="relative z-10 w-full text-sm leading-relaxed text-opacity-80">
                         <p className="mb-4">Project ini dirancang untuk di-deploy ke <b>Vercel</b> karena menggunakan Vite Express untuk backend serverless.</p>
                         <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>Hubungkan repository GitHub Anda ke Vercel.</li>
                            <li>Pada saat deploy, atur <b>Environment Variables</b> berikut di pengaturan proyek Vercel:</li>
                         </ol>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <ul className="list-disc list-inside space-y-1 text-xs font-mono text-[#C5A059]">
                               <li>VITE_SUPABASE_URL</li>
                               <li>VITE_SUPABASE_ANON_KEY</li>
                               <li>VITE_ADMIN_PASSWORD</li>
                            </ul>
                            <ul className="list-disc list-inside space-y-1 text-xs font-mono text-[#C5A059]">
                               <li>VITE_MIDTRANS_CLIENT_KEY</li>
                               <li>MIDTRANS_SERVER_KEY</li>
                            </ul>
                         </div>
                      </div>
                  </div>
                </div>
              </div>
           )}

           {activeTab === 'orders' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <h2 className={`font-serif text-3xl ${headingClass}`}>Manage Orders</h2>
                 <div className="flex items-center gap-4 flex-wrap">
                   <div className="relative">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={orderSearch} 
                        onChange={e => {setOrderSearch(e.target.value); setOrderPage(1);}} 
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#C5A059] ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} w-full md:w-64`} 
                     />
                   </div>
                   <select 
                      value={orderPageSize} 
                      onChange={e => {setOrderPageSize(Number(e.target.value)); setOrderPage(1);}} 
                      className={`py-2.5 px-4 rounded-xl text-sm border focus:outline-none focus:border-[#C5A059] ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                   >
                     <option value={10}>10 per page</option>
                     <option value={50}>50 per page</option>
                     <option value={100}>100 per page</option>
                   </select>
                 </div>
               </div>
               
               <div className={`rounded-3xl overflow-hidden p-1 ${cardClass}`}>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className={`border-b ${borderDimClass}`}>
                        <tr>
                          <th onClick={() => { setOrderSortBy('unique_code'); setOrderSortDesc(orderSortBy === 'unique_code' ? !orderSortDesc : true); }} className={`px-6 py-4 text-xs uppercase tracking-widest font-medium ${textDimClass} cursor-pointer hover:text-[#C5A059] transition-colors`}>
                            <div className="flex items-center gap-2">Order ID <ArrowUpDown className="w-3 h-3" /></div>
                          </th>
                          <th onClick={() => { setOrderSortBy('groom_name'); setOrderSortDesc(orderSortBy === 'groom_name' ? !orderSortDesc : true); }} className={`px-6 py-4 text-xs uppercase tracking-widest font-medium ${textDimClass} cursor-pointer hover:text-[#C5A059] transition-colors`}>
                            <div className="flex items-center gap-2">Clients <ArrowUpDown className="w-3 h-3" /></div>
                          </th>
                          <th onClick={() => { setOrderSortBy('theme_id'); setOrderSortDesc(orderSortBy === 'theme_id' ? !orderSortDesc : true); }} className={`px-6 py-4 text-xs uppercase tracking-widest font-medium ${textDimClass} cursor-pointer hover:text-[#C5A059] transition-colors`}>
                            <div className="flex items-center gap-2">Theme <ArrowUpDown className="w-3 h-3" /></div>
                          </th>
                          <th onClick={() => { setOrderSortBy('status'); setOrderSortDesc(orderSortBy === 'status' ? !orderSortDesc : true); }} className={`px-6 py-4 text-xs uppercase tracking-widest font-medium ${textDimClass} cursor-pointer hover:text-[#C5A059] transition-colors`}>
                            <div className="flex items-center gap-2">Status <ArrowUpDown className="w-3 h-3" /></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${borderDimClass}`}>
                        {loadingOrders ? (
                           <tr>
                             <td colSpan={4} className={`px-6 py-12 text-center text-sm ${textDimClass}`}>
                               <div className="flex justify-center items-center">
                                  <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
                               </div>
                             </td>
                           </tr>
                        ) : paginatedOrders.length === 0 ? (
                           <tr>
                             <td colSpan={4} className={`px-6 py-8 text-center text-sm ${textDimClass}`}>
                               Belum ada data / data tidak ditemukan.
                             </td>
                           </tr>
                        ) : paginatedOrders.map((order: any, idx: number) => (
                           <tr key={idx} className={`transition-colors ${hoverClass}`}>
                             <td className={`px-6 py-4 font-mono text-sm ${headingClass}`}>{order.unique_code}</td>
                             <td className={`px-6 py-4 ${headingClass}`}>{order.groom_name} & {order.bride_name}</td>
                             <td className={`px-6 py-4 ${textDimClass}`}>{order.theme_id}</td>
                             <td className="px-6 py-4">
                                {order.status === 'PAID' ? (
                                  <span className="inline-flex items-center gap-2 text-green-500 text-xs uppercase tracking-wider bg-green-500/10 px-3 py-1.5 rounded-lg font-medium">
                                     <CheckCircle2 className="w-3 h-3" /> PAID
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 text-amber-500 text-xs uppercase tracking-wider bg-amber-500/10 px-3 py-1.5 rounded-lg font-medium">
                                     <Clock className="w-3 h-3" /> {order.status}
                                  </span>
                                )}
                             </td>
                           </tr>
                        ))}
                      </tbody>
                   </table>
                 </div>
                 
                 {/* Pagination */}
                 {filteredOrders.length > 0 && (
                   <div className={`p-4 border-t ${borderDimClass} flex items-center justify-between`}>
                     <p className={`text-xs ${textDimClass}`}>
                       Showing {((orderPage - 1) * orderPageSize) + 1} to {Math.min(orderPage * orderPageSize, filteredOrders.length)} of {filteredOrders.length} entries
                     </p>
                     <div className="flex gap-2 relative z-10">
                       <button 
                         onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                         disabled={orderPage === 1}
                         className={`p-2 rounded-lg border ${themeMode === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-gray-200 hover:bg-gray-100 text-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
                       >
                         <ChevronLeft className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => setOrderPage(p => p + 1)}
                         disabled={orderPage >= Math.ceil(filteredOrders.length / orderPageSize)}
                         className={`p-2 rounded-lg border ${themeMode === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-gray-200 hover:bg-gray-100 text-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
                       >
                         <ChevronRight className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           )}

           {activeTab === 'themes' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <div className="flex items-center gap-3">
                   <h2 className={`font-serif text-3xl ${headingClass}`}>Theme Catalog</h2>
                   <span className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] text-sm font-bold rounded-full font-sans tracking-widest border border-[#C5A059]/30">
                     {filteredThemes.length} Tema
                   </span>
                 </div>
                 <div className="flex items-center gap-4 flex-wrap">
                   <div className="relative">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Cari tema..." 
                        value={themeSearch} 
                        onChange={e => {setThemeSearch(e.target.value); setThemePage(1);}} 
                        className={`pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#C5A059] ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} w-full md:w-64`} 
                     />
                   </div>
                   <div className={`flex items-center rounded-xl p-1 border ${themeMode === 'dark' ? 'border-white/10 bg-black/50' : 'border-gray-200 bg-gray-50'}`}>
                     <button 
                       onClick={() => {setThemeSortBy('detail'); setThemePage(1);}}
                       className={`px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-lg transition-colors ${themeSortBy === 'detail' ? (themeMode === 'dark' ? 'bg-white/10 text-white' : 'bg-white shadow text-gray-900') : textDimClass}`}
                     >
                       By Detail
                     </button>
                     <button 
                       onClick={() => {setThemeSortBy('bestseller'); setThemePage(1);}}
                       className={`px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-lg transition-colors ${themeSortBy === 'bestseller' ? (themeMode === 'dark' ? 'bg-white/10 text-white' : 'bg-white shadow text-gray-900') : textDimClass}`}
                     >
                       Terlaris
                     </button>
                   </div>
                   <div className="relative group/admin-actions">
                     <button className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${themeMode === 'dark' ? 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10' : 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10'}`}>
                        <Settings className="w-5 h-5" />
                     </button>
                     <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/admin-actions:opacity-100 group-hover/admin-actions:visible transition-all flex flex-col overflow-hidden origin-top-right z-30">
                        <button 
                          onClick={handleSeedThemes} 
                          disabled={isSeeding}
                          className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 border-b border-black/5 dark:border-white/5 text-gray-900 dark:text-white transition-colors flex items-center gap-3 ${isSeeding ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isSeeding ? <Loader2 size={14} className="animate-spin text-[#C5A059]" /> : <Database size={14} className="text-[#C5A059]" />} Seed DB
                        </button>
                        <button 
                          onClick={() => setShowDocs(!showDocs)} 
                          className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 border-b border-black/5 dark:border-white/5 text-gray-900 dark:text-white transition-colors flex items-center gap-3"
                        >
                          <Info size={14} className="text-[#C5A059]" /> Panduan
                        </button>
                        <button 
                          onClick={() => setIsUploadTsxModalOpen(true)} 
                          className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 border-b border-black/5 dark:border-white/5 text-gray-900 dark:text-white transition-colors flex items-center gap-3"
                        >
                          <UploadIcon size={14} className="text-sky-500" /> Upload TSX
                        </button>
                        <button 
                          onClick={() => setIsUploadModalOpen(true)} 
                          className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white transition-colors flex items-center gap-3"
                        >
                          <Database size={14} className="text-emerald-500" /> Data JSON
                        </button>
                     </div>
                   </div>
                 </div>
               </div>
               
               {showDocs && (
                 <div className={`p-6 mb-8 rounded-3xl ${themeMode === 'dark' ? 'bg-[#C5A059]/10 border border-[#C5A059]/20 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}>
                    <h3 className="text-lg font-serif mb-4 flex items-center gap-2"><Info size={20} className="text-[#C5A059]" /> Panduan Pembuatan Tema Baru</h3>
                    
                    <div className="space-y-4 text-sm opacity-90 leading-relaxed text-left">
                       <p>
                          Anda dapat membuat tema dengan konfigurasi murni JSON menggunakan <strong>Database JSON Config</strong> saat mengedit atau menambahkan tema. Opsi ini membuat Anda tidak perlu mengunggah file source code (.zip) dan cukup mengubah konfigurasi komponen standar MasterTheme yang sudah ada (komponen ini membaca JSON).
                       </p>
                       <div>
                          <strong className="text-[#C5A059]">Format JSON Tema:</strong>
                          <pre className={`p-4 rounded-xl text-xs overflow-x-auto mt-2 ${themeMode === 'dark' ? 'bg-black/50 text-emerald-400' : 'bg-gray-900 text-emerald-400'}`}>
{`{
  "colors": {
    "primary": "#C5A059",
    "background": "#FFFFFF",
    "text": "#1A1A1A"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Inter"
  },
  "music": "https://url-file.mp3",
  "content": {
    "groom": "Beni",
    "bride": "Salsa",
    "date": "12 Desember 2026",
    "ceremonyTime": "09:00 WIB",
    "ceremonyLocation": "Hotel Mulia, Jakarta",
    "receptionTime": "11:00 WIB",
    "receptionLocation": "Grand Ballroom Hotel Mulia",
    "message": "Terima kasih atas doa restunya."
  },
  "layout": [
    { "type": "hero" },
    { "type": "couple" },
    { "type": "events" },
    { "type": "gallery" }
  ]
}`}
                          </pre>
                       </div>
                       <ul className="list-disc pl-5 space-y-2 mt-4">
                          <li><strong>music:</strong> Properti opsional untuk autoplay latar musik (butuh link audio .mp3).</li>
                          <li><strong>content:</strong> Anda dapat menimpa konten teks (mempelai, tanggal, tempat, dsb). Jika dikosongkan, tema akan mengambil sampel konten default.</li>
                          <li><strong>Gallery:</strong> Saat Anda mengunggah lima foto dari fitur "Upload Gambar Tema", foto tersebut otomatis masuk ke key <code>gallery</code> pada config JSON dan akan merender foto-foto baru di blok galeri.</li>
                       </ul>
                    </div>
                 </div>
               )}

               {paginatedThemes.length === 0 ? (
                 <div className={`p-12 text-center rounded-3xl ${cardClass} ${textDimClass}`}>
                    Tema tidak ditemukan.
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                   {paginatedThemes.map((theme, i) => (
                      <div key={theme.id} className={`rounded-3xl overflow-hidden group ${cardClass}`}>
                         <div className="aspect-[16/10] bg-black/50 relative overflow-hidden">
                            <img src={theme.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={theme.name} />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {theme.sales} Terjual
                            </div>
                            
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                               <div className="relative group/menu">
                                  <button className="p-2 bg-black/60 backdrop-blur-sm text-white rounded-full hover:bg-[#C5A059] transition-colors shadow-lg">
                                     <Settings className="w-4 h-4" />
                                  </button>
                                  <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all flex flex-col overflow-hidden origin-top-right">
                                     <button 
                                       onClick={() => {
                                         let gals = [];
                                         if (theme.config_json && Array.isArray(theme.config_json.gallery)) {
                                            gals = theme.config_json.gallery;
                                         } else if (theme.thumbnail) {
                                            gals = [theme.thumbnail];
                                         }
                                         setExistingGallery(gals);
                                         setGalleryFiles([]);
                                         setGalleryPreviews([]);
                                         setEditingTheme({
                                           id: theme.id,
                                           name: theme.name,
                                           category: theme.category,
                                           price: theme.price,
                                           thumbnail: theme.thumbnail || '',
                                           config_json: theme.config_json || null
                                         });
                                       }}
                                       className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 border-b border-black/5 dark:border-white/5 text-gray-900 dark:text-white transition-colors"
                                     >
                                       Edit Tema
                                     </button>
                                     <a 
                                       href={`/preview/${theme.id}`} target="_blank" rel="noopener noreferrer"
                                       className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white transition-colors"
                                     >
                                       Preview
                                     </a>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div className="p-6">
                             <h3 className={`font-serif text-xl mb-1 ${headingClass}`}>{theme.name}</h3>
                             <p className="text-xs uppercase tracking-widest text-[#C5A059]">{theme.category}</p>
                         </div>
                      </div>
                   ))}
                 </div>
               )}
               
               {/* Pagination for Themes */}
               {filteredThemes.length > themePageSize && (
                 <div className="flex justify-center items-center gap-4 mt-8">
                   <button 
                     onClick={() => setThemePage(p => Math.max(1, p - 1))}
                     disabled={themePage === 1}
                     className={`p-3 rounded-full border ${themeMode === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-gray-200 hover:bg-gray-100 text-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
                   >
                     <ChevronLeft className="w-5 h-5" />
                   </button>
                   <span className={`text-sm ${textDimClass}`}>
                     Page {themePage} of {Math.ceil(filteredThemes.length / themePageSize)}
                   </span>
                   <button 
                     onClick={() => setThemePage(p => p + 1)}
                     disabled={themePage >= Math.ceil(filteredThemes.length / themePageSize)}
                     className={`p-3 rounded-full border ${themeMode === 'dark' ? 'border-white/10 hover:bg-white/10 text-white' : 'border-gray-200 hover:bg-gray-100 text-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
                   >
                     <ChevronRight className="w-5 h-5" />
                   </button>
                 </div>
               )}
             </div>
           )}

          </div>
         </div>
        </div>
     </div>
      {isUploadTsxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-xl relative ${themeMode === 'dark' ? 'bg-[#111] border border-white/10' : 'bg-white'}`}>
            <button 
              onClick={() => setIsUploadTsxModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-white/50"
            >
              <X size={20} />
            </button>
            <div className="mb-6">
              <h3 className={`text-xl font-serif mb-1 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upload Component TSX</h3>
              <p className="text-sm text-gray-500 dark:text-white/60">
                Fitur Developer: Upload desain komponen tema berbasis React (.tsx) yang akan disuntikkan ke registry. Hanya berjalan dengan sempurna jika diakses di Localhost Development Mode.
              </p>
            </div>
            
            <form onSubmit={async (e) => {
               e.preventDefault();
               const form = e.currentTarget;
               const fd = new FormData(form);
               
               const loadingToast = toast.loading('Mengupload TSX Component...');
               try {
                 const res = await fetch('/api/admin/themes/upload-component', {
                   method: 'POST',
                   body: fd
                 });
                 const result = await res.json();
                 
                 if (!res.ok) {
                   throw new Error(result.error || 'Gagal mengupload component TSX');
                 }
                 
                 toast.success('Upload Component berhasil! Silakan restart server dev.', { id: loadingToast, duration: 4000 });
                 setIsUploadTsxModalOpen(false);
               } catch (err: any) {
                 if (err.message === 'Failed to fetch') {
                    toast.error('Koneksi terputus.', { id: loadingToast });
                 } else {
                    toast.error(err.message, { id: loadingToast });
                 }
               }
            }}>
                <div className="space-y-4 mb-6 text-left">
                  <div>
                    <label className="block text-sm font-medium mb-1">ID Tema (Unik)</label>
                    <input name="id" required placeholder="contoh: autumn-leaves" className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-white/5 border-white/10 focus:border-sky-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-sky-500 text-gray-900'} outline-none transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Tema</label>
                    <input name="name" required placeholder="Autumn Leaves" className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-white/5 border-white/10 focus:border-sky-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-sky-500 text-gray-900'} outline-none transition-colors`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Fungsi Component (PascalCase)</label>
                    <input name="componentName" required placeholder="AutumnLeaves" className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-white/5 border-white/10 focus:border-sky-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-sky-500 text-gray-900'} outline-none transition-colors`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kategori</label>
                      <select name="category" required className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white focus:border-sky-500' : 'bg-gray-50 border-gray-200 focus:border-sky-500 text-gray-900'} outline-none transition-colors`}>
                        <option value="Elegant">Elegant</option>
                        <option value="Dark">Dark</option>
                        <option value="Minimalist">Minimalist</option>
                        <option value="Islamic">Islamic</option>
                        <option value="Floral">Floral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
                      <input name="price" type="number" required defaultValue="150000" className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-white/5 border-white/10 focus:border-sky-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-sky-500 text-gray-900'} outline-none transition-colors`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL Thumbnail (Opsional)</label>
                    <input name="thumbnail" type="text" placeholder="https://unsplash.com/..." className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-white/5 border-white/10 focus:border-sky-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-sky-500 text-gray-900'} outline-none transition-colors`} />
                  </div>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center relative overflow-hidden ${themeMode === 'dark' ? 'border-sky-500/30 bg-sky-500/5' : 'border-sky-200 bg-sky-50'}`}>
                    <input type="file" name="componentFile" required accept=".tsx,.ts" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <UploadIcon className="w-8 h-8 mx-auto mb-2 text-sky-500" />
                    <p className={`text-xs font-medium mb-1 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upload File TSX Tema Anda</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsUploadTsxModalOpen(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${themeMode === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-sky-500/25"
                  >
                    Simpan & Daftarkan TSX
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-xl relative ${themeMode === 'dark' ? 'bg-[#111] border border-white/10' : 'bg-white'}`}>
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-white/50"
            >
              <X size={20} />
            </button>
            <div className="mb-6">
              <h3 className={`text-xl font-serif mb-1 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upload Master Tema Baru</h3>
              <p className="text-sm text-gray-500 dark:text-white/60">
                Fitur ini disimulasikan. Tema akan ditambahkan ke state lokal secara dinamis.
              </p>
            </div>
            
            <form onSubmit={async (e) => {
               e.preventDefault();
               const form = e.currentTarget;
               const fd = new FormData(form);
               
               const loadingToast = toast.loading('Mengupload gambar ke Supabase...');
               try {
                 // Upload images to Supabase first
                 let uploadedUrls: string[] = [];
                 for (const file of galleryFiles) {
                    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
                    const { error } = await supabase.storage.from('fiveinvitation-bucket').upload(`uploads/${fileName}`, file, { cacheControl: '3600', upsert: false });
                    if (error) throw error;
                    const { data } = supabase.storage.from('fiveinvitation-bucket').getPublicUrl(`uploads/${fileName}`);
                    uploadedUrls.push(data.publicUrl);
                 }

                 // Merge to config_json
                 let currentConfig = fd.get('config_json') as string;
                 let parsedConfig: any = {};
                 if (currentConfig) {
                    try { parsedConfig = JSON.parse(currentConfig); } catch (e) {}
                 }
                 if (uploadedUrls.length > 0) {
                    parsedConfig.gallery = uploadedUrls;
                 }
                 
                 const configString = JSON.stringify(parsedConfig);
                 fd.set('config_json', configString);
                 if (uploadedUrls.length > 0) {
                   fd.set('thumbnail', uploadedUrls[0]);
                 }
                 
                 toast.loading('Menyimpan tema...', { id: loadingToast });
                 
                 const res = await fetch('/api/admin/themes', {
                   method: 'POST',
                   body: fd
                 });
                 const result = await res.json();
                 
                 if (!res.ok) {
                   throw new Error(result.error || 'Failed to upload theme');
                 }
                 
                 toast.success('Upload Tema berhasil!', { id: loadingToast });
                 setGalleryFiles([]);
                 setGalleryPreviews([]);
                 
                 // if using real db themes, add it
                 if (result.theme) {
                   setDbThemes(prev => [result.theme, ...prev]);
                 } else {
                   // mock flow fallback
                   const newTheme = {
                      id: `mock-${Date.now()}`,
                      name: fd.get('name') as string,
                      category: fd.get('category') as string,
                      price: Number(fd.get('price')),
                      thumbnail: uploadedUrls[0] || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60',
                      sales: 0,
                      config_json: parsedConfig
                   };
                   const newArr = [newTheme, ...uploadedThemes];
                   setUploadedThemes(newArr);
                   localStorage.setItem('uploadedThemes', JSON.stringify(newArr));
                 }
                 
                 setIsUploadModalOpen(false);
               } catch (err: any) {
                 if (err.message === 'Failed to fetch') {
                    toast.error('Koneksi terputus. Pastikan AdBlocker/Brave Shields dimatikan, dan server tidak sedang restart.', { id: loadingToast, duration: 6000 });
                 } else {
                    toast.error(err.message || 'Terjadi kesalahan saat upload', { id: loadingToast });
                 }
               }
            }}>
                <div className="space-y-4 mb-6 text-left">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Tema</label>
                    <input name="name" required className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-white/5 border-white/10 focus:border-[#C5A059] text-white' : 'bg-gray-50 border-gray-200 focus:border-[#C5A059] text-gray-900'} outline-none transition-colors`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kategori</label>
                      <select name="category" required className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-[#1a1a1a] border-white/10 focus:border-[#C5A059] text-white' : 'bg-gray-50 border-gray-200 focus:border-[#C5A059] text-gray-900'} outline-none transition-colors`}>
                        <option value="Premium">Premium</option>
                        <option value="Minimalist">Minimalist</option>
                        <option value="Elegant">Elegant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
                      <input name="price" type="number" required defaultValue="150000" className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-white/5 border-white/10 focus:border-[#C5A059] text-white' : 'bg-gray-50 border-gray-200 focus:border-[#C5A059] text-gray-900'} outline-none transition-colors`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Gambar Tema (Maks 5 Foto max 2MB)</label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center relative overflow-hidden ${themeMode === 'dark' ? 'border-white/20 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                       <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                       <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />
                       <p className={`text-xs font-medium mb-1 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Klik atau Drag untuk upload foto</p>
                    </div>
                    {galleryPreviews.length > 0 && (
                       <div className="grid grid-cols-5 gap-2 mt-3">
                          {galleryPreviews.map((preview, idx) => (
                             <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                <button type="button" onClick={() => removeGalleryFile(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                                   <X size={12} />
                                </button>
                             </div>
                          ))}
                       </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 tracking-wide flex justify-between items-center">
                       <span>Database JSON Config (Opsional)</span>
                       <span className="text-[10px] bg-[#C5A059] text-white px-2 py-0.5 rounded">Dynamic UI</span>
                    </label>
                    <textarea name="config_json" rows={4} placeholder='{"colors": {"primary": "#C5...}}' className={`w-full px-4 py-3 border rounded-xl text-xs font-mono ${themeMode === 'dark' ? 'bg-black/80 border-white/10 focus:border-[#C5A059] text-emerald-400' : 'bg-gray-900 border-gray-900 focus:border-[#C5A059] text-emerald-400'} outline-none transition-colors`}></textarea>
                    <p className={`text-[10px] mt-1 ${themeMode === 'dark' ? 'text-white/40' : 'text-gray-500'}`}>Isi JSON untuk merender MasterTheme dinamis. Kosongkan untuk pakai React component lama dari zip.</p>
                  </div>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center relative overflow-hidden ${themeMode === 'dark' ? 'border-white/20 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                    <input type="file" name="zipFile" accept=".zip" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <UploadIcon className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />
                    <p className={`text-xs font-medium mb-1 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upload File ZIP Tema (Abaikan jika pakai JSON)</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${themeMode === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-[#C5A059] hover:bg-[#b08d4a] text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-[#C5A059]/25"
                  >
                    Simpan & Upload
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
      {editingTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-xl relative my-8 ${themeMode === 'dark' ? 'bg-[#111] border border-white/10 text-white' : 'bg-white text-gray-900'}`}>
            <button 
              onClick={() => setEditingTheme(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-white/50"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-serif mb-6">Edit Tema</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
                const loadingToast = toast.loading('Mengupload ke Supabase...');
                try {
                 // Upload new images to Supabase
                 let newUploadedUrls: string[] = [];
                 for (const file of galleryFiles) {
                    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
                    const { error } = await supabase.storage.from('fiveinvitation-bucket').upload(`uploads/${fileName}`, file, { cacheControl: '3600', upsert: false });
                    if (error) throw error;
                    const { data } = supabase.storage.from('fiveinvitation-bucket').getPublicUrl(`uploads/${fileName}`);
                    newUploadedUrls.push(data.publicUrl);
                 }

                 let parsedConfig = typeof editingTheme.config_json === 'string' ? JSON.parse(editingTheme.config_json) : (editingTheme.config_json || {});
                 const combinedGallery = [...existingGallery, ...newUploadedUrls];
                 if (combinedGallery.length > 0) {
                    parsedConfig.gallery = combinedGallery;
                 }

                 const formData = new FormData();
                 formData.append('name', editingTheme.name);
                 formData.append('category', editingTheme.category);
                 formData.append('price', String(editingTheme.price));
                 formData.append('config_json', JSON.stringify(parsedConfig));
               formData.append('thumbnail', combinedGallery.length > 0 ? combinedGallery[0] : (editingTheme.thumbnail || ''));
                 
                 // Pass keep_images to backend just in case
                 formData.append('keep_images', JSON.stringify(existingGallery));
                 
                 toast.loading('Menyimpan perubahan...', { id: loadingToast });

                 const res = await fetch(`/api/admin/themes/${editingTheme.id}`, {
                   method: 'PUT',
                   body: formData
                 });
                 const result = await res.json();
                 if (!res.ok) {
                   throw new Error(result.error || 'Failed to update theme');
                 }
                 toast.success('Tema berhasil diupdate!', { id: loadingToast });
                 setThemeOverrides(prev => ({
                    ...prev,
                    [editingTheme.id]: {
                       name: editingTheme.name,
                       category: editingTheme.category,
                       price: editingTheme.price,
                       thumbnail: result.thumbnail || editingTheme.thumbnail || combinedGallery[0],
                       config_json: parsedConfig
                    }
                 }));
                 setEditingTheme(null);
                 setGalleryFiles([]);
                 setGalleryPreviews([]);
              } catch (err: any) {
                if (err.message === 'Failed to fetch') {
                  toast.error('Koneksi terputus. Pastikan AdBlocker/Brave Shields dimatikan, dan server tidak sedang restart.', { id: loadingToast, duration: 6000 });
                } else {
                  toast.error(err.message, { id: loadingToast });
                }
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Nama Tema</label>
                  <input required type="text" value={editingTheme.name} onChange={e => setEditingTheme({...editingTheme, name: e.target.value})} className={`w-full px-4 py-2 rounded-xl border ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-[#C5A059]`} />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Kategori</label>
                  <select value={editingTheme.category} onChange={e => setEditingTheme({...editingTheme, category: e.target.value})} className={`w-full px-4 py-2 rounded-xl border ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-[#C5A059]`}>
                    <option value="Elegant">Elegant</option>
                    <option value="Dark">Dark</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Islamic">Islamic</option>
                    <option value="Floral">Floral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Harga (Rp)</label>
                  <input required type="number" value={editingTheme.price} onChange={e => setEditingTheme({...editingTheme, price: Number(e.target.value)})} className={`w-full px-4 py-2 rounded-xl border ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-[#C5A059]`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 tracking-wide flex justify-between items-center text-gray-400">
                     <span>Database JSON Config (Opsional)</span>
                  </label>
                  <textarea rows={4} value={typeof editingTheme.config_json === 'string' ? editingTheme.config_json : JSON.stringify(editingTheme.config_json, null, 2) || ''} onChange={e => setEditingTheme({...editingTheme, config_json: e.target.value})} className={`w-full px-4 py-2 rounded-xl border text-xs font-mono ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-emerald-400' : 'bg-gray-900 border-gray-900 text-emerald-400'} focus:outline-none focus:border-[#C5A059]`} placeholder='{"colors": {"primary": "#C5...}}'></textarea>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-400">Upload Gambar Tema (Maks 5 Foto max 2MB)</label>
                  
                  {/* Existing gallery previews */}
                  {existingGallery.length > 0 && (
                     <div className="grid grid-cols-5 gap-2 mb-3">
                        {existingGallery.map((url, idx) => (
                           <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                              <img src={url} className="w-full h-full object-cover" alt="Saved" />
                              <button type="button" onClick={() => removeExistingGallery(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                                 <X size={12} />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}

                  <div className={`border-2 border-dashed rounded-xl p-4 text-center relative overflow-hidden ${themeMode === 'dark' ? 'border-white/20 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                     <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                     <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />
                     <p className={`text-xs font-medium mb-1 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Klik atau Drag untuk tambah foto</p>
                  </div>
                  
                  {/* New gallery previews */}
                  {galleryPreviews.length > 0 && (
                     <div className="grid grid-cols-5 gap-2 mt-3">
                        {galleryPreviews.map((preview, idx) => (
                           <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                              <button type="button" onClick={() => removeGalleryFile(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                                 <X size={12} />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setEditingTheme(null)} className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${themeMode === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>Batal</button>
                <button type="submit" className="px-6 py-2 bg-[#C5A059] hover:bg-[#b08d4a] text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-[#C5A059]/25">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
   )
}

