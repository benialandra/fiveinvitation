import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, ShoppingBag, Palette, LogOut, CheckCircle2, Clock, Database, Menu, Moon, Sun, Info, Settings, Loader2, Home as HomeIcon, Search, ChevronLeft, ChevronRight, ArrowUpDown, X, Upload as UploadIcon, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [password, setPassword] = useState('');
  const [themeOverrides, setThemeOverrides] = useState<Record<string, any>>({});
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'themes' | 'settings'>('dashboard');
  const [editingTheme, setEditingTheme] = useState<any>(null);
  
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
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
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ themes: themesToSeed })
         });
         const data = await res.json();
         if (!res.ok) throw new Error(data.error || 'Failed to seed');
         toast.success('Semua data tema berhasil dimasukkan ke database Supabase!');
         setDbThemes(themesToSeed);
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
    let baseThemes = dbThemes.length > 0 ? dbThemes : [...THEME_REGISTRY, ...uploadedThemes];
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

  const themePageSize = 6;
  const paginatedThemes = useMemo(() => {
    const startIndex = (themePage - 1) * themePageSize;
    return filteredThemes.slice(startIndex, startIndex + themePageSize);
  }, [filteredThemes, themePage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (password === adminPass) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
    } else {
      toast.error('Password salah.');
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
            <button type="submit" className="w-full h-12 gold-gradient text-black rounded-xl font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
              Log In
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
       <div className={`${isSidebarOpen ? 'w-72 border-r p-6' : 'w-0 overflow-hidden opacity-0 border-0 p-0'} flex flex-col transition-all duration-500 ease-in-out ${cardClass} rounded-none shadow-none z-20 relative`}>
          <div className="mb-12 mt-4 px-4 whitespace-nowrap">
             <h1 className="font-serif text-2xl tracking-[0.2em] font-light">FIVEINVITATION</h1>
             <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mt-1">Workspace</p>
          </div>
          <nav className="flex-1 space-y-2 w-full">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest ${activeTab === 'dashboard' ? activeTabClass : hoverClass}`}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest ${activeTab === 'orders' ? activeTabClass : hoverClass}`}>
              <ShoppingBag className="w-4 h-4" /> Orders
            </button>
            <button onClick={() => setActiveTab('themes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest ${activeTab === 'themes' ? activeTabClass : hoverClass}`}>
              <Palette className="w-4 h-4" /> Themes
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest ${activeTab === 'settings' ? activeTabClass : hoverClass}`}>
              <Settings className="w-4 h-4" /> Settings
            </button>
          </nav>

          <div className="mt-auto space-y-2">
            <button onClick={() => navigate('/')} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors text-sm uppercase tracking-widest font-medium border ${themeMode === 'dark' ? 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10' : 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10'}`}>
               <HomeIcon className="w-4 h-4" /> Go to Main Page
            </button>
            <button onClick={() => {
               sessionStorage.removeItem('adminAuth');
               setIsAuthenticated(false);
            }} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm uppercase tracking-widest font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
               <LogOut className="w-4 h-4" /> Log Out
            </button>
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
                <h2 className={`font-serif text-3xl mb-8 ${headingClass}`}>System Settings</h2>
                
                {/* Database Card */}
                <div className={`p-8 rounded-3xl border-2 ${themeMode === 'dark' ? 'border-[#C5A059]/30 glass-card text-white bg-black/20' : 'border-[#C5A059]/30 bg-white text-gray-900'} relative overflow-hidden shadow-2xl`}>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#C5A059]/5 to-transparent pointer-events-none"></div>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                          <Database className="w-6 h-6" />
                       </div>
                       <div>
                         <h3 className="text-xl font-serif">Supabase Database</h3>
                         <p className={`text-xs ${themeMode === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>Sistem menggunakan Supabase PostgreSQL</p>
                       </div>
                    </div>
                    
                    <div className="relative z-10 w-full max-w-4xl">
                       <p className={`text-sm leading-relaxed ${textDimClass}`}>
                          Sistem database Supabase telah dikonfigurasi pada source code. Anda hanya perlu membuat tabel pada project Supabase milik Anda sendiri dan memasukkan kredensial ke file environment.
                       </p>
                       <div className={`p-6 mt-6 rounded-2xl border ${borderDimClass} ${themeMode === 'dark' ? 'bg-black/40' : 'bg-gray-50/50'}`}>
                          <div className="flex items-center gap-3 mb-4">
                             <Info className={`w-5 h-5 ${themeMode === 'dark' ? 'text-[#C5A059]' : 'text-blue-500'}`} />
                             <h4 className={`font-semibold ${headingClass}`}>Panduan Singkat Setup</h4>
                          </div>
                          <ol className={`list-decimal list-inside space-y-3 text-sm leading-relaxed ${textDimClass}`}>
                             <li>Buka dashboard <b>Supabase</b> Anda dan arahkan ke SQL Editor.</li>
                             <li>Jalankan query SQL di bawah ini untuk menginisialisasi skema tabel pesanan:</li>
                             <pre className={`p-4 rounded-xl mt-3 overflow-x-auto border ${borderDimClass} ${themeMode === 'dark' ? 'bg-[#050505]' : 'bg-white'}`}>
                               <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
{`CREATE TABLE orders (
  id uuid default gen_random_uuid() primary key,
  unique_code text unique not null,
  groom_name text,
  bride_name text,
  theme_id text,
  status text default 'PENDING',
  customer_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);`}
                               </code>
                             </pre>
                             <li className="pt-2">Setelah berhasil, buka menu <b>Project Settings - API</b>.</li>
                             <li>Salin <b>Project URL</b> dan <b>anon public key</b>, masukkan sebagai environment <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>.</li>
                          </ol>
                       </div>

                       <div className={`p-6 mt-6 rounded-2xl border ${borderDimClass} ${themeMode === 'dark' ? 'bg-black/40' : 'bg-gray-50/50'}`}>
                          <div className="flex items-center gap-3 mb-4">
                             <Database className={`w-5 h-5 ${themeMode === 'dark' ? 'text-[#C5A059]' : 'text-blue-500'}`} />
                             <h4 className={`font-semibold ${headingClass}`}>Panduan Penyimpanan Foto (Storage)</h4>
                          </div>
                          <ol className={`list-decimal list-inside space-y-3 text-sm leading-relaxed ${textDimClass}`}>
                             <li>Untuk manajemen file gambar undangan, buka menu <b>Storage</b> di Supabase.</li>
                             <li>Klik <b>New Bucket</b> dan beri nama <code>wedding-assets</code>. Pastikan centang <b>Public bucket</b>.</li>
                             <li>Di dalam menu <b>Policies</b> pda bucket <code>wedding-assets</code>, berikan akses <code>SELECT</code>, <code>INSERT</code>, dan <code>UPDATE</code> kepada semua orang atau <code>anon</code> policy.</li>
                             <li>Setelah setup, aplikasi akan otomatis mengirim file foto (via halaman checkout) ke folder sesuai nama unik order tersebut untuk ditampilkan ditiap tema.</li>
                          </ol>
                       </div>

                       <div className={`p-6 mt-6 rounded-2xl border ${borderDimClass} ${themeMode === 'dark' ? 'bg-black/40' : 'bg-gray-50/50'}`}>
                          <div className="flex items-center gap-3 mb-4">
                             <Palette className={`w-5 h-5 ${themeMode === 'dark' ? 'text-[#C5A059]' : 'text-blue-500'}`} />
                             <h4 className={`font-semibold ${headingClass}`}>Menambah Tema Baru (HTML / React)</h4>
                          </div>
                          <div className={`space-y-4 text-sm leading-relaxed ${textDimClass}`}>
                             <p>Secara bawaan, aplikasi ini menggunakan komponen React. Namun jika Anda memiliki 1 folder penuh berisi file <code>index.html</code> dan folder <code>assets</code>, Anda bisa mengintegrasikannya dengan cara berikut:</p>
                             
                             <h5 className="font-semibold text-gray-900 dark:text-white mt-4">Metode 1: Menggunakan Folder Statis HTML (Tanpa Convert)</h5>
                             <ol className="list-decimal list-inside space-y-2 ml-2">
                                <li>Pindahkan folder tema HTML Anda (misal folder <code>tema-bunga</code>) ke dalam folder <b><code>public/</code></b> pada source code aplikasi ini.</li>
                                <li>Agar teks dalam file HTML bisa berubah sesuai data pesanan (seperti nama mempelai), Anda perlu menambahkan sedikit script JavaScript di dalam <code>index.html</code> Anda untuk membaca data dari <i>Query Parameter URL</i> atau localStorage.</li>
                                <li>Buat komponen React pembungkus (Iframe) di <code>src/themes/</code> yang merender file HTML tersebut. Contoh: <br/><code className={`p-1 px-2 rounded mt-2 inline-block ${themeMode === 'dark' ? 'bg-black/60' : 'bg-gray-100'}`}>{'<iframe src="/tema-bunga/index.html?bride=Salsa&groom=Beni" />'}</code></li>
                                <li>Daftarkan tema di file <code>src/themes/registry.ts</code>.</li>
                             </ol>

                             <h5 className="font-semibold text-gray-900 dark:text-white mt-6">Metode 2: Convert ke React (Disarankan)</h5>
                             <ol className="list-decimal list-inside space-y-2 ml-2">
                                <li>Buat file baru berakhiran <code>.tsx</code> di dalam folder <code>src/themes/</code> (Misal: <code>FloralTheme.tsx</code>).</li>
                                <li>Salin struktur baris HTML Anda ke dalam file komponen React tersebut.</li>
                                <li>Ganti class HTML statis menjadi dinamis dengan menangkap props (contoh: <code>{`{props.bride}`}</code>).</li>
                                <li>Tambahkan komponen Anda ke dalam array <code>THEME_REGISTRY</code> di file <code>src/themes/registry.ts</code>.</li>
                             </ol>
                          </div>
                       </div>
                       
                       <div className={`p-6 mt-6 rounded-2xl border ${borderDimClass} ${themeMode === 'dark' ? 'bg-black/40' : 'bg-gray-50/50'}`}>
                          <div className="flex items-center gap-3 mb-4">
                             <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#C5A059]/10 font-bold text-[#C5A059]">!</span>
                             <h4 className={`font-semibold ${headingClass}`}>Info Sistem Lainnya</h4>
                          </div>
                          <div className={`space-y-4 text-sm leading-relaxed ${textDimClass}`}>
                             <h5 className="font-semibold text-gray-900 dark:text-white mt-2">1. Ganti Password Admin</h5>
                             <p>Secara bawaan password login adalah <code>admin123</code>. Untuk menggantinya dengan aman tanpa mengubah kode, tambahkan variabel <code>VITE_ADMIN_PASSWORD=PasswordBaruKamu</code> di pengaturan environment server hosting Anda.</p>

                             <h5 className="font-semibold text-gray-900 dark:text-white mt-4">2. Integrasi Pembayaran Midtrans</h5>
                             <p>Saat ini checkout berjalan dengan simulasi di front-end. Untuk integrasi nyata yang aman (server-side):</p>
                             <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Aplikasikan backend berbasis Node.js/Express.</li>
                                <li>Minta midtrans SNAP Token dari API Server menggunakan Server Key rahasi.</li>
                                <li>Buat URL Endpoint (Webhook) untuk menerima notifikasi pembayaran masuk dan mengupdate status pada Supabase secara otomatis menjadi PAID.</li>
                             </ul>

                             <h5 className="font-semibold text-gray-900 dark:text-white mt-4">3. Otomatisasi Tema (Dynamic Database Theme)</h5>
                             <p>Menjawab kebutuhan Anda untuk tidak mau menambah file berulang kali (hardcode): Pendekatan terbaik adalah membuat 1 komponen master yang membaca dari database.</p>
                             <ul className="list-decimal list-inside space-y-2 ml-2">
                                <li>Di Supabase, buat tabel <code>themes</code> yang memuat field: Nama Tema, URL Gambar, dan URL Direktori Tema Statis Anda.</li>
                                <li>Ketika Anda upload tema lengkap (HTML) lewat S3 atau Supabase Storage, daftarkan linknya di database <code>themes</code> tadi.</li>
                                <li>Pada halaman tema (atau Preview Undangan), cukup buat satu buah komponen master saja yang membaca link tersebut dari Database lalu menampilkannya menggunakan elemen pembungkus <code>&lt;iframe src={"{url_sumber_html}"} &gt;</code>. Database akan mengurus pembaruan katalog tersebut 100% otomatis, tanpa Anda menyentuh source-code.</li>
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
                 <h2 className={`font-serif text-3xl ${headingClass}`}>Theme Catalog</h2>
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
                   <button 
                     onClick={handleSeedThemes} 
                     disabled={isSeeding}
                     className={`px-6 py-2.5 h-[42px] border text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2 ${themeMode === 'dark' ? 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10' : 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10'} ${isSeeding ? 'opacity-50 cursor-not-allowed' : ''}`}>
                     {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                     Seed DB
                   </button>
                   <button onClick={() => setIsUploadModalOpen(true)} className={`px-6 py-2.5 h-[42px] border text-xs uppercase tracking-widest rounded-xl transition-colors ${themeMode === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-gray-200 hover:bg-gray-100 text-gray-900'}`}>
                     Upload
                   </button>
                 </div>
               </div>
               
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
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {theme.sales} Terjual
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <button 
                                 onClick={() => {
                                   setEditingTheme({
                                     id: theme.id,
                                     name: theme.name,
                                     category: theme.category,
                                     price: theme.price,
                                     thumbnail: theme.thumbnail || '',
                                     file: null
                                   });
                                 }}
                                 className="px-4 py-2 bg-[#C5A059] text-white text-xs uppercase tracking-widest rounded-lg hover:bg-[#b08d4a] transition-colors"
                               >
                                 Edit Tema
                               </button>
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
               
               const loadingToast = toast.loading('Mengupload tema...');
               try {
                 const res = await fetch('/api/admin/themes', {
                   method: 'POST',
                   body: fd // send form data including the file
                 });
                 const result = await res.json();
                 
                 if (!res.ok) {
                   throw new Error(result.error || 'Failed to upload theme');
                 }
                 
                 toast.success('Upload Tema berhasil!', { id: loadingToast });
                 
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
                      thumbnail: (fd.get('thumbnail') as string) || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
                      sales: 0
                   };
                   const newArr = [newTheme, ...uploadedThemes];
                   setUploadedThemes(newArr);
                   localStorage.setItem('uploadedThemes', JSON.stringify(newArr));
                 }
                 
                 setIsUploadModalOpen(false);
               } catch (err: any) {
                 toast.error(err.message || 'Terjadi kesalahan saat upload', { id: loadingToast });
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
                    <label className="block text-sm font-medium mb-1">URL Gambar Cover (Opsional)</label>
                    <input name="thumbnail" className={`w-full px-4 py-2 border rounded-xl text-sm ${themeMode === 'dark' ? 'bg-white/5 border-white/10 focus:border-[#C5A059] text-white' : 'bg-gray-50 border-gray-200 focus:border-[#C5A059] text-gray-900'} outline-none transition-colors`} />
                  </div>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center relative overflow-hidden ${themeMode === 'dark' ? 'border-white/20 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                    <input type="file" name="zipFile" accept=".zip" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <UploadIcon className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />
                    <p className={`text-xs font-medium mb-1 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upload File ZIP Tema</p>
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
              try {
                const formData = new FormData();
                formData.append('name', editingTheme.name);
                formData.append('category', editingTheme.category);
                formData.append('price', String(editingTheme.price));
                if (editingTheme.file) {
                  formData.append('thumbnailFile', editingTheme.file);
                } else {
                  formData.append('thumbnail', editingTheme.thumbnail);
                }

                const res = await fetch(`/api/admin/themes/${editingTheme.id}/update`, {
                  method: 'POST',
                  body: formData
                });
                const result = await res.json();
                if (!res.ok) {
                  throw new Error(result.error || 'Failed to update theme');
                }
                toast.success('Tema berhasil diupdate!');
                setThemeOverrides(prev => ({
                   ...prev,
                   [editingTheme.id]: {
                      name: editingTheme.name,
                      category: editingTheme.category,
                      price: editingTheme.price,
                      thumbnail: result.thumbnail || editingTheme.thumbnail
                   }
                }));
                setEditingTheme(null);
              } catch (err: any) {
                toast.error(err.message);
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
                  <label className="block text-sm mb-1 text-gray-400">Thumbnail Image (Upload)</label>
                  {editingTheme.thumbnail && !editingTheme.file && (
                     <img src={editingTheme.thumbnail} alt="current thumbnail" className="w-full h-32 object-cover object-center rounded-xl mb-2" />
                  )}
                  <input type="file" accept="image/*" onChange={e => setEditingTheme({...editingTheme, file: e.target.files?.[0]})} className={`w-full px-4 py-2 rounded-xl border ${themeMode === 'dark' ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:border-[#C5A059]`} />
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

