import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id as localeId, enUS as localeEn } from 'date-fns/locale';
import {
  Heart, Calendar, MapPin, Clock, Music, Music2,
  ChevronDown, Camera, Gift, CreditCard, Send, Volume2, VolumeX,
  Check, Sparkles, Compass, MessageSquare, AlertCircle, Copy
} from 'lucide-react';
import SmoothScrollLayout from '../components/Interactive/SmoothScrollLayout';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export interface CinematicConfig {
  particleType: 'leaves' | 'sakura' | 'snow' | 'sparkles' | 'raindrops';
  colors: {
    bgBase: string;
    bgMid: string;
    bgLight: string;
    primary: string;
    primaryHover: string;
    textMain: string;
    textMuted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface ThemeProps {
  config?: CinematicConfig;
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

// Custom performant Canvas Particle System for falling autumn leaves
const FallingLeaves = ({ type, colors }: { type: string, colors: any }) => {
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

    
    const getParticleConfig = (type) => {
      switch(type) {
        case 'sakura': return {
          colors: ['rgba(255, 183, 197, 0.7)', 'rgba(255, 192, 203, 0.6)', 'rgba(255, 20:147, 0.5)'],
          speedY: [0.5, 1.2], speedX: [-0.5, 0.5], size: [6, 12], shape: 'sakura'
        };
        case 'snow': return {
          colors: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.5)', 'rgba(240, 248, 255, 0.7)'],
          speedY: [0.3, 0.8], speedX: [-0.2, 0.2], size: [2, 6], shape: 'circle'
        };
        case 'sparkles': return {
          colors: [colors.primary, colors.primaryHover, 'rgba(255, 215, 0, 0.8)'],
          speedY: [-0.5, -1.5], speedX: [-0.3, 0.3], size: [1, 3], shape: 'star'
        };
        case 'raindrops': return {
          colors: ['rgba(173, 216, 230, 0.4)', 'rgba(135, 206, 235, 0.5)'],
          speedY: [4, 8], speedX: [0, 0.2], size: [1, 2], shape: 'line'
        };
        default: return { // leaves
          colors: ['rgba(212, 175, 55, 0.65)', 'rgba(205, 127, 50, 0.6)', 'rgba(184, 115, 51, 0.65)'],
          speedY: [0.5, 1.5], speedX: [-0.3, 0.3], size: [8, 15], shape: 'leaf'
        };
      }
    };
    
    const pConf = getParticleConfig(type);
    const leafColors = pConf.colors;


    const leaves: any[] = [];
    const numLeaves = 40; // Balanced density for elegant cinematic atmosphere and great performance

    for (let i = 0; i < numLeaves; i++) {
      leaves.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 15 + 8,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        speedY: Math.random() * 1.0 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.005,
        wobbleRange: Math.random() * 15 + 5
      });
    }

    let animationId: number;

    
    const drawLeaf = (ctx, x, y, size, rotation, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      
      if (pConf.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (pConf.shape === 'line') {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size * 5);
        ctx.lineWidth = size;
        ctx.stroke();
      } else if (pConf.shape === 'star') {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
      } else { // leaf or sakura
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.bezierCurveTo(size / 2, -size / 2, size, 0, 0, size);
        ctx.bezierCurveTo(-size, 0, -size / 2, -size / 2, 0, -size / 2);
        ctx.fill();
      }
      ctx.restore();
    };


    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < numLeaves; i++) {
        const leaf = leaves[i];
        
        leaf.y += leaf.speedY;
        leaf.wobble += leaf.wobbleSpeed;
        const wobbleOffset = Math.sin(leaf.wobble) * leaf.wobbleRange * 0.06;
        leaf.x += leaf.speedX + wobbleOffset;
        leaf.rotation += leaf.rotationSpeed;

        drawLeaf(ctx, leaf.x, leaf.y, leaf.size, leaf.rotation, leaf.color);

        // Reset when falling below the viewport or going way off-screen horizontally
        if (leaf.y > height + 25 || leaf.x > width + 25 || leaf.x < -25) {
          leaves[i] = {
            x: Math.random() * width,
            y: -25,
            size: leaf.size,
            color: leaf.color,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: leaf.rotationSpeed,
            speedY: leaf.speedY,
            speedX: leaf.speedX,
            wobble: leaf.wobble,
            wobbleSpeed: leaf.wobbleSpeed,
            wobbleRange: leaf.wobbleRange
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

export default function CinematicTheme({ data, guestName, lang = 'id', config }: ThemeProps) {
  const finalConfig = config || {
    particleType: 'leaves',
    colors: {
      bgBase: '#120804',
      bgMid: '#180d07',
      bgLight: '#2d1b10',
      primary: '#df9f28',
      primaryHover: '#f59e0b',
      textMain: '#faf6f0',
      textMuted: '#d5c2b0'
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Plus Jakarta Sans', sans-serif"
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();

  // Cinematic parallax scroll transforms for background sunset gradients and content layers
  const yHero = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Fallback Dummy Data - Premium Wedding Profile
  const groomName = data?.groom_name || "Ahmad Rifqi";
  const brideName = data?.bride_name || "Sarah Kamila";
  const groomParents = data?.groom_parents || "Bpk. H. Rahmat Wijaya & Ibu Hj. Ratna Sari";
  const brideParents = data?.bride_parents || "Bpk. Ir. H. Bambang Susilo & Ibu Hj. Aminah Lubis";
  
  const dateStr = data?.akad_date || "2026-11-20T09:00:00";
  const resepsiDateStr = data?.resepsi_date || "2026-11-20T11:00:00";
  
  const locationName = data?.location_name || "Cempaka Golden Ballroom, The Ritz-Carlton Jakarta";
  const mapsLink = data?.maps_link || "https://maps.app.goo.gl/u1L8tHqD57mQvX3f9";

  const coverImage = data?.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";
  const heroImage = data?.hero_image || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop";
  const groomImage = data?.groom_image || data?.gallery_1 || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop";
  const brideImage = data?.bride_image || data?.gallery_2 || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop";
  
  const gallery1 = data?.gallery_1 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop";
  const gallery2 = data?.gallery_2 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop";
  const gallery3 = data?.gallery_3 || "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop";
  const gallery4 = data?.gallery_4 || "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=600&auto=format&fit=crop";

  const weddingDate = new Date(dateStr);
  const currentLocale = lang === 'en' ? localeEn : localeId;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Guestbook & RSVP State
  const [rsvpForm, setRsvpForm] = useState({ name: '', attendance: '', guests: '1', wishes: '' });
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch guestbook comments on load
  useEffect(() => {
    const fetchComments = async () => {
      if (data?.id) {
        const { data: cbData, error } = await supabase
          .from('guest_books')
          .select('*')
          .eq('order_id', data.id)
          .order('created_at', { ascending: false });
        
        if (!error && cbData) {
          setComments(cbData.map(c => ({
            id: c.id,
            name: c.sender_name,
            message: c.message,
            date: new Date(c.created_at).toLocaleDateString()
          })));
        }
      }
    };
    fetchComments();
  }, [data?.id]);

  // Bank Transfer Copy States
  const [copiedBankIndex, setCopiedBankIndex] = useState<number | null>(null);

  
  // Inject Premium Cinematic Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    const hFont = finalConfig.fonts.heading.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
    const bFont = finalConfig.fonts.body.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${hFont}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=${bFont}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) document.head.removeChild(link);
    };
  }, [finalConfig.fonts]);


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
    const fallbackCopy = () => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopiedBankIndex(index);
          toast.success(t.copied);
          setTimeout(() => setCopiedBankIndex(null), 2000);
        } else {
          toast.error("Gagal menyalin. Silakan salin manual.");
        }
      } catch (err) {
        toast.error("Gagal menyalin. Silakan salin manual.");
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedBankIndex(index);
        toast.success(t.copied);
        setTimeout(() => setCopiedBankIndex(null), 2000);
      }).catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.id && !data?.unique_code) {
      toast.success("Pratinjau: Terima kasih atas RSVP & Ucapan Anda!");
      const newComment = {
        id: Date.now(),
        name: rsvpForm.name || 'Tamu Simulasi',
        message: rsvpForm.wishes || 'Ucapan pratinjau.',
        date: lang === 'en' ? "Just now" : "Baru saja"
      };
      setComments([newComment, ...comments]);
      setIsRsvpSubmitted(true);
      return;
    }
    
    setSubmitting(true);
    try {
      const orderId = data?.id;
      if (orderId) {
        if (rsvpForm.attendance) {
          await supabase.from('rsvp').insert([{
            order_id: orderId,
            guest_name: rsvpForm.name,
            status: rsvpForm.attendance,
            guest_count: parseInt(rsvpForm.guests) || 1
          }]);
        }
        
        if (rsvpForm.wishes) {
          await supabase.from('guest_books').insert([{
            order_id: orderId,
            sender_name: rsvpForm.name,
            message: rsvpForm.wishes
          }]);
        }
        
        toast.success("RSVP dan ucapan berhasil dikirim!");
        const newComment = {
          id: Date.now(),
          name: rsvpForm.name,
          message: rsvpForm.wishes,
          date: lang === 'en' ? "Just now" : "Baru saja"
        };
        setComments([newComment, ...comments]);
        setIsRsvpSubmitted(true);
      }
    } catch (err) {
      toast.error("Gagal mengirim RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  // Translations
  const t = {
    dear: lang === 'en' ? 'Dear Distinguished Guest,' : 'Kepada Yth. Bapak/Ibu/Saudara/i:',
    open: lang === 'en' ? 'Open Invitation' : 'Buka Undangan',
    title: lang === 'en' ? 'The Wedding of' : 'Pernikahan dari',
    intro: lang === 'en' ? 'We cordially invite you to celebrate our union under the golden warmth of autumn woods.' : 'Dengan segala hormat dan kehangatan hati, kami mengundang Anda untuk merayakan hari istimewa kami.',
    groomTitle: lang === 'en' ? 'Groom' : 'Mempelai Pria',
    brideTitle: lang === 'en' ? 'Bride' : 'Mempelai Wanita',
    sonOf: lang === 'en' ? 'Beloved Son of' : 'Putra Tercinta dari',
    daughterOf: lang === 'en' ? 'Beloved Daughter of' : 'Putri Tercinta dari',
    holyMatrimony: lang === 'en' ? 'Holy Matrimony' : 'Akad Nikah',
    reception: lang === 'en' ? 'Wedding Reception' : 'Resepsi Pernikahan',
    location: lang === 'en' ? 'Location' : 'Lokasi Acara',
    viewMap: lang === 'en' ? 'View Google Maps' : 'Lihat Peta Petunjuk',
    countdownTitle: lang === 'en' ? 'Counting Down to Our Best Day' : 'Menghitung Hari Bahagia',
    days: lang === 'en' ? 'Days' : 'Hari',
    hours: lang === 'en' ? 'Hours' : 'Jam',
    minutes: lang === 'en' ? 'Mins' : 'Menit',
    seconds: lang === 'en' ? 'Secs' : 'Detik',
    journey: lang === 'en' ? 'Our Love Story' : 'Kisah Kasih Kami',
    gallery: lang === 'en' ? 'Moments in Autumn' : 'Galeri Hangat Senja',
    rsvpTitle: lang === 'en' ? 'RSVP & Warm Wishes' : 'RSVP & Ucapan Bahagia',
    rsvpSubtitle: lang === 'en' ? 'Confirm your attendance to share the joy.' : 'Konfirmasikan kehadiran Anda untuk melengkapi hari bahagia kami.',
    namePlaceholder: lang === 'en' ? 'Your Full Name' : 'Nama Lengkap Anda',
    wishesPlaceholder: lang === 'en' ? 'Write your warm wishes for the couple...' : 'Tuliskan ucapan selamat dan doa restu Anda...',
    willAttend: lang === 'en' ? 'Will you attend?' : 'Apakah Anda akan hadir?',
    attending: lang === 'en' ? 'Yes, I will attend' : 'Ya, Saya akan hadir',
    notAttending: lang === 'en' ? 'No, I cannot attend' : 'Maaf, Saya tidak dapat hadir',
    guestCount: lang === 'en' ? 'Number of Guests' : 'Jumlah Tamu',
    sendRSVP: lang === 'en' ? 'Send RSVP & Wishes' : 'Kirim RSVP & Ucapan',
    giftTitle: lang === 'en' ? 'Wedding Gift' : 'Kado Digital',
    giftIntro: lang === 'en' ? 'Your blessings are enough, but if you wish to honor us with a digital gift:' : 'Doa restu Anda adalah karunia terindah. Namun jika Anda ingin mengirimkan tanda kasih secara digital:',
    copyBtn: lang === 'en' ? 'Copy Account Number' : 'Salin Nomor Rekening',
    copied: lang === 'en' ? 'Copied Successfully!' : 'Berhasil Disalin!',
    giftAddress: lang === 'en' ? 'Gift Shipping Address' : 'Alamat Pengiriman Kado Fisik',
    thanks: lang === 'en' ? 'We look forward to celebrating with you.' : 'Kehadiran dan doa restu Anda adalah kehormatan bagi kami.',
    signature: `${groomName} & ${brideName}`
  };

  return (
    <div style={{
        '--c-bg-base': finalConfig.colors.bgBase,
        '--c-bg-mid': finalConfig.colors.bgMid,
        '--c-bg-light': finalConfig.colors.bgLight,
        '--c-primary': finalConfig.colors.primary,
        '--c-primary-hover': finalConfig.colors.primaryHover,
        '--c-text-main': finalConfig.colors.textMain,
        '--c-text-muted': finalConfig.colors.textMuted,
        fontFamily: finalConfig.fonts.body
      } as React.CSSProperties} className="bg-[var(--c-bg-base)] text-[var(--c-text-main)] selection:bg-[var(--c-primary)]/30 selection:text-[var(--c-primary)] overflow-x-hidden relative min-h-screen">
      
      {/* Audio Element */}
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/music/preview/mixkit-relaxing-light-piano-music-421.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Controller */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#3d2417]/80 hover:bg-[#523220] text-[var(--c-primary)] border border-[var(--c-primary)]/40 shadow-[0_0_20px_rgba(223,159,40,0.2)] backdrop-blur-md transition-all duration-300 flex items-center justify-center cursor-pointer"
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
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[var(--c-bg-mid)]"
          >
            {/* Background Ambient Sunset Light */}
            <div className="absolute inset-0 z-0">
              <img src={coverImage} alt="Autumn Forest Background" className="w-full h-full object-cover opacity-20 scale-105 filter blur-xs" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg-base)] via-[#1c0f08]/90 to-[var(--c-bg-base)]/90" />
              {/* Dynamic light shaft simulation */}
              <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[var(--c-primary)]/15 via-transparent to-transparent rounded-full blur-[120px] animate-pulse" />
              <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-[#92400e]/20 via-transparent to-transparent rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Falling Leaves Effect in Cover */}
            <FallingLeaves type={finalConfig.particleType} colors={finalConfig.colors} />

            {/* Cover Frame & Text */}
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full pt-10">
              
              {/* Decorative Laurel Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.1 }}
                className="mb-4 text-[var(--c-primary)]"
              >
                <Heart size={32} className="stroke-1 fill-[var(--c-primary)]/10" />
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="tracking-[0.35em] text-[var(--c-text-muted)]/90 text-xs md:text-sm uppercase font-semibold mb-6"
              >
                {t.title}
              </motion.p>
              
              {/* Premium Circular Couple Portrait Image with Double Golden Ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="relative w-64 h-64 md:w-72 md:h-72 mb-10 group"
              >
                {/* Outermost rotating gold dashed border */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--c-primary)]/30 animate-[spin_100s_linear_infinite]" />
                {/* Inner gold solid border */}
                <div className="absolute inset-3 rounded-full border border-[var(--c-primary)]/50" />
                {/* Portrait wrapper */}
                <div className="absolute inset-5 rounded-full overflow-hidden bg-[var(--c-bg-light)] border border-[#3d2417]">
                  <img src={coverImage} alt="Couple Portrait" className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg-base)]/60 via-transparent to-[var(--c-bg-base)]/20" />
                </div>
              </motion.div>
              
              {/* Couple Initials */}
              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide text-white mb-2"
                style={{ fontFamily: '${finalConfig.fonts.heading}' }}
              >
                {brideName} <span className="text-[var(--c-primary)] font-serif font-light italic">&amp;</span> {groomName}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-[var(--c-text-muted)]/70 font-serif italic text-sm md:text-base mb-8 tracking-wider"
              >
                {format(weddingDate, 'EEEE, d MMMM yyyy', { locale: currentLocale })}
              </motion.p>

              {/* Recipient box */}
              {guestName && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="mb-10 px-8 py-5 rounded-2xl bg-[#2e1f16]/75 border border-[var(--c-primary)]/25 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-sm"
                >
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--c-text-muted)]/60 mb-2 font-medium">{t.dear}</p>
                  <p className="text-xl font-semibold text-white tracking-wide" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>{guestName}</p>
                </motion.div>
              )}

              {/* Buka Undangan Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                onClick={handleOpen}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--c-primary)] to-[#b45309] hover:from-[var(--c-primary-hover)] hover:to-[#d97706] text-white rounded-full font-medium tracking-widest text-xs uppercase shadow-[0_0_25px_rgba(223,159,40,0.3)] hover:shadow-[0_0_35px_rgba(223,159,40,0.5)] transition-all duration-500 transform hover:scale-105 cursor-pointer border border-[var(--c-primary)]/40"
              >
                <Heart size={14} className="fill-current text-white animate-pulse" />
                <span>{t.open}</span>
              </motion.button>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (Visible after opening cover) */}
      {isOpen && (
        <SmoothScrollLayout>
          {/* Falling Autumn Leaves Cinematic Canvas Overlay */}
          <FallingLeaves type={finalConfig.particleType} colors={finalConfig.colors} />

          {/* 1. HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Cinematic Sunset Parallax Background */}
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
              <img src={heroImage} alt="Hero Couple Cover" className="w-full h-full object-cover object-center scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--c-bg-base)]/70 via-[var(--c-bg-base)]/50 to-[var(--c-bg-base)]" />
            </motion.div>

            {/* Sunset light ray accent */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-radial-gradient(circle_at_center,_rgba(251,191,36,0.18)_0%,_transparent_75%)] opacity-85 pointer-events-none blur-3xl" />

            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <span className="tracking-[0.4em] text-[var(--c-primary)] uppercase text-xs md:text-sm mb-4 font-bold flex items-center gap-2">
                  <Sparkles size={12} className="animate-pulse" />
                  We Are Getting Married
                  <Sparkles size={12} className="animate-pulse" />
                </span>
                
                {/* Double line divider */}
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--c-primary)] to-transparent mb-8" />

                <h2 className="text-6xl md:text-8xl font-normal text-white mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight tracking-wider" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                  {brideName} <br />
                  <span className="text-[var(--c-primary)] italic font-light font-serif text-4xl md:text-6xl my-2 block">&amp;</span>
                  {groomName}
                </h2>

                <p className="text-[var(--c-text-muted)] font-serif italic text-lg md:text-xl tracking-widest mt-6 drop-shadow-md">
                  {format(weddingDate, 'EEEE, d MMMM yyyy', { locale: currentLocale })}
                </p>

                {/* Vertical Line Anchor */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-24 text-[var(--c-primary)]/70 flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => document.getElementById('verse')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[var(--c-text-muted)]/50">Scroll Down</span>
                  <ChevronDown size={24} className="animate-bounce" />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* 2. VERSE / QUOTE SECTION */}
          <section id="verse" className="py-24 px-6 relative bg-gradient-to-b from-[var(--c-bg-base)] to-[#1e0f08]">
            <div className="max-w-3xl mx-auto text-center relative z-10">
              
              {/* Decorative Top Leaf Vector Silhouette */}
              <div className="flex justify-center mb-8 text-[var(--c-primary)]/40">
                <Compass size={36} className="animate-[spin_120s_linear_infinite]" />
              </div>

              {/* Verse Frame */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2 }}
                className="bg-[var(--c-bg-light)]/40 border border-[var(--c-primary)]/20 rounded-3xl p-8 md:p-14 backdrop-blur-sm relative"
              >
                {/* Corner Ornaments */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[var(--c-primary)]/40" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[var(--c-primary)]/40" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[var(--c-primary)]/40" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[var(--c-primary)]/40" />

                {/* Holy Quran Verse or Love Poem */}
                {lang === 'id' ? (
                  <>
                    <p className="text-2xl font-serif text-white/95 mb-6 text-center leading-loose font-normal italic tracking-wide" dir="rtl">
                      وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
                    </p>
                    <p className="text-[var(--c-text-muted)] text-sm md:text-base leading-relaxed mb-6 font-light">
                      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir."
                    </p>
                    <span className="text-xs uppercase tracking-widest text-[var(--c-primary)] font-semibold font-serif">QS. Ar-Rum: 21</span>
                  </>
                ) : (
                  <>
                    <p className="text-xl md:text-2xl text-[var(--c-text-main)] leading-relaxed italic mb-8 font-light" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                      "Love is like the warm setting autumn sun, painting the sky with golden promises. In your warmth, I found a home. In your heart, I found peace."
                    </p>
                    <span className="text-xs uppercase tracking-widest text-[var(--c-primary)] font-semibold font-serif">A. R. & S. K.</span>
                  </>
                )}
              </motion.div>
            </div>
          </section>

          {/* 3. BRIDE & GROOM PROFILE */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[#1e0f08] to-[var(--c-bg-base)] overflow-hidden">
            
            {/* Background vector glow */}
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--c-primary)]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#b45309]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
              
              <div className="text-center mb-20">
                <span className="text-[var(--c-primary)] tracking-[0.3em] uppercase text-xs font-bold block mb-3">Mempelai Pernikahan</span>
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                  The Bride &amp; The Groom
                </h3>
                <div className="w-16 h-[1px] bg-[var(--c-primary)]/40 mx-auto mt-6" />
              </div>

              {/* Profiles Column Grid */}
              <div className="grid md:grid-cols-2 gap-16 md:gap-10 lg:gap-20 items-stretch">
                
                {/* Mempelai Wanita - Bride (Diletakkan di kiri untuk menghormati layout lokal atau custom) */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col items-center text-center p-6 bg-[var(--c-bg-light)]/20 border border-[var(--c-primary)]/10 rounded-[3rem] backdrop-blur-xs relative overflow-hidden"
                >
                  {/* Elegant Arch Portrait Frame */}
                  <div className="relative w-52 h-72 md:w-60 md:h-80 mb-8 overflow-hidden rounded-t-[10rem] border-2 border-[var(--c-primary)]/35 shadow-2xl p-1.5 bg-[#1e0f08]">
                    <div className="w-full h-full rounded-t-[9.5rem] overflow-hidden">
                      <img src={brideImage} className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-700" alt={brideName} />
                    </div>
                  </div>

                  <h4 className="text-3xl font-normal text-white mb-2" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                    {brideName}
                  </h4>
                  <p className="text-[var(--c-primary)] text-xs font-semibold uppercase tracking-widest mb-4">
                    {t.brideTitle}
                  </p>
                  
                  <div className="w-12 h-[1px] bg-[var(--c-primary)]/25 mb-4" />
                  
                  <p className="text-[var(--c-text-muted)]/80 text-sm max-w-xs leading-relaxed">
                    {t.daughterOf}<br />
                    <span className="text-white font-semibold block mt-1">{brideParents}</span>
                  </p>

                  {/* Aesthetic social tag */}
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-8 text-xs text-[var(--c-primary)]/60 hover:text-[var(--c-primary)] transition-colors border border-[var(--c-primary)]/20 hover:border-[var(--c-primary)]/60 px-4 py-1.5 rounded-full font-mono flex items-center gap-1.5">
                    <span>@{brideName.toLowerCase().replace(/\s+/g, '')}</span>
                  </a>
                </motion.div>

                {/* Mempelai Pria - Groom */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col items-center text-center p-6 bg-[var(--c-bg-light)]/20 border border-[var(--c-primary)]/10 rounded-[3rem] backdrop-blur-xs relative overflow-hidden"
                >
                  {/* Elegant Arch Portrait Frame */}
                  <div className="relative w-52 h-72 md:w-60 md:h-80 mb-8 overflow-hidden rounded-t-[10rem] border-2 border-[var(--c-primary)]/35 shadow-2xl p-1.5 bg-[#1e0f08]">
                    <div className="w-full h-full rounded-t-[9.5rem] overflow-hidden">
                      <img src={groomImage} className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-700" alt={groomName} />
                    </div>
                  </div>

                  <h4 className="text-3xl font-normal text-white mb-2" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                    {groomName}
                  </h4>
                  <p className="text-[var(--c-primary)] text-xs font-semibold uppercase tracking-widest mb-4">
                    {t.groomTitle}
                  </p>
                  
                  <div className="w-12 h-[1px] bg-[var(--c-primary)]/25 mb-4" />
                  
                  <p className="text-[var(--c-text-muted)]/80 text-sm max-w-xs leading-relaxed">
                    {t.sonOf}<br />
                    <span className="text-white font-semibold block mt-1">{groomParents}</span>
                  </p>

                  {/* Aesthetic social tag */}
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-8 text-xs text-[var(--c-primary)]/60 hover:text-[var(--c-primary)] transition-colors border border-[var(--c-primary)]/20 hover:border-[var(--c-primary)]/60 px-4 py-1.5 rounded-full font-mono flex items-center gap-1.5">
                    <span>@{groomName.toLowerCase().replace(/\s+/g, '')}</span>
                  </a>
                </motion.div>

              </div>
            </div>
          </section>

          {/* 4. COUNTDOWN TIMER */}
          <section className="py-24 px-6 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center">
            {/* Dark warm overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-bg-base)]/95 via-[var(--c-bg-light)]/90 to-[var(--c-bg-base)]/95" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <h3 className="text-2xl md:text-3xl font-normal text-white mb-10 font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
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
                      <div className="w-16 h-18 md:w-24 md:h-24 bg-[#3d2417]/80 border border-[var(--c-primary)]/30 rounded-2xl flex flex-col items-center justify-center shadow-2xl backdrop-blur-md">
                        <span className="text-2xl md:text-4xl font-normal text-white" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>{item.value}</span>
                      </div>
                      <span className="text-[10px] md:text-xs uppercase tracking-wider text-[var(--c-text-muted)] mt-3 font-semibold">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+${encodeURIComponent(groomName)}+and+${encodeURIComponent(brideName)}&dates=20261120T020000Z/20261120T060000Z&details=Rayakan+momen+spesial+pernikahan+${encodeURIComponent(groomName)}+%26+${encodeURIComponent(brideName)}.&location=${encodeURIComponent(locationName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--c-primary)]/40 hover:border-[var(--c-primary)] bg-[var(--c-bg-light)]/40 text-[var(--c-primary)] hover:text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 backdrop-blur-md cursor-pointer hover:bg-[var(--c-primary)]/10"
                  >
                    <Calendar size={14} />
                    <span>Save The Date (Google Calendar)</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 5. EVENT DETAILS */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[var(--c-bg-base)] to-[#1e0f08]">
            <div className="max-w-5xl mx-auto">
              
              <div className="text-center mb-20">
                <span className="text-[var(--c-primary)] tracking-[0.3em] uppercase text-xs font-bold block mb-3">Agenda Spesial</span>
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                  Wedding Events
                </h3>
                <div className="w-16 h-[1px] bg-[var(--c-primary)]/40 mx-auto mt-6" />
              </div>

              {/* Event Cards Grid */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                
                {/* Akad Nikah */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="bg-[var(--c-bg-light)]/30 rounded-[2.5rem] p-8 md:p-10 border border-[var(--c-primary)]/15 relative overflow-hidden group hover:border-[var(--c-primary)]/30 hover:bg-[var(--c-bg-light)]/40 transition-all duration-500 shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--c-primary)]/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />
                  <div className="relative z-10 text-center">
                    
                    <div className="w-14 h-14 bg-[#3d2417] text-[var(--c-primary)] border border-[var(--c-primary)]/25 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Heart size={24} className="fill-current text-[var(--c-primary)]" />
                    </div>
                    
                    <h4 className="text-2xl font-normal text-white mb-2 font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                      {t.holyMatrimony}
                    </h4>
                    
                    <p className="text-[var(--c-primary)] font-bold text-sm tracking-wider uppercase mb-8">
                      {format(parseISO(dateStr), 'EEEE, d MMMM yyyy', { locale: currentLocale })}
                    </p>

                    <div className="space-y-4 text-sm text-[var(--c-text-muted)]/90 mb-8 font-light">
                      <div className="flex items-center justify-center gap-3">
                        <Clock size={16} className="text-[var(--c-primary)]/70" />
                        <span>{format(parseISO(dateStr), 'HH:mm')} WIB - Selesai</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <MapPin size={16} className="text-[var(--c-primary)]/70 shrink-0" />
                        <span className="max-w-[200px] text-center">{locationName}</span>
                      </div>
                    </div>

                    <a 
                      href={mapsLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#3d2417] text-[var(--c-primary)] border border-[var(--c-primary)]/30 hover:bg-[var(--c-primary)] hover:text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors duration-300 cursor-pointer"
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
                  className="bg-[var(--c-bg-light)]/30 rounded-[2.5rem] p-8 md:p-10 border border-[var(--c-primary)]/15 relative overflow-hidden group hover:border-[var(--c-primary)]/30 hover:bg-[var(--c-bg-light)]/40 transition-all duration-500 shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--c-primary)]/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />
                  <div className="relative z-10 text-center">
                    
                    <div className="w-14 h-14 bg-[#3d2417] text-[var(--c-primary)] border border-[var(--c-primary)]/25 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Music2 size={24} />
                    </div>
                    
                    <h4 className="text-2xl font-normal text-white mb-2 font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                      {t.reception}
                    </h4>
                    
                    <p className="text-[var(--c-primary)] font-bold text-sm tracking-wider uppercase mb-8">
                      {format(parseISO(resepsiDateStr), 'EEEE, d MMMM yyyy', { locale: currentLocale })}
                    </p>

                    <div className="space-y-4 text-sm text-[var(--c-text-muted)]/90 mb-8 font-light">
                      <div className="flex items-center justify-center gap-3">
                        <Clock size={16} className="text-[var(--c-primary)]/70" />
                        <span>{format(parseISO(resepsiDateStr), 'HH:mm')} WIB - Selesai</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <MapPin size={16} className="text-[var(--c-primary)]/70 shrink-0" />
                        <span className="max-w-[200px] text-center">{locationName}</span>
                      </div>
                    </div>

                    <a 
                      href={mapsLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--c-primary)] text-white hover:bg-[#b45309] rounded-xl text-xs font-bold tracking-wider uppercase transition-colors duration-300 shadow-lg cursor-pointer"
                    >
                      <MapPin size={14} />
                      <span>{t.viewMap}</span>
                    </a>
                  </div>
                </motion.div>

              </div>

              {/* Embedded Google Map */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-16 bg-[var(--c-bg-light)]/20 p-2 rounded-3xl border border-[var(--c-primary)]/15 overflow-hidden max-w-4xl mx-auto shadow-2xl"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2"
                  width="100%"
                  height="350"
                  style={{ border: 0, borderRadius: '1.5rem', filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                ></iframe>
              </motion.div>

            </div>
          </section>

          {/* 6. LOVE STORY TIMELINE */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[#1e0f08] to-[var(--c-bg-base)]">
            <div className="max-w-3xl mx-auto">
              
              <div className="text-center mb-20">
                <span className="text-[var(--c-primary)] tracking-[0.3em] uppercase text-xs font-bold block mb-3">Perjalanan Cinta</span>
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                  {t.journey}
                </h3>
                <div className="w-16 h-[1px] bg-[var(--c-primary)]/40 mx-auto mt-6" />
              </div>

              {/* Vertical Timeline */}
              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--c-primary)]/20">
                {[
                  { year: '2021', title: 'Pertama Bertemu (First Met)', desc: 'Kami pertama kali dipertemukan di sebuah kedai kopi hangat saat musim gugur menyelimuti kota. Sebuah sapaan sederhana yang kemudian menumbuhkan rasa nyaman di antara kami.' },
                  { year: '2024', title: 'Menjalin Komitmen (Commitment)', desc: 'Setelah bertahun-tahun berbagi cerita, impian, dan tawa hangat di setiap senja, kami sepakat untuk melangkah ke jenjang yang lebih serius dengan ikatan komitmen bersama.' },
                  { year: '2026', title: 'Lamaran & Pernikahan (Engagement & Beyond)', desc: 'Dengan restu dari kedua belah orang tua dan dikelilingi hangatnya doa keluarga, kami melangsungkan lamaran resmi dan kini bersiap menyatukan janji suci pernikahan.' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: idx * 0.2 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    {/* Pulsing Dot Marker */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--c-primary)] bg-[var(--c-bg-base)] text-[var(--c-primary)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Heart size={12} className="fill-current text-[var(--c-primary)]" />
                    </div>

                    {/* Timeline Card */}
                    <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] bg-[var(--c-bg-light)]/40 p-6 rounded-3xl border border-[var(--c-primary)]/15 shadow-lg group-hover:border-[var(--c-primary)]/40 transition-colors duration-300">
                      <span className="font-serif text-[var(--c-primary)] text-sm font-semibold tracking-wider">{item.year}</span>
                      <h4 className="text-lg font-bold text-white mt-1 mb-2 font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>{item.title}</h4>
                      <p className="text-[var(--c-text-muted)]/90 text-sm leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </section>

          {/* 7. PHOTO GALLERY */}
          <section className="py-24 px-6 bg-gradient-to-b from-[var(--c-bg-base)] to-[#1a0f0a] relative">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center mb-16">
                <Camera size={30} className="mx-auto text-[var(--c-primary)]/60 mb-4 animate-pulse" />
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                  {t.gallery}
                </h3>
                <div className="w-16 h-[1px] bg-[var(--c-primary)]/40 mx-auto mt-6" />
              </div>

              {/* Masonry-like Grid Layout */}
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {[gallery1, gallery2, gallery3, gallery4, coverImage, heroImage].map((src, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-[var(--c-primary)]/10"
                  >
                    <img src={src} alt={`Gallery Portrait ${idx + 1}`} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg-base)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-xs font-serif italic flex items-center gap-1.5">
                        <Heart size={12} className="fill-current text-[var(--c-primary)]" />
                        Together in Warmth
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </section>

          {/* 8. RSVP & WISHES FORM */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[#1a0f0a] to-[var(--c-bg-base)]">
            <div className="max-w-2xl mx-auto">
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="bg-[var(--c-bg-light)]/40 border border-[var(--c-primary)]/15 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-md relative shadow-2xl"
              >
                {/* Custom top bubble decorative icon */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#3d2417] border border-[var(--c-primary)]/30 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare size={20} className="text-[var(--c-primary)]" />
                </div>

                <div className="text-center mt-6 mb-12">
                  <h3 className="text-3xl font-normal text-white mb-2 font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                    {t.rsvpTitle}
                  </h3>
                  <p className="text-[var(--c-text-muted)]/70 text-sm font-light">
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
                          className="w-full px-5 py-4 bg-[#1e0f08]/60 border border-[var(--c-primary)]/20 rounded-2xl text-white placeholder-[var(--c-text-muted)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--c-primary)] focus:border-[var(--c-primary)] transition-all text-sm font-light"
                        />
                      </div>

                      {/* Attendance Select */}
                      <div>
                        <select
                          required
                          value={rsvpForm.attendance}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                          className="w-full px-5 py-4 bg-[#1e0f08]/60 border border-[var(--c-primary)]/20 rounded-2xl text-[var(--c-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--c-primary)] focus:border-[var(--c-primary)] transition-all text-sm font-light appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[var(--c-bg-base)]">{t.willAttend}</option>
                          <option value="yes" className="bg-[var(--c-bg-base)]">{t.attending}</option>
                          <option value="no" className="bg-[var(--c-bg-base)]">{t.notAttending}</option>
                        </select>
                      </div>

                      {/* Dynamic guest count select */}
                      {rsvpForm.attendance === 'yes' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <select
                            required
                            value={rsvpForm.guests}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                            className="w-full px-5 py-4 bg-[#1e0f08]/60 border border-[var(--c-primary)]/20 rounded-2xl text-[var(--c-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--c-primary)] focus:border-[var(--c-primary)] transition-all text-sm font-light appearance-none cursor-pointer"
                          >
                            <option value="1" className="bg-[var(--c-bg-base)]">1 {lang === 'en' ? 'Guest' : 'Tamu'}</option>
                            <option value="2" className="bg-[var(--c-bg-base)]">2 {lang === 'en' ? 'Guests' : 'Tamu (Maksimal)'}</option>
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
                          className="w-full px-5 py-4 bg-[#1e0f08]/60 border border-[var(--c-primary)]/20 rounded-2xl text-white placeholder-[var(--c-text-muted)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--c-primary)] focus:border-[var(--c-primary)] transition-all resize-none text-sm font-light"
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full py-4 bg-gradient-to-r from-[var(--c-primary)] to-[#b45309] hover:from-[var(--c-primary-hover)] hover:to-[#d97706] text-white rounded-2xl font-bold tracking-widest text-xs uppercase shadow-lg transition-all transform hover:scale-[1.01] flex justify-center items-center gap-2 cursor-pointer border border-[var(--c-primary)]/35 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <Send size={14} />
                        <span>{submitting ? (lang === 'en' ? 'Sending...' : 'Mengirim...') : t.sendRSVP}</span>
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 bg-[#3d2417] text-[var(--c-primary)] border border-[var(--c-primary)]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Heart size={30} className="fill-current text-[var(--c-primary)] animate-pulse" />
                      </div>
                      <h4 className="text-2xl font-serif text-white mb-2" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>Thank You!</h4>
                      <p className="text-[var(--c-text-muted)]/80 text-sm font-light mb-8 max-w-sm mx-auto">
                        {lang === 'en' ? 'Your attendance confirmation and warm wishes have been successfully sent to the happy couple.' : 'Pesan konfirmasi kehadiran serta doa restu Anda telah sukses terkirim ke kedua mempelai.'}
                      </p>
                      <button 
                        onClick={() => setIsRsvpSubmitted(false)}
                        className="text-xs text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] border-b border-[var(--c-primary)] pb-0.5 tracking-wider font-semibold cursor-pointer uppercase"
                      >
                        {lang === 'en' ? 'Send Another Wish' : 'Kirim Ucapan Lain'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Real-time scrollable wishes board */}
              <div className="mt-20 space-y-6">
                <span className="text-center text-[10px] tracking-[0.3em] uppercase text-[var(--c-primary)] block mb-8 font-bold">Buku Tamu Bahagia</span>
                
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[var(--c-primary)]/25 hover:scrollbar-thumb-[var(--c-primary)]/45">
                  {comments.map((comment) => (
                    <motion.div 
                      key={comment.id} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-[var(--c-bg-light)]/20 border border-[var(--c-primary)]/10 rounded-2xl p-6 shadow-sm hover:border-[var(--c-primary)]/20 transition-all"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-semibold text-[var(--c-primary)] text-sm tracking-wide" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>{comment.name}</p>
                        <span className="text-[10px] text-[var(--c-text-muted)]/45 font-mono">{comment.date}</span>
                      </div>
                      <p className="text-[var(--c-text-main)]/95 font-light text-sm leading-relaxed">{comment.message}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* 9. WEDDING GIFT / ANGPAO DIGITAL */}
          <section className="py-24 px-6 relative bg-gradient-to-b from-[var(--c-bg-base)] to-[#1a0f0a] border-t border-[var(--c-primary)]/10">
            <div className="max-w-3xl mx-auto text-center relative z-10">
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              >
                <div className="w-14 h-14 bg-[#3d2417] text-[var(--c-primary)] border border-[var(--c-primary)]/35 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Gift size={22} />
                </div>
                
                <h3 className="text-4xl md:text-5xl text-white font-normal leading-tight font-serif" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                  {t.giftTitle}
                </h3>
                
                <div className="w-16 h-[1px] bg-[var(--c-primary)]/40 mx-auto mt-6 mb-8" />

                <p className="text-[var(--c-text-muted)]/90 text-sm md:text-base leading-relaxed mb-12 max-w-xl mx-auto font-light">
                  {t.giftIntro}
                </p>

                {/* Bank Accounts Grid */}
                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto items-stretch">
                  
                  {/* Account 1 */}
                  <div className="bg-[var(--c-bg-light)]/30 border border-[var(--c-primary)]/15 rounded-[2rem] p-8 text-left relative overflow-hidden flex flex-col justify-between shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-white">
                      <CreditCard size={96} />
                    </div>
                    <div>
                      <span className="text-[var(--c-primary)] text-xs font-bold uppercase tracking-wider block mb-1">{data?.bank_name_1 || "Bank BCA"}</span>
                      <p className="text-2xl font-normal font-mono text-white tracking-widest my-2 select-all">{data?.bank_account_1 || "1790 852 462"}</p>
                      <p className="text-[var(--c-text-main)]/75 text-xs uppercase tracking-wide">A.N {data?.bank_account_name_1 || groomName}</p>
                    </div>
                    
                    <button
                      onClick={() => handleCopy(data?.bank_account_1 || '1790852462', 1)}
                      className={`mt-8 px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase w-full transition-all border flex items-center justify-center gap-2 cursor-pointer
                        ${copiedBankIndex === 1 
                          ? 'bg-[var(--c-primary)]/20 border-[var(--c-primary)] text-[var(--c-primary)]' 
                          : 'bg-[#3d2417] hover:bg-[var(--c-primary)] border-[var(--c-primary)]/25 hover:border-transparent text-[var(--c-primary)] hover:text-white'
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
                  <div className="bg-[var(--c-bg-light)]/30 border border-[var(--c-primary)]/15 rounded-[2rem] p-8 text-left relative overflow-hidden flex flex-col justify-between shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-white">
                      <CreditCard size={96} />
                    </div>
                    <div>
                      <span className="text-[var(--c-primary)] text-xs font-bold uppercase tracking-wider block mb-1">{data?.bank_name_2 || "Bank Mandiri"}</span>
                      <p className="text-2xl font-normal font-mono text-white tracking-widest my-2 select-all">{data?.bank_account_2 || "137 00 2468 1357"}</p>
                      <p className="text-[var(--c-text-main)]/75 text-xs uppercase tracking-wide">A.N {data?.bank_account_name_2 || brideName}</p>
                    </div>

                    <button
                      onClick={() => handleCopy(data?.bank_account_2 || '1370024681357', 2)}
                      className={`mt-8 px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase w-full transition-all border flex items-center justify-center gap-2 cursor-pointer
                        ${copiedBankIndex === 2 
                          ? 'bg-[var(--c-primary)]/20 border-[var(--c-primary)] text-[var(--c-primary)]' 
                          : 'bg-[#3d2417] hover:bg-[var(--c-primary)] border-[var(--c-primary)]/25 hover:border-transparent text-[var(--c-primary)] hover:text-white'
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

                {/* Gift Shipping Address */}
                <div className="mt-12 bg-[var(--c-bg-light)]/20 border border-[var(--c-primary)]/10 rounded-[2rem] p-8 max-w-xl mx-auto">
                  <div className="flex items-center justify-center gap-2 text-[var(--c-primary)] mb-3">
                    <MapPin size={18} />
                    <span className="text-sm font-semibold uppercase tracking-wider">{t.giftAddress}</span>
                  </div>
                  <p className="text-[var(--c-text-main)] text-sm font-light leading-relaxed mb-4">
                    Kav. 12 Resident Suites, Jalan Cempaka Putih Raya No. 45, RT.04/RW.02, Cempaka Putih, Jakarta Pusat, 10510
                  </p>
                  <button
                    onClick={() => handleCopy('Kav. 12 Resident Suites, Jalan Cempaka Putih Raya No. 45, Cempaka Putih, Jakarta Pusat, 10510', 3)}
                    className="text-xs text-[var(--c-primary)] hover:text-[var(--c-primary-hover)] border-b border-[var(--c-primary)]/40 hover:border-[var(--c-primary)] pb-0.5 tracking-widest font-semibold cursor-pointer uppercase inline-flex items-center gap-1.5"
                  >
                    {copiedBankIndex === 3 ? t.copied : 'Copy Shipping Address'}
                  </button>
                </div>

              </motion.div>
            </div>
          </section>

          {/* 10. CLOSING FOOTER */}
          <footer className="py-20 bg-[var(--c-bg-base)] text-center text-[var(--c-text-muted)]/55 border-t border-[var(--c-primary)]/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop')] opacity-5 scale-105 bg-cover bg-center" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-xl mx-auto px-4"
            >
              <h2 className="text-3xl md:text-4xl text-white font-normal mb-4 font-serif italic" style={{ fontFamily: '${finalConfig.fonts.heading}' }}>
                {t.signature}
              </h2>
              
              <p className="text-xs md:text-sm tracking-wide leading-relaxed mb-8 max-w-sm mx-auto font-light">
                {t.thanks}
              </p>
              
              <div className="w-16 h-[1px] bg-[var(--c-primary)]/25 mx-auto mb-8" />
              
              <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--c-primary)]/70">
                Created with <Heart size={10} className="inline text-red-500 mx-1 fill-current animate-pulse" /> by FiveInvitation
              </p>
            </motion.div>
          </footer>

        </SmoothScrollLayout>
      )}
    </div>
  );
}
