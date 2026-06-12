import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import {
  Heart, Calendar, MapPin, Clock, Music, Music2,
  ChevronDown, Camera, Gift, CreditCard, Send, Volume2, VolumeX,
  Check, Sparkles, Compass, MessageSquare, Star, Sparkle, Copy
} from 'lucide-react';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

// SVG Chandelier component that sways gently
const CrystalChandelier = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      animate={{ rotate: [-1.5, 1.5, -1.5] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      className={`origin-top pointer-events-none drop-shadow-[0_0_15px_rgba(243,228,152,0.4)] ${className}`}
    >
      <svg width="120" height="180" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Chain */}
        <line x1="60" y1="0" x2="60" y2="70" stroke="#f3e498" strokeWidth="2" strokeDasharray="3 3" />
        
        {/* Chandelier Body */}
        {/* Center rod */}
        <line x1="60" y1="70" x2="60" y2="130" stroke="#f3e498" strokeWidth="3" />
        
        {/* Main curved arms */}
        <path d="M60 100 C20 100, 10 70, 20 60" stroke="#f3e498" strokeWidth="2.5" fill="none" />
        <path d="M60 100 C100 100, 110 70, 100 60" stroke="#f3e498" strokeWidth="2.5" fill="none" />
        
        <path d="M60 120 C10 120, 0 90, 10 75" stroke="#f3e498" strokeWidth="2" fill="none" />
        <path d="M60 120 C110 120, 120 90, 110 75" stroke="#f3e498" strokeWidth="2" fill="none" />

        {/* Candles and flames */}
        {/* Flame center */}
        <circle cx="60" cy="55" r="4" fill="#ffedd5" className="animate-pulse" />
        <path d="M60 51 C58 45, 62 45, 60 41 C58 45, 62 45, 60 51 Z" fill="#f59e0b" />
        <rect x="58" y="58" width="4" height="12" fill="#f3e498" rx="1" />

        {/* Left side candles */}
        <circle cx="20" cy="55" r="3" fill="#ffedd5" className="animate-pulse" />
        <path d="M20 52 C18 47, 22 47, 20 43 Z" fill="#f59e0b" />
        <rect x="18" y="58" width="4" height="10" fill="#f3e498" rx="1" />
        
        <circle cx="10" cy="70" r="3" fill="#ffedd5" className="animate-pulse" />
        <path d="M10 67 C8 62, 12 62, 10 58 Z" fill="#f59e0b" />
        <rect x="8" y="73" width="4" height="10" fill="#f3e498" rx="1" />

        {/* Right side candles */}
        <circle cx="100" cy="55" r="3" fill="#ffedd5" className="animate-pulse" />
        <path d="M100 52 C98 47, 102 47, 100 43 Z" fill="#f59e0b" />
        <rect x="98" y="58" width="4" height="10" fill="#f3e498" rx="1" />

        <circle cx="110" cy="70" r="3" fill="#ffedd5" className="animate-pulse" />
        <path d="M110 67 C108 62, 112 62, 110 58 Z" fill="#f59e0b" />
        <rect x="108" y="73" width="4" height="10" fill="#f3e498" rx="1" />

        {/* Crystals hanging (beads/diamonds) */}
        <circle cx="60" cy="140" r="5" fill="#ffffff" opacity="0.9" />
        <polygon points="60,145 65,152 60,159 55,152" fill="#f3e498" />
        
        <circle cx="40" cy="115" r="3.5" fill="#ffffff" opacity="0.8" />
        <circle cx="80" cy="115" r="3.5" fill="#ffffff" opacity="0.8" />
        
        <circle cx="20" cy="100" r="3" fill="#ffffff" opacity="0.8" />
        <circle cx="100" cy="100" r="3" fill="#ffffff" opacity="0.8" />
        
        {/* Crystal draping lines */}
        <path d="M20 60 Q60 90 100 60" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6" />
        <path d="M10 75 Q60 115 110 75" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.5" />
      </svg>
    </motion.div>
  );
};

// Custom performant Canvas Particle System for fairytale magical pixie sparkles
const MagicalSparkles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const sparkleColors = [
      'rgba(243, 228, 152, 0.75)', // Magic Gold
      'rgba(255, 255, 255, 0.85)', // Crystal White
      'rgba(251, 191, 36, 0.7)',   // Amber Gold
      'rgba(192, 132, 252, 0.65)', // Dreamy Lavender
      'rgba(147, 197, 253, 0.65)'  // Magic Blue
    ];

    const particles: any[] = [];
    const numParticles = 55; // Perfect balance for performance and rich fairytale atmosphere

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height + height, // Start below viewport
        size: Math.random() * 3.5 + 1,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
        speedY: -(Math.random() * 0.9 + 0.3), // Float upwards
        speedX: Math.random() * 0.4 - 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        alpha: Math.random() * 0.8 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        type: Math.random() > 0.85 ? 'star' : 'circle' // 15% are actual 4-point magical stars
      });
    }

    let animationId: number;

    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.restore();
    };

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        
        // Float upwards
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.15;
        
        // Twinkle opacity (sin wave)
        p.alpha += p.twinkleSpeed;
        if (p.alpha > 1 || p.alpha < 0.1) {
          p.twinkleSpeed = -p.twinkleSpeed;
        }

        // Draw particle
        if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, 4, p.size * 2.2, p.size * 0.7, p.color, Math.max(0.1, Math.min(1, p.alpha)));
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Reset if float off top of page
        if (p.y < -20 || p.x > width + 20 || p.x < -20) {
          particles[i] = {
            x: Math.random() * width,
            y: height + 20,
            size: p.size,
            color: p.color,
            speedY: p.speedY,
            speedX: p.speedX,
            twinkleSpeed: p.twinkleSpeed,
            alpha: Math.random() * 0.8 + 0.2,
            wobble: p.wobble,
            wobbleSpeed: p.wobbleSpeed,
            type: p.type
          };
        }
      }

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[45]" />;
};

