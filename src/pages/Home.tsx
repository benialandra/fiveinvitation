import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Star, Quote, Search, PenTool, CheckCircle, Zap, ArrowRight } from 'lucide-react';

const RECENT_ORDERS = [
  { id: 1, names: "Beni & Deti", theme: "Elegant Minimalist", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=300" },
  { id: 2, names: "Andi & Rina", theme: "Floral Romance", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=300" },
  { id: 3, names: "Dimas & Putri", theme: "Classic Gold", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=300" },
  { id: 4, names: "Reza & Maya", theme: "Modern Dark", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=300" },
  { id: 5, names: "Budi & Siska", theme: "Rustic Earth", image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=300" },
  { id: 6, names: "Kevin & Laura", theme: "Ocean Blue", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=300" },
  { id: 7, names: "Rizky & Dina", theme: "Vintage Lace", image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=300" },
  { id: 8, names: "Arif & Nisa", theme: "Tropical Vibe", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=300" },
  { id: 9, names: "Ivan & Bella", theme: "Minimalist White", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=300" },
  { id: 10, names: "Fajar & Tari", theme: "Luxury Gold", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=300" },
];

const TESTIMONIALS = [
  { id: 1, name: "Irene & Seulgi", comment: "Desainnya luar biasa elegan dan prosesnya sangat cepat! Fitur Midtrans bikin semuanya praktis. Tamu banyak yang terkesan dengan tema yang kami pilih.", rating: 5 },
  { id: 2, name: "Deti & Beni", comment: "Tema yang disediakan sangat modern. Tamu-tamu undangan banyak yang memuji undangan digital kami. Benar-benar sesuai dengan ekspektasi!", rating: 5 },
  { id: 3, name: "Nisa & Arif", comment: "Tanpa ribet harus daftar, langsung isi form dan undangan jadi seketika. Sangat direkomendasikan untuk pasangan yang mencari undangan eksklusif.", rating: 5 },
];

const ABOUT_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=800"
];

export default function Home() {
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState('');
  const { lang, themeMode } = useOutletContext<{ lang: 'en' | 'id', themeMode: string }>();

  // Randomize hero orders on every page load
  const randomHeroOrders = useMemo(() => {
    const shuffled = [...RECENT_ORDERS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const [aboutImgIndex, setAboutImgIndex] = useState(() => Math.floor(Math.random() * ABOUT_IMAGES.length));

  const handleChangeAboutImage = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * ABOUT_IMAGES.length);
    } while (newIndex === aboutImgIndex && ABOUT_IMAGES.length > 1);
    setAboutImgIndex(newIndex);
  };

  const handleTrackCode = () => {
    if (trackId.trim()) {
      navigate(`/track/${trackId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center px-6 lg:pl-24 xl:pl-32 lg:pr-8 py-12 lg:py-0 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0 }}
            className="mb-4 inline-flex items-center gap-2 text-[#C5A059]"
          >
            <span className="w-8 h-[1px] bg-[#C5A059]"></span>
            <span className="text-xs uppercase tracking-[0.4em] font-medium">Premium Digital Invitation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
            className="font-serif text-5xl md:text-7xl leading-[1.1] mb-6 font-light text-gray-900 dark:text-white"
          >
            {lang === 'id' ? 'Abadikan Momen' : 'Capture Your'} <br/>
            <span className="italic font-normal">{lang === 'id' ? 'Terindah Anda' : 'Precious Moments'}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
            className="text-gray-600 dark:text-white/60 text-lg font-light leading-relaxed mb-8 max-w-lg"
          >
            {lang === 'id' 
              ? 'Platform undangan digital premium berbasis Next.js. Tanpa login, proses instan, pembayaran otomatis via Midtrans. Siap dibagikan dalam hitungan menit.'
              : 'Premium digital invitation platform. No login required, instant processing, automated payment via Midtrans. Ready to share in minutes.'}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={() => navigate('/themes')}
              className="gold-gradient text-[#0A0A0B] px-8 py-4 text-sm font-semibold uppercase tracking-widest shadow-2xl shadow-[#C5A059]/20 hover:opacity-90 transition-opacity cursor-pointer"
            >
              {lang === 'id' ? 'Buat Undangan Sekarang' : 'Create Invitation Ahora'}
            </button>
            <button 
              onClick={() => navigate('/themes')}
              className="flex items-center justify-center gap-3 border border-gray-300 dark:border-white/20 px-8 py-4 text-sm font-light uppercase tracking-widest text-gray-900 dark:text-white hover:border-[#C5A059] hover:text-[#C5A059] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-300 cursor-pointer group"
            >
              {lang === 'id' ? 'Lihat Demo Tema' : 'View Theme Demos'}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Background Visual Overlay */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#C5A059]/10 to-transparent pointer-events-none hidden lg:block"></div>
        
        <div className="col-span-1 lg:col-span-6 relative flex items-center justify-center p-6 pb-24 lg:pb-6 lg:pr-24 xl:pr-32 lg:pl-8 mt-8 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 25, delay: 0.2 }}
            className="w-[300px] h-[450px] sm:w-[360px] sm:h-[520px] lg:w-full lg:max-w-[420px] lg:h-[600px] relative group cursor-pointer"
          >
            {randomHeroOrders.map((order, idx) => {
              // Fan-out classes for hover
              // idx 0 (bottom): left opening
              // idx 1 (middle): straight
              // idx 2 (top): right opening
              const idleTransforms = [
                '-rotate-6 -translate-x-4 translate-y-2',
                'rotate-0 translate-y-0',
                'rotate-6 translate-x-4 translate-y-2'
              ];
              const hoverTransforms = [
                'group-hover:-rotate-[15deg] group-hover:-translate-x-16 sm:group-hover:-translate-x-24 group-hover:translate-y-4 group-hover:shadow-2xl',
                'group-hover:-translate-y-4 group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(197,160,89,0.2)]',
                'group-hover:rotate-[15deg] group-hover:translate-x-16 sm:group-hover:translate-x-24 group-hover:translate-y-4 group-hover:shadow-2xl'
              ];
              const originClass = ['origin-bottom-right', 'origin-bottom', 'origin-bottom-left'];
              const zIndexes = ['z-10', 'z-20', 'z-30'];
              
              return (
                <div 
                  key={order.id} 
                  className={`absolute top-0 left-0 w-full h-full p-3 transition-all duration-700 ease-out ${originClass[idx]} ${themeMode === 'dark' ? 'bg-[#111] shadow-[0_10px_30px_rgba(0,0,0,0.8)]' : 'bg-white shadow-xl'} rounded-[32px] transform ${idleTransforms[idx]} ${hoverTransforms[idx]} ${zIndexes[idx]} hover:!z-[60]`}
                >
                    <div className="w-full h-full border border-black/5 dark:border-white/5 rounded-[24px] overflow-hidden relative flex flex-col items-center justify-center text-center p-8">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${order.image})` }}></div>
                        <div className="absolute inset-0 bg-black/40 transition-colors duration-1000 group-hover:bg-black/50"></div>
                        <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                            <p className="font-serif text-white/80 text-sm italic mb-2 uppercase tracking-widest">The Wedding of</p>
                            <h2 className="font-serif text-3xl text-white mb-4">{order.names}</h2>
                            <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mb-4 transition-all duration-500 group-hover:w-20"></div>
                            <p className="text-xs text-white/90 uppercase tracking-widest">{order.theme}</p>
                        </div>
                    </div>
                </div>
              );
            })}
          </motion.div>
          
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-24 bg-white dark:bg-[#0A0A0B] relative z-10 border-t border-black/5 dark:border-white/5">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
               <h2 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white mb-6">
                  {lang === 'id' ? 'Tiga Langkah Mudah' : 'Three Simple Steps'}
               </h2>
               <p className="text-gray-500 dark:text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
                  {lang === 'id' ? 'Kami mendesain sistem yang sesederhana mungkin agar Anda bisa fokus pada momen spesial, sementara kami menangani administrasinya.' : 'We designed the system to be as simple as possible so you can focus on the special moments, while we handle the administration.'}
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
               {/* Arrow connecting steps on desktop */}
               <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>

               <div className="bg-gray-50 dark:bg-black/40 p-8 rounded-[32px] border border-black/5 dark:border-white/5 relative flex flex-col items-center text-center group hover:bg-white dark:hover:bg-white/5 hover:border-[#C5A059]/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111] shadow-xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/10 group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white transition-all text-[#C5A059] z-10">
                     <Search width={24} height={24} />
                  </div>
                  <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4">{lang === 'id' ? '1. Pilih Tema' : '1. Choose a Theme'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-loose">
                     {lang === 'id' ? 'Temukan desain undangan yang paling mewakili kisah cinta Anda dari koleksi eksklusif kami.' : 'Find the invitation design that best represents your love story from our exclusive collection.'}
                  </p>
               </div>

               <div className="bg-gray-50 dark:bg-black/40 p-8 rounded-[32px] border border-black/5 dark:border-white/5 relative flex flex-col items-center text-center group hover:bg-white dark:hover:bg-white/5 hover:border-[#C5A059]/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111] shadow-xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/10 group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white transition-all text-[#C5A059] z-10">
                     <PenTool width={24} height={24} />
                  </div>
                  <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4">{lang === 'id' ? '2. Isi Detail Acara' : '2. Fill Event Details'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-loose">
                     {lang === 'id' ? 'Lengkapi informasi acara pernikahan Anda. Tanpa perlu mendaftar akun, prosesnya instan.' : 'Complete your wedding event information. No account registration needed, instant process.'}
                  </p>
               </div>

               <div className="bg-gray-50 dark:bg-black/40 p-8 rounded-[32px] border border-black/5 dark:border-white/5 relative flex flex-col items-center text-center group hover:bg-white dark:hover:bg-white/5 hover:border-[#C5A059]/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111] shadow-xl flex items-center justify-center mb-8 border border-black/5 dark:border-white/10 group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white transition-all text-[#C5A059] z-10">
                     <Zap width={24} height={24} />
                  </div>
                  <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-4">{lang === 'id' ? '3. Aktif & Bagikan' : '3. Active & Share'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-loose">
                     {lang === 'id' ? 'Selesaikan pembayaran otomatis dan tautan undangan Anda siap dibagikan seketika.' : 'Complete automatic payment and your invitation link is ready to share instantly.'}
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* About Section */}
      <div className="py-24 bg-white dark:bg-[#0A0A0B] relative z-10 border-t border-black/5 dark:border-white/5">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="mb-4 inline-flex items-center gap-2 text-[#C5A059]"
               >
                 <span className="w-8 h-[1px] bg-[#C5A059]"></span>
                 <span className="text-xs uppercase tracking-[0.4em] font-medium">{lang === 'id' ? 'Tentang Kami' : 'About Us'}</span>
               </motion.div>
               <h2 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white mb-6 leading-tight">
                  {lang === 'id' ? 'Merangkai Cerita Cinta Anda dengan Elegan' : 'Crafting Your Love Story Elegantly'}
               </h2>
               <p className="text-gray-500 dark:text-white/60 text-lg leading-relaxed mb-6">
                  {lang === 'id' ? 'FiveInvitation hadir untuk mengubah momen bahagia Anda menjadi sebuah karya seni digital. Kami percaya bahwa setiap pasangan memiliki cerita unik yang pantas dibagikan dengan cara yang istimewa.' : 'FiveInvitation is here to turn your happy moments into digital masterpieces. We believe every couple has a unique story that deserves to be shared in a special way.'}
               </p>
               <p className="text-gray-500 dark:text-white/60 text-lg leading-relaxed mb-8">
                  {lang === 'id' ? 'Dengan teknologi modern dan sentuhan desain estetik, platform kami memudahkan Anda untuk membuat, membagikan, dan merayakan cinta tanpa batas jarak dan waktu.' : 'With modern technology and an aesthetic design touch, our platform makes it easy for you to create, share, and celebrate love without distance and time limits.'}
               </p>
               <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                     <span className="text-3xl font-serif text-[#C5A059]">500+</span>
                     <span className="text-sm text-gray-500 dark:text-white/50">{lang === 'id' ? 'Pasangan Bahagia' : 'Happy Couples'}</span>
                  </div>
                  <div className="w-[1px] h-12 bg-gray-200 dark:bg-white/10"></div>
                  <div className="flex flex-col">
                     <span className="text-3xl font-serif text-[#C5A059]">50+</span>
                     <span className="text-sm text-gray-500 dark:text-white/50">{lang === 'id' ? 'Tema Premium' : 'Premium Themes'}</span>
                  </div>
               </div>
            </div>
            <div className="relative group cursor-pointer" onClick={handleChangeAboutImage}>
               <div className="absolute inset-0 bg-[#C5A059]/10 transform translate-x-4 translate-y-4 rounded-[32px] -z-10 transition-transform duration-300 group-hover:translate-x-6 group-hover:translate-y-6"></div>
               <img src={ABOUT_IMAGES[aboutImgIndex]} alt="Wedding Couple" className="rounded-[32px] w-full h-[500px] object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
               
               {/* Overlay Hint */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-[32px] pointer-events-none">
                  <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-xl backdrop-blur-sm">
                     {lang === 'id' ? 'Klik untuk Ganti Foto' : 'Click to Change Photo'}
                  </span>
               </div>
            </div>
         </div>
      </div>

      {/* Recent Orders Section */}
      <div className="py-20 lg:py-24 bg-gray-50 dark:bg-black/20 border-t border-black/5 dark:border-white/5 relative z-10 overflow-hidden">
        <div className="px-6 lg:px-12 mb-12 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">
             {lang === 'id' ? 'Telah Dipercaya Ribuan Pasangan' : 'Trusted by Thousands of Couples'}
          </h2>
          <p className="text-gray-500 dark:text-white/60">
             {lang === 'id' ? 'Bergabunglah dengan mereka yang telah membagikan momen bahagia dengan cara yang elegan.' : 'Join those who have shared their happy moments in an elegant way.'}
          </p>
        </div>
        
        {/* Marquee Container */}
        <div className="w-full relative py-4 flex flex-col gap-6 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
           <div className="animate-marquee gap-6 shrink-0 w-max pr-6 pt-10 pb-10">
              {[...RECENT_ORDERS.slice(0, 5), ...RECENT_ORDERS.slice(0, 5), ...RECENT_ORDERS.slice(0, 5)].map((order, i) => (
                <div key={`row1-${order.id}-${i}`} className="w-64 h-80 relative group shrink-0 cursor-pointer z-10 hover:z-50">
                   {/* Back Cards for Fan Effect */}
                   <div className="absolute inset-0 rounded-[24px] bg-white dark:bg-zinc-800 shadow-md transition-all duration-500 origin-bottom-left group-hover:-rotate-6 group-hover:-translate-x-6 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100"></div>
                   <div className="absolute inset-0 rounded-[24px] bg-white dark:bg-zinc-800 shadow-xl transition-all duration-500 origin-bottom-right group-hover:rotate-6 group-hover:translate-x-6 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100"></div>
                   
                   {/* Main Card */}
                   <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-lg transition-transform duration-500 group-hover:-translate-y-4">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${order.image})` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full p-5 text-left text-white">
                         <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-1 font-semibold">{order.theme}</p>
                         <p className="font-serif text-lg">{order.names}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="animate-marquee-reverse gap-6 shrink-0 w-max pr-6 pt-10 pb-10">
              {[...RECENT_ORDERS.slice(5, 10), ...RECENT_ORDERS.slice(5, 10), ...RECENT_ORDERS.slice(5, 10)].map((order, i) => (
                <div key={`row2-${order.id}-${i}`} className="w-64 h-80 relative group shrink-0 cursor-pointer z-10 hover:z-50">
                   {/* Back Cards for Fan Effect */}
                   <div className="absolute inset-0 rounded-[24px] bg-white dark:bg-zinc-800 shadow-md transition-all duration-500 origin-bottom-left group-hover:-rotate-6 group-hover:-translate-x-6 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100"></div>
                   <div className="absolute inset-0 rounded-[24px] bg-white dark:bg-zinc-800 shadow-xl transition-all duration-500 origin-bottom-right group-hover:rotate-6 group-hover:translate-x-6 border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100"></div>
                   
                   {/* Main Card */}
                   <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-lg transition-transform duration-500 group-hover:-translate-y-4">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${order.image})` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full p-5 text-left text-white">
                         <p className="text-xs uppercase tracking-widest text-[#C5A059] mb-1 font-semibold">{order.theme}</p>
                         <p className="font-serif text-lg">{order.names}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 px-6 lg:px-12 relative z-10">
         <div className="max-w-7xl mx-auto">
             <div className="flex flex-col items-center mb-16">
                 <Quote className="text-[#C5A059] w-12 h-12 mb-6 opacity-50" />
                 <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 text-center">
                    {lang === 'id' ? 'Apa Kata Mereka?' : 'What They Say?'}
                 </h2>
             </div>
             
             {/* Testimonial Marquee / Sliding */}
             <div className="w-full overflow-hidden relative pb-10 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="animate-marquee gap-8 shrink-0 w-max pr-8">
                   {[...TESTIMONIALS, ...TESTIMONIALS].map((review, i) => (
                     <div key={`${review.id}-${i}`} className="w-[350px] md:w-[450px] p-8 md:p-10 rounded-[32px] glass-card border border-black/5 dark:border-white/10 shrink-0 whitespace-normal">
                         <div className="flex gap-1 mb-6 text-[#C5A059]">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" /> )}
                         </div>
                         <p className="text-gray-700 dark:text-white/80 text-lg md:text-xl font-serif italic mb-8 leading-relaxed">
                            "{review.comment}"
                         </p>
                         <div className="flex items-center gap-4 border-t border-black/10 dark:border-white/10 pt-6">
                            <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-bold font-serif">
                               {review.name.charAt(0)}
                            </div>
                            <div>
                               <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.name}</p>
                            </div>
                         </div>
                     </div>
                   ))}
                </div>
             </div>
         </div>
      </div>

      {/* Contact & Footer Section */}
      <footer className="bg-[#0A0A0B] text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 border border-[#C5A059] rotate-45 flex items-center justify-center">
                    <span className="-rotate-45 font-serif text-xl font-bold text-[#C5A059]">V</span>
                 </div>
                 <span className="font-serif text-xl tracking-[0.2em] font-light">FIVEINVITATION</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">
                 {lang === 'id' ? 'Membantu Anda merayakan momen terindah dengan undangan digital premium yang elegan, praktis, dan instan.' : 'Helping you celebrate your precious moments with elegant, practical, and instant premium digital invitations.'}
              </p>
              <div className="flex gap-4">
                 <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#C5A059] hover:text-[#C5A059] transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                 </a>
              </div>
           </div>
           
           <div>
              <h4 className="font-serif text-lg mb-6">{lang === 'id' ? 'Tautan Cepat' : 'Quick Links'}</h4>
              <ul className="space-y-3 text-sm text-white/60">
                 <li><button onClick={() => navigate('/themes')} className="hover:text-[#C5A059] transition-colors">{lang === 'id' ? 'Katalog Tema' : 'Theme Catalog'}</button></li>
                 <li><button onClick={() => navigate('/track/search')} className="hover:text-[#C5A059] transition-colors">{lang === 'id' ? 'Lacak Pesanan' : 'Track Order'}</button></li>
                 <li><button onClick={() => navigate('/socials')} className="hover:text-[#C5A059] transition-colors">{lang === 'id' ? 'Link Bio Sosial' : 'Social Bio Link'}</button></li>
              </ul>
           </div>

           <div>
              <h4 className="font-serif text-lg mb-6">{lang === 'id' ? 'Kontak Kami' : 'Contact Us'}</h4>
              <ul className="space-y-4 text-sm text-white/60">
                 <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C5A059] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>Jl. Sudirman No. 123, Jakarta Selatan, 12190</span>
                 </li>
                 <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C5A059] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <a href="mailto:hello@fiveinvitation.com" className="hover:text-[#C5A059] transition-colors">hello@fiveinvitation.com</a>
                 </li>
                 <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C5A059] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">+62 812 3456 7890</a>
                 </li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
           <p>&copy; {new Date().getFullYear()} FiveInvitation. All rights reserved.</p>
           <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
           </div>
        </div>
      </footer>

    </div>
  );
}