export default function MagicalFairytale({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();

  const yHero = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // Fallback Dummy Data - Premium Wedding Profile (Magical/Royal Vibe)
  const groomName = data?.groom_name || "Beni Alandra";
  const brideName = data?.bride_name || "Salsabila Putri";
  const groomParents = data?.groom_parents || "Bpk. H. Ahmad Alandra & Ibu Hj. Rina Mariana";
  const brideParents = data?.bride_parents || "Bpk. Dr. H. Faisal Ibrahim & Ibu Hj. Kartika Sari";
  
  const dateStr = data?.akad_date || "2026-12-12T09:00:00";
  const resepsiDateStr = data?.resepsi_date || "2026-12-12T11:00:00";
  
  const locationName = data?.location_name || "The Royal Glasshouse Palace, Jakarta";
  const mapsLink = data?.maps_link || "https://maps.app.goo.gl/u1L8tHqD57mQvX3f9";

  const coverImage = data?.cover_image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop";
  const heroImage = data?.hero_image || "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop";
  const groomImage = data?.groom_image || data?.gallery_1 || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop";
  const brideImage = data?.bride_image || data?.gallery_2 || "https://images.unsplash.com/photo-1546822830-4663ec40a3dd?q=80&w=600&auto=format&fit=crop";
  
  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop";
  const gallery3 = data?.gallery_3 || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop";
  const gallery4 = data?.gallery_4 || "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop";

  const weddingDate = new Date(dateStr);
  const currentLocale = lang === 'en' ? localeEn : localeId;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Guestbook & RSVP State
  const [rsvpForm, setRsvpForm] = useState({ name: '', attendance: '', guests: '1', wishes: '' });
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, name: "Princesa Aurora", message: "Selamat menempuh hidup baru Beni & Salsa! Pernikahan kalian bagaikan dongeng kerajaan yang menjadi kenyataan. Semoga cinta kalian abadi selamanya.", date: "1 jam yang lalu" },
    { id: 2, name: "Gathan & Nadia", message: "Wishing you both a lifetime of magical moments, endless love, and pure joy! What a breathtakingly beautiful invitation template, so magical and elegant!", date: "4 jam yang lalu" },
    { id: 3, name: "Om Heri & Tante Maya", message: "Barakallahu lakum wa baraka 'alaikum. Selamat ya Salsa & Beni, semoga dilancarkan segala persiapan hari pernikahan suci kalian berdua.", date: "1 hari yang lalu" }
  ]);

  // Bank Transfer Copy States
  const [copiedBankIndex, setCopiedBankIndex] = useState<number | null>(null);

  // Inject Premium Fairytale Google Fonts (Cinzel Decorative for Royal headers)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Countdown logical update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.log("Audio playback prevented by browser autoplay policy. User interaction resolves this."));
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBankIndex(index);
    setTimeout(() => setCopiedBankIndex(null), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpForm.name && rsvpForm.wishes) {
      const newComment = {
        id: Date.now(),
        name: rsvpForm.name,
        message: rsvpForm.wishes,
        date: lang === 'en' ? "Just now" : "Baru saja"
      };
      setComments([newComment, ...comments]);
      setIsRsvpSubmitted(true);
    }
  };

  // Translations
  const t = {
    dear: lang === 'en' ? 'Dear Distinguished Guest,' : 'Kepada Yth. Bapak/Ibu/Saudara/i:',
    open: lang === 'en' ? 'Open Invitation' : 'Buka Undangan',
    title: lang === 'en' ? 'The Wedding of' : 'Pernikahan dari',
    intro: lang === 'en' ? 'Once in a while, right in the middle of an ordinary life, love gives us a fairytale.' : 'Dalam kesederhanaan hidup, cinta menganugerahkan kita sebuah kisah dongeng yang indah.',
    groomTitle: lang === 'en' ? 'Groom' : 'Mempelai Pria',
    brideTitle: lang === 'en' ? 'Bride' : 'Mempelai Wanita',
    sonOf: lang === 'en' ? 'Beloved Son of' : 'Putra Tercinta dari',
    daughterOf: lang === 'en' ? 'Beloved Daughter of' : 'Putri Tercinta dari',
    holyMatrimony: lang === 'en' ? 'Holy Matrimony' : 'Akad Nikah',
    reception: lang === 'en' ? 'Wedding Reception' : 'Resepsi Pernikahan',
    location: lang === 'en' ? 'Location' : 'Lokasi Acara',
    viewMap: lang === 'en' ? 'View Google Maps' : 'Lihat Peta Petunjuk',
    countdownTitle: lang === 'en' ? 'The Fairytale Begins In' : 'Hari Bahagia Dimulai Dalam',
    days: lang === 'en' ? 'Days' : 'Hari',
    hours: lang === 'en' ? 'Hours' : 'Jam',
    minutes: lang === 'en' ? 'Mins' : 'Menit',
    seconds: lang === 'en' ? 'Secs' : 'Detik',
    journey: lang === 'en' ? 'Our Fairytale Journey' : 'Kisah Indah Kami',
    gallery: lang === 'en' ? 'Royal Portrait Gallery' : 'Galeri Foto Kerajaan',
    rsvpTitle: lang === 'en' ? 'RSVP & Royal Wishes' : 'RSVP & Ucapan Bahagia',
    rsvpSubtitle: lang === 'en' ? 'Share your wishes and confirm your royal attendance.' : 'Konfirmasikan kehadiran Anda untuk merayakan kebahagiaan kami.',
    namePlaceholder: lang === 'en' ? 'Your Full Name' : 'Nama Lengkap Anda',
    wishesPlaceholder: lang === 'en' ? 'Write your warm wishes for the couple...' : 'Tuliskan ucapan selamat dan doa restu Anda...',
    willAttend: lang === 'en' ? 'Will you attend?' : 'Apakah Anda akan hadir?',
    attending: lang === 'en' ? 'Yes, I will attend' : 'Ya, Saya akan hadir',
    notAttending: lang === 'en' ? 'No, I cannot attend' : 'Maaf, Saya tidak dapat hadir',
    guestCount: lang === 'en' ? 'Number of Guests' : 'Jumlah Tamu',
    sendRSVP: lang === 'en' ? 'Send Wishes' : 'Kirim Ucapan',
    giftTitle: lang === 'en' ? 'Royal Wedding Gift' : 'Tanda Kasih Digital',
    giftIntro: lang === 'en' ? 'Your presence is our greatest honor, but if you wish to share a digital token of love:' : 'Kehadiran Anda adalah karunia terindah. Namun jika Anda ingin mengirimkan tanda kasih secara digital:',
    copyBtn: lang === 'en' ? 'Copy Account Number' : 'Salin Nomor Rekening',
    copied: lang === 'en' ? 'Copied Successfully!' : 'Berhasil Disalin!',
    giftAddress: lang === 'en' ? 'Shipping Address' : 'Alamat Pengiriman Kado Fisik',
    thanks: lang === 'en' ? 'Happily ever after begins now.' : 'Dan kisah bahagia kami pun dimulai.',
    signature: `${groomName} & ${brideName}`
  };

  return (
    <div className="bg-[#080a1d] text-[#fbfaff] selection:bg-[#e2c974]/30 selection:text-[#e2c974] overflow-x-hidden relative min-h-screen" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* Audio Element */}
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Controller */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#1b1236]/80 hover:bg-[#281c4c] text-[#e2c974] border border-[#e2c974]/40 shadow-[0_0_20px_rgba(226,201,116,0.3)] backdrop-blur-md transition-all duration-300 flex items-center justify-center cursor-pointer"
            aria-label="Toggle Background Music"
          >
            {isPlaying ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
                <Music size={22} />
              </motion.div>
            ) : (
              <VolumeX size={22} />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cover / Welcome Screen */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#070814]"
          >
            {/* Background Ambient Star Light & Fairytale Castle */}
            <div className="absolute inset-0 z-0">
              <img src={coverImage} alt="Fairytale Castle Background" className="w-full h-full object-cover opacity-25 scale-105 filter blur-xs" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080a1d] via-[#0b0f2d]/90 to-[#070814]/90" />
              {/* Dynamic pixie-dust light glow */}
              <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-[#e2c974]/10 via-transparent to-transparent rounded-full blur-[140px] animate-pulse" />
              <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-[#a855f7]/15 via-transparent to-transparent rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Swaying Chandelier on Cover */}
            <CrystalChandelier className="absolute top-0 left-1/2 -translate-x-1/2 w-48 opacity-90 scale-90" />

            {/* Falling Magical Sparkles */}
            <MagicalSparkles />

            {/* Cover Frame & Text */}
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full pt-20">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.1 }}
                className="mb-4 text-[#e2c974]"
              >
                <Sparkle size={36} className="animate-spin-slow text-[#e2c974] fill-[#e2c974]/15" />
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="tracking-[0.4em] text-[#d1d5db]/80 text-xs md:text-sm uppercase font-semibold mb-6 font-serif"
              >
                {t.title}
              </motion.p>
              
              {/* Premium Arch Royal Portrait Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.35 }}
                className="relative w-56 h-72 md:w-64 md:h-80 mb-10 group"
              >
                {/* Rotating magical gold sparkles path */}
                <div className="absolute inset-0 rounded-t-[10rem] border border-[#e2c974]/40 -m-1" />
                <div className="absolute inset-0 rounded-t-[10rem] border-2 border-dashed border-[#e2c974]/20 animate-[spin_120s_linear_infinite]" />
                {/* Arch Portrait wrapper */}
                <div className="absolute inset-2 rounded-t-[9.5rem] overflow-hidden bg-[#1b1236] border border-[#e2c974]/30">
                  <img src={coverImage} alt="Royal Portrait" className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080a1d]/60 via-transparent to-transparent" />
                </div>
              </motion.div>
              
              {/* Couple Names */}
              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.45 }}
                className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide text-white mb-2"
                style={{ fontFamily: '"Cinzel Decorative", serif' }}
              >
                {brideName} <span className="text-[#e2c974] font-light italic font-serif text-3xl md:text-5xl">&amp;</span> {groomName}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.65 }}
                className="text-[#d1d5db]/70 font-serif italic text-sm md:text-base mb-8 tracking-widest"
              >
                {format(weddingDate, 'EEEE, d MMMM yyyy', { locale: currentLocale })}
              </motion.p>

              {/* Recipient box */}
              {guestName && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.75 }}
                  className="mb-10 px-8 py-5 rounded-[2rem] bg-[#131947]/50 border border-[#e2c974]/25 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.5)] w-full max-w-sm"
                >
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#d1d5db]/60 mb-2 font-medium">{t.dear}</p>
                  <p className="text-xl font-semibold text-[#fbfaff] tracking-wide font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>{guestName}</p>
                </motion.div>
              )}

              {/* Buka Undangan Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.95, duration: 1 }}
                onClick={handleOpen}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e2c974] to-[#c29b38] hover:from-[#f3e498] hover:to-[#e2c974] text-[#080a1d] rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_0_25px_rgba(226,201,116,0.35)] hover:shadow-[0_0_35px_rgba(226,201,116,0.6)] transition-all duration-500 transform hover:scale-105 cursor-pointer border border-[#e2c974]/30"
              >
                <Heart size={14} className="fill-current text-[#080a1d] animate-pulse" />
                <span>{t.open}</span>
              </motion.button>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (Visible after opening cover) */}
      {isOpen && (
        <SmoothScrollLayout>
          {/* Falling Pixie Dust Canvas Overlay */}
          <MagicalSparkles />

          {/* 1. HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            
            {/* Cinematic Castle Parallax Background */}
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
              <img src={heroImage} alt="Magical Fairytale Palace" className="w-full h-full object-cover object-center scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#080a1d]/60 via-[#0b0f2d]/50 to-[#080a1d]" />
            </motion.div>

            {/* Glowing magic accent */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[450px] bg-[radial-gradient(circle_at_center,_rgba(226,201,116,0.15)_0%,_transparent_70%)] opacity-90 pointer-events-none blur-3xl animate-pulse" />

            {/* Swaying Chandelier above the Hero Title */}
            <CrystalChandelier className="absolute top-0 left-1/2 -translate-x-1/2 w-52 opacity-80" />

            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center pt-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <span className="tracking-[0.45em] text-[#e2c974] uppercase text-xs md:text-sm mb-4 font-bold flex items-center gap-2">
                  <Star size={12} className="animate-pulse text-[#e2c974]" />
                  A Magical Fairytale Celebration
                  <Star size={12} className="animate-pulse text-[#e2c974]" />
                </span>
                
                {/* Ornate divider */}
                <div className="flex items-center gap-3 w-40 justify-center mb-8">
                  <div className="h-[1px] bg-gradient-to-r from-transparent to-[#e2c974] flex-1" />
                  <Sparkles size={14} className="text-[#e2c974]" />
                  <div className="h-[1px] bg-gradient-to-l from-transparent to-[#e2c974] flex-1" />
                </div>

                <h2 className="text-5xl md:text-8xl font-normal text-white mb-6 drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] leading-tight tracking-wider" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                  {brideName} <br />
                  <span className="text-[#e2c974] italic font-light font-serif text-3xl md:text-6xl my-2 block">&amp;</span>
                  {groomName}
                </h2>

                <p className="text-[#d1d5db] font-serif italic text-lg md:text-xl tracking-widest mt-6 drop-shadow-md">
                  {format(weddingDate, 'EEEE, d MMMM yyyy', { locale: currentLocale })}
                </p>

                {/* Vertical Scroll Indicator */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-28 text-[#e2c974]/70 flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => document.getElementById('verse')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#d1d5db]/50">Enter the Castle</span>
                  <ChevronDown size={24} className="animate-bounce" />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* 2. VERSE / QUOTE SECTION */}
          <section id="verse" className="py-28 px-6 relative bg-gradient-to-b from-[#080a1d] to-[#120b29] overflow-hidden">
            
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.08)_0%,_transparent_65%)] pointer-events-none blur-3xl" />

            <div className="max-w-3xl mx-auto text-center relative z-10">
              
              <div className="flex justify-center mb-8 text-[#e2c974]/40">
                <Sparkles size={36} className="animate-pulse" />
              </div>

              {/* Royal parchment frame */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4 }}
                className="bg-[#1b1236]/35 border border-[#e2c974]/20 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-md relative shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
              >
                {/* Royal border corner highlights */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#e2c974]/50" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#e2c974]/50" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#e2c974]/50" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#e2c974]/50" />

                {/* Holy Quran Verse or Love Poem */}
                {lang === 'id' ? (
                  <>
                    <p className="text-2xl font-serif text-white/95 mb-6 text-center leading-loose font-normal italic tracking-wide" dir="rtl">
                      وَمِنْ آيَاتِهِ أَنْ خَلَقَ Lَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا Lِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰLِكَ Lَآيَاتٍ Lِّقَوْمٍ يَتَفَكَّرُونَ
                    </p>
                    <p className="text-[#d1d5db] text-sm md:text-base leading-relaxed mb-6 font-light">
                      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir."
                    </p>
                    <span className="text-xs uppercase tracking-widest text-[#e2c974] font-semibold font-serif">QS. Ar-Rum: 21</span>
                  </>
                ) : (
                  <>
                    <p className="text-xl md:text-2xl text-[#fbfaff] leading-relaxed italic mb-8 font-light font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>
                      "{t.intro}"
                    </p>
                    <span className="text-xs uppercase tracking-widest text-[#e2c974] font-semibold font-serif">B. A. &amp; S. P.</span>
                  </>
                )}
              </motion.div>
            </div>
          </section>

          {/* 3. BRIDE & GROOM PROFILE */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[#120b29] to-[#080a1d] overflow-hidden">
            
            {/* Background glowing stars */}
            <div className="absolute top-10 left-10 text-[#e2c974]/15 animate-ping"><Sparkle size={24} /></div>
            <div className="absolute bottom-10 right-10 text-[#e2c974]/15 animate-ping"><Sparkle size={24} /></div>

            <div className="max-w-5xl mx-auto relative z-10">
              
              <div className="text-center mb-20">
                <span className="text-[#e2c974] tracking-[0.3em] uppercase text-xs font-bold block mb-3">Keluarga Kerajaan</span>
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                  Bride &amp; Groom
                </h3>
                <div className="w-16 h-[1px] bg-[#e2c974]/40 mx-auto mt-6" />
              </div>

              {/* Profiles Column Grid */}
              <div className="grid md:grid-cols-2 gap-16 md:gap-10 lg:gap-20 items-stretch">
                
                {/* Mempelai Wanita - Bride */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col items-center text-center p-8 bg-[#1b1236]/20 border border-[#e2c974]/10 rounded-[3rem] backdrop-blur-xs relative overflow-hidden shadow-xl"
                >
                  {/* Elegant Royal Arch Portrait Frame */}
                  <div className="relative w-52 h-72 md:w-60 md:h-80 mb-8 overflow-hidden rounded-t-[10rem] border-2 border-[#e2c974]/35 shadow-2xl p-1.5 bg-[#080a1d]">
                    <div className="w-full h-full rounded-t-[9.5rem] overflow-hidden">
                      <img src={brideImage} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt={brideName} />
                    </div>
                  </div>

                  <h4 className="text-3xl font-normal text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {brideName}
                  </h4>
                  <p className="text-[#e2c974] text-xs font-semibold uppercase tracking-widest mb-4">
                    {t.brideTitle}
                  </p>
                  
                  <div className="w-12 h-[1px] bg-[#e2c974]/25 mb-4" />
                  
                  <p className="text-[#d1d5db]/80 text-sm max-w-xs leading-relaxed font-light">
                    {t.daughterOf}<br />
                    <span className="text-white font-semibold block mt-1">{brideParents}</span>
                  </p>

                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-8 text-xs text-[#e2c974]/60 hover:text-[#e2c974] transition-colors border border-[#e2c974]/20 hover:border-[#e2c974]/60 px-4 py-1.5 rounded-full font-mono flex items-center gap-1.5">
                    <span>@{brideName.toLowerCase().replace(/\s+/g, '')}</span>
                  </a>
                </motion.div>

                {/* Mempelai Pria - Groom */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col items-center text-center p-8 bg-[#1b1236]/20 border border-[#e2c974]/10 rounded-[3rem] backdrop-blur-xs relative overflow-hidden shadow-xl"
                >
                  {/* Elegant Royal Arch Portrait Frame */}
                  <div className="relative w-52 h-72 md:w-60 md:h-80 mb-8 overflow-hidden rounded-t-[10rem] border-2 border-[#e2c974]/35 shadow-2xl p-1.5 bg-[#080a1d]">
                    <div className="w-full h-full rounded-t-[9.5rem] overflow-hidden">
                      <img src={groomImage} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt={groomName} />
                    </div>
                  </div>

                  <h4 className="text-3xl font-normal text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {groomName}
                  </h4>
                  <p className="text-[#e2c974] text-xs font-semibold uppercase tracking-widest mb-4">
                    {t.groomTitle}
                  </p>
                  
                  <div className="w-12 h-[1px] bg-[#e2c974]/25 mb-4" />
                  
                  <p className="text-[#d1d5db]/80 text-sm max-w-xs leading-relaxed font-light">
                    {t.sonOf}<br />
                    <span className="text-white font-semibold block mt-1">{groomParents}</span>
                  </p>

                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-8 text-xs text-[#e2c974]/60 hover:text-[#e2c974] transition-colors border border-[#e2c974]/20 hover:border-[#e2c974]/60 px-4 py-1.5 rounded-full font-mono flex items-center gap-1.5">
                    <span>@{groomName.toLowerCase().replace(/\s+/g, '')}</span>
                  </a>
                </motion.div>

              </div>
            </div>
          </section>

          {/* 4. COUNTDOWN TIMER */}
          <section className="py-24 px-6 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center">
            {/* Dark magic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080a1d]/95 via-[#1b1236]/90 to-[#080a1d]/95" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <h3 className="text-2xl md:text-3xl font-normal text-white mb-10 font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {t.countdownTitle}
                </h3>
                
                {/* Countdown Cards Wrapper */}
                <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
                  {[
                    { label: t.days, value: timeLeft.days },
                    { label: t.hours, value: timeLeft.hours },
                    { label: t.minutes, value: timeLeft.minutes },
                    { label: t.seconds, value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-16 h-18 md:w-24 md:h-24 bg-[#1b1236]/90 border border-[#e2c974]/30 rounded-2xl flex flex-col items-center justify-center shadow-2xl backdrop-blur-md">
                        <span className="text-2xl md:text-4xl font-normal text-white font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>{item.value}</span>
                      </div>
                      <span className="text-[10px] md:text-xs uppercase tracking-wider text-[#d1d5db] mt-3 font-semibold">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+Beni+and+Salsa&dates=20261212T020000Z/20261212T060000Z&details=Rayakan+momen+spesial+pernikahan+Beni+Alandra+%26+Salsabila+Putri.&location=${encodeURIComponent(locationName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[#e2c974]/40 hover:border-[#e2c974] bg-[#1b1236]/40 text-[#e2c974] hover:text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 backdrop-blur-md cursor-pointer hover:bg-[#e2c974]/15"
                  >
                    <Calendar size={14} />
                    <span>Save The Date (Google Calendar)</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 5. EVENT DETAILS */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[#080a1d] to-[#120b29]">
            
            {/* Chandelier above Event Details */}
            <CrystalChandelier className="absolute top-0 left-1/2 -translate-x-1/2 w-48 opacity-75 scale-95" />

            <div className="max-w-5xl mx-auto pt-10">
              
              <div className="text-center mb-20">
                <span className="text-[#e2c974] tracking-[0.3em] uppercase text-xs font-bold block mb-3">Agenda Spesial</span>
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                  Royal Celebrations
                </h3>
                <div className="w-16 h-[1px] bg-[#e2c974]/40 mx-auto mt-6" />
              </div>

              {/* Event Cards Grid */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                
                {/* Akad Nikah */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="bg-[#1b1236]/35 rounded-[2.5rem] p-8 md:p-10 border border-[#e2c974]/15 relative overflow-hidden group hover:border-[#e2c974]/35 hover:bg-[#1b1236]/45 transition-all duration-500 shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#e2c974]/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />
                  <div className="relative z-10 text-center">
                    
                    <div className="w-14 h-14 bg-[#1b1236] text-[#e2c974] border border-[#e2c974]/25 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                      <Heart size={24} className="fill-current text-[#e2c974]" />
                    </div>
                    
                    <h4 className="text-2xl font-normal text-white mb-2 font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>
                      {t.holyMatrimony}
                    </h4>
                    
                    <p className="text-[#e2c974] font-bold text-sm tracking-wider uppercase mb-8">
                      {format(parseISO(dateStr), 'EEEE, d MMMM yyyy', { locale: currentLocale })}
                    </p>

                    <div className="space-y-4 text-sm text-[#d1d5db]/90 mb-8 font-light">
                      <div className="flex items-center justify-center gap-3">
                        <Clock size={16} className="text-[#e2c974]/70" />
                        <span>{format(parseISO(dateStr), 'HH:mm')} WIB - Selesai</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <MapPin size={16} className="text-[#e2c974]/70 shrink-0" />
                        <span className="max-w-[200px] text-center">{locationName}</span>
                      </div>
                    </div>

                    <a 
                      href={mapsLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b1236] text-[#e2c974] border border-[#e2c974]/30 hover:bg-[#e2c974] hover:text-[#080a1d] rounded-xl text-xs font-bold tracking-wider uppercase transition-colors duration-300 cursor-pointer shadow-sm"
                    >
                      <MapPin size={14} />
                      <span>{t.viewMap}</span>
                    </a>
                  </div>
                </motion.div>

                {/* Resepsi Pernikahan */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-[#1b1236]/35 rounded-[2.5rem] p-8 md:p-10 border border-[#e2c974]/15 relative overflow-hidden group hover:border-[#e2c974]/35 hover:bg-[#1b1236]/45 transition-all duration-500 shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#e2c974]/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />
                  <div className="relative z-10 text-center">
                    
                    <div className="w-14 h-14 bg-[#1b1236] text-[#e2c974] border border-[#e2c974]/25 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                      <Music2 size={24} />
                    </div>
                    
                    <h4 className="text-2xl font-normal text-white mb-2 font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>
                      {t.reception}
                    </h4>
                    
                    <p className="text-[#e2c974] font-bold text-sm tracking-wider uppercase mb-8">
                      {format(parseISO(resepsiDateStr), 'EEEE, d MMMM yyyy', { locale: currentLocale })}
                    </p>

                    <div className="space-y-4 text-sm text-[#d1d5db]/90 mb-8 font-light">
                      <div className="flex items-center justify-center gap-3">
                        <Clock size={16} className="text-[#e2c974]/70" />
                        <span>{format(parseISO(resepsiDateStr), 'HH:mm')} WIB - Selesai</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <MapPin size={16} className="text-[#e2c974]/70 shrink-0" />
                        <span className="max-w-[200px] text-center">{locationName}</span>
                      </div>
                    </div>

                    <a 
                      href={mapsLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#e2c974] text-[#080a1d] hover:bg-[#c29b38] rounded-xl text-xs font-bold tracking-wider uppercase transition-colors duration-300 shadow-md cursor-pointer"
                    >
                      <MapPin size={14} />
                      <span>{t.viewMap}</span>
                    </a>
                  </div>
                </motion.div>

              </div>

              {/* Embedded Maps (Magical Purple Styled) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-16 bg-[#1b1236]/20 p-2 rounded-3xl border border-[#e2c974]/15 overflow-hidden max-w-4xl mx-auto shadow-2xl"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2"
                  width="100%"
                  height="360"
                  style={{ border: 0, borderRadius: '1.5rem', filter: 'invert(90%) hue-rotate(240deg)' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                ></iframe>
              </motion.div>

            </div>
          </section>

          {/* 6. LOVE STORY TIMELINE */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[#120b29] to-[#080a1d] overflow-hidden">
            <div className="max-w-3xl mx-auto">
              
              <div className="text-center mb-20">
                <span className="text-[#e2c974] tracking-[0.3em] uppercase text-xs font-bold block mb-3">Perjalanan Indah</span>
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                  {t.journey}
                </h3>
                <div className="w-16 h-[1px] bg-[#e2c974]/40 mx-auto mt-6" />
              </div>

              {/* Vertical Timeline */}
              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#e2c974]/20">
                {[
                  { year: '2022', title: 'Awal Pertemuan (Once Upon a Time)', desc: 'Pertemuan pertama kami yang tak sengaja di perpustakaan klasik kota, membuka babak pertama lembaran kisah cinta yang bagaikan takdir tertulis.' },
                  { year: '2025', title: 'Ikatan Komitmen (The Enchanted Bond)', desc: 'Di hadapan indahnya senja di atas kastil pegunungan, kami berjanji untuk saling menjaga, mempercayai, dan menyayangi dalam satu ikatan komitmen suci.' },
                  { year: '2026', title: 'Hari Pernikahan (Happily Ever After)', desc: 'Kini, dengan penuh rasa syukur dan dikelilingi oleh doa restu Anda, kisah bahagia kami akan diresmikan dalam janji suci pernikahan.' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    {/* Glowing Star Marker */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#e2c974] bg-[#080a1d] text-[#e2c974] shadow-[0_0_12px_rgba(226,201,116,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Star size={12} className="fill-current text-[#e2c974] animate-pulse" />
                    </div>

                    {/* Timeline Card */}
                    <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] bg-[#1b1236]/35 p-6 rounded-3xl border border-[#e2c974]/15 shadow-xl group-hover:border-[#e2c974]/35 transition-colors duration-300">
                      <span className="font-serif text-[#e2c974] text-sm font-semibold tracking-wider">{item.year}</span>
                      <h4 className="text-lg font-bold text-white mt-1 mb-2 font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>{item.title}</h4>
                      <p className="text-[#d1d5db]/90 text-sm leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </section>

          {/* 7. PHOTO GALLERY */}
          <section className="py-24 px-6 bg-gradient-to-b from-[#080a1d] to-[#0d0718] relative">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center mb-16">
                <Camera size={30} className="mx-auto text-[#e2c974]/70 mb-4 animate-bounce" />
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                  {t.gallery}
                </h3>
                <div className="w-16 h-[1px] bg-[#e2c974]/40 mx-auto mt-6" />
              </div>

              {/* Masonry Grid Layout */}
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {[gallery1, gallery2, gallery3, gallery4, coverImage, heroImage].map((src, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-[#e2c974]/10"
                  >
                    <img src={src} alt={`Gallery Portrait ${idx + 1}`} className="w-full object-cover transition-transform duration-750 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080a1d]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-xs font-serif italic flex items-center gap-1.5">
                        <Heart size={12} className="fill-current text-[#e2c974]" />
                        Our Magical Story
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </section>

          {/* 8. RSVP & WISHES FORM */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[#0d0718] to-[#080a1d]">
            <div className="max-w-2xl mx-auto">
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="bg-[#1b1236]/35 border border-[#e2c974]/15 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-md relative shadow-2xl"
              >
                {/* Decorative top icon */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#1b1236] border border-[#e2c974]/30 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare size={20} className="text-[#e2c974]" />
                </div>

                <div className="text-center mt-6 mb-12">
                  <h3 className="text-3xl font-normal text-white mb-2 font-serif" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {t.rsvpTitle}
                  </h3>
                  <p className="text-[#d1d5db]/70 text-sm font-light">
                    {t.rsvpSubtitle}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {!isRsvpSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                      onSubmit={handleAddComment}
                    >
                      {/* Name input */}
                      <div>
                        <input
                          type="text"
                          required
                          placeholder={t.namePlaceholder}
                          value={rsvpForm.name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                          className="w-full px-5 py-4 bg-[#080a1d]/60 border border-[#e2c974]/20 rounded-2xl text-white placeholder-[#d1d5db]/40 focus:outline-none focus:ring-1 focus:ring-[#e2c974] focus:border-[#e2c974] transition-all text-sm font-light"
                        />
                      </div>

                      {/* Attendance Select */}
                      <div>
                        <select
                          required
                          value={rsvpForm.attendance}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                          className="w-full px-5 py-4 bg-[#080a1d]/60 border border-[#e2c974]/20 rounded-2xl text-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#e2c974] focus:border-[#e2c974] transition-all text-sm font-light appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#080a1d]">{t.willAttend}</option>
                          <option value="yes" className="bg-[#080a1d]">{t.attending}</option>
                          <option value="no" className="bg-[#080a1d]">{t.notAttending}</option>
                        </select>
                      </div>

                      {/* Dynamic guest count select */}
                      {rsvpForm.attendance === 'yes' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <select
                            required
                            value={rsvpForm.guests}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                            className="w-full px-5 py-4 bg-[#080a1d]/60 border border-[#e2c974]/20 rounded-2xl text-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#e2c974] focus:border-[#e2c974] transition-all text-sm font-light appearance-none cursor-pointer"
                          >
                            <option value="1" className="bg-[#080a1d]">1 {lang === 'en' ? 'Guest' : 'Tamu'}</option>
                            <option value="2" className="bg-[#080a1d]">2 {lang === 'en' ? 'Guests' : 'Tamu (Maksimal)'}</option>
                          </select>
                        </motion.div>
                      )}

                      {/* Wishes Textarea */}
                      <div>
                        <textarea
                          required
                          placeholder={t.wishesPlaceholder}
                          rows={4}
                          value={rsvpForm.wishes}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, wishes: e.target.value })}
                          className="w-full px-5 py-4 bg-[#080a1d]/60 border border-[#e2c974]/20 rounded-2xl text-white placeholder-[#d1d5db]/40 focus:outline-none focus:ring-1 focus:ring-[#e2c974] focus:border-[#e2c974] transition-all resize-none text-sm font-light"
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        className="w-full py-4 bg-gradient-to-r from-[#e2c974] to-[#c29b38] hover:from-[#f3e498] hover:to-[#e2c974] text-[#080a1d] rounded-2xl font-bold tracking-widest text-xs uppercase shadow-lg transition-all transform hover:scale-[1.01] flex justify-center items-center gap-2 cursor-pointer border border-[#e2c974]/35"
                      >
                        <Send size={14} />
                        <span>{t.sendRSVP}</span>
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 bg-[#1b1236] text-[#e2c974] border border-[#e2c974]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Sparkle size={30} className="fill-current text-[#e2c974] animate-pulse" />
                      </div>
                      <h4 className="text-2xl font-serif text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>Thank You!</h4>
                      <p className="text-[#d1d5db]/80 text-sm font-light mb-8 max-w-sm mx-auto">
                        {lang === 'en' ? 'Your attendance confirmation and warm wishes have been successfully sent to the happy couple.' : 'Pesan konfirmasi kehadiran serta doa restu Anda telah sukses terkirim ke kedua mempelai.'}
                      </p>
                      <button 
                        onClick={() => setIsRsvpSubmitted(false)}
                        className="text-xs text-[#e2c974] hover:text-[#f3e498] border-b border-[#e2c974] pb-0.5 tracking-wider font-semibold cursor-pointer uppercase"
                      >
                        {lang === 'en' ? 'Send Another Wish' : 'Kirim Ucapan Lain'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Real-time Wishes Guestbook Board */}
              <div className="mt-20 space-y-6">
                <span className="text-center text-[10px] tracking-[0.3em] uppercase text-[#e2c974] block mb-8 font-bold">Buku Tamu Kebahagiaan</span>
                
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#e2c974]/25 hover:scrollbar-thumb-[#e2c974]/45">
                  {comments.map((comment) => (
                    <motion.div 
                      key={comment.id} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-[#1b1236]/35 border border-[#e2c974]/10 rounded-2xl p-6 shadow-sm hover:border-[#e2c974]/25 transition-all"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-semibold text-[#e2c974] text-sm tracking-wide" style={{ fontFamily: '"Playfair Display", serif' }}>{comment.name}</p>
                        <span className="text-[10px] text-[#d1d5db]/45 font-mono">{comment.date}</span>
                      </div>
                      <p className="text-[#fbfaff]/95 font-light text-sm leading-relaxed">{comment.message}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* 9. WEDDING GIFT / ANGPAO DIGITAL */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[#080a1d] to-[#0d0718] border-t border-[#e2c974]/10">
            <div className="max-w-3xl mx-auto text-center relative z-10">
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              >
                <div className="w-14 h-14 bg-[#1b1236] text-[#e2c974] border border-[#e2c974]/35 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Gift size={22} />
                </div>
                
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                  {t.giftTitle}
                </h3>
                
                <div className="w-16 h-[1px] bg-[#e2c974]/40 mx-auto mt-6 mb-8" />

                <p className="text-[#d1d5db]/90 text-sm md:text-base leading-relaxed mb-12 max-w-xl mx-auto font-light">
                  {t.giftIntro}
                </p>

                {/* Bank Accounts Grid */}
                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto items-stretch">
                  
                  {/* Account 1 */}
                  <div className="bg-[#1b1236]/35 border border-[#e2c974]/15 rounded-[2rem] p-8 text-left relative overflow-hidden flex flex-col justify-between shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-white">
                      <CreditCard size={96} />
                    </div>
                    <div>
                      <span className="text-[#e2c974] text-xs font-bold uppercase tracking-wider block mb-1">{data?.bank_name_1 || "Bank BCA"}</span>
                      <p className="text-2xl font-normal font-mono text-white tracking-widest my-2 select-all">{data?.bank_account_1 || "1790 852 462"}</p>
                      <p className="text-[#fbfaff]/75 text-xs uppercase tracking-wide">A.N {data?.bank_account_name_1 || groomName}</p>
                    </div>
                    
                    <button
                      onClick={() => handleCopy(data?.bank_account_1 || '1790852462', 1)}
                      className={`mt-8 px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase w-full transition-all border flex items-center justify-center gap-2 cursor-pointer
                        ${copiedBankIndex === 1 
                          ? 'bg-[#e2c974]/20 border-[#e2c974] text-[#e2c974]' 
                          : 'bg-[#1b1236] hover:bg-[#e2c974] border-[#e2c974]/25 hover:border-transparent text-[#e2c974] hover:text-[#080a1d]'
                        }`}
                    >
                      {copiedBankIndex === 1 ? (
                        <>
                          <Check size={14} /> <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> <span>{t.copyBtn}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Account 2 */}
                  <div className="bg-[#1b1236]/35 border border-[#e2c974]/15 rounded-[2rem] p-8 text-left relative overflow-hidden flex flex-col justify-between shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-white">
                      <CreditCard size={96} />
                    </div>
                    <div>
                      <span className="text-[#e2c974] text-xs font-bold uppercase tracking-wider block mb-1">{data?.bank_name_2 || "Bank Mandiri"}</span>
                      <p className="text-2xl font-normal font-mono text-white tracking-widest my-2 select-all">{data?.bank_account_2 || "137 00 2468 1357"}</p>
                      <p className="text-[#fbfaff]/75 text-xs uppercase tracking-wide">A.N {data?.bank_account_name_2 || brideName}</p>
                    </div>

                    <button
                      onClick={() => handleCopy(data?.bank_account_2 || '1370024681357', 2)}
                      className={`mt-8 px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase w-full transition-all border flex items-center justify-center gap-2 cursor-pointer
                        ${copiedBankIndex === 2 
                          ? 'bg-[#e2c974]/20 border-[#e2c974] text-[#e2c974]' 
                          : 'bg-[#1b1236] hover:bg-[#e2c974] border-[#e2c974]/25 hover:border-transparent text-[#e2c974] hover:text-[#080a1d]'
                        }`}
                    >
                      {copiedBankIndex === 2 ? (
                        <>
                          <Check size={14} /> <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> <span>{t.copyBtn}</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Shipping Address */}
                <div className="mt-12 bg-[#1b1236]/20 border border-[#e2c974]/10 rounded-[2rem] p-8 max-w-xl mx-auto shadow-lg">
                  <div className="flex items-center justify-center gap-2 text-[#e2c974] mb-3">
                    <MapPin size={18} />
                    <span className="text-sm font-semibold uppercase tracking-wider">{t.giftAddress}</span>
                  </div>
                  <p className="text-[#fbfaff] text-sm font-light leading-relaxed mb-4">
                    Kav. 12 Resident Suites, Jalan Cempaka Putih Raya No. 45, RT.04/RW.02, Cempaka Putih, Jakarta Pusat, 10510
                  </p>
                  <button
                    onClick={() => handleCopy('Kav. 12 Resident Suites, Jalan Cempaka Putih Raya No. 45, Cempaka Putih, Jakarta Pusat, 10510', 3)}
                    className="text-xs text-[#e2c974] hover:text-[#f3e498] border-b border-[#e2c974]/40 hover:border-[#e2c974] pb-0.5 tracking-widest font-semibold cursor-pointer uppercase inline-flex items-center gap-1.5"
                  >
                    {copiedBankIndex === 3 ? t.copied : 'Copy Shipping Address'}
                  </button>
                </div>

              </motion.div>
            </div>
          </section>

          {/* 10. CLOSING FOOTER */}
          <footer className="py-24 bg-[#070814] text-center text-[#d1d5db]/55 border-t border-[#e2c974]/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop')] opacity-5 scale-105 bg-cover bg-center" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-xl mx-auto px-4"
            >
              <h2 className="text-3xl md:text-4xl text-white font-normal mb-4 font-serif italic" style={{ fontFamily: '"Cinzel Decorative", serif' }}>
                {t.signature}
              </h2>
              
              <p className="text-xs md:text-sm tracking-widest leading-relaxed mb-8 max-w-sm mx-auto font-light font-serif">
                {t.thanks}
              </p>
              
              <div className="w-16 h-[1px] bg-[#e2c974]/25 mx-auto mb-8" />
              
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#e2c974]/70">
                Created with <Heart size={10} className="inline text-red-500 mx-1 fill-current animate-pulse" /> by FiveInvitation
              </p>
            </motion.div>
          </footer>

        </SmoothScrollLayout>
      )}
    </div>
  );
}
