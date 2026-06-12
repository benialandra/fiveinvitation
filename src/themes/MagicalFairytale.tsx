import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Clock, Music, Music2,
  ChevronDown, Camera, Gift, CreditCard, Send, Volume2, VolumeX,
  Snowflake, ExternalLink, QrCode, Check, Flower2
} from 'lucide-react';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

const Snowfall = () => {
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

    const snowflakes: any[] = [];
    const numFlakes = 100;

    for (let i = 0; i < numFlakes; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 0.5,
        density: Math.random() * numFlakes,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 0.8 - 0.4
      });
    }

    let animationId: number;
    let angle = 0;

    const drawFlakes = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      for (let i = 0; i < numFlakes; i++) {
        const flake = snowflakes[i];
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true);
      }
      ctx.fill();
      updateFlakes();
    };

    const updateFlakes = () => {
      angle += 0.01;
      for (let i = 0; i < numFlakes; i++) {
        const flake = snowflakes[i];
        flake.y += flake.speedY;
        flake.x += Math.sin(angle + flake.density) * flake.speedX;

        if (flake.y > height) {
          snowflakes[i] = {
            x: Math.random() * width,
            y: -10,
            radius: flake.radius,
            density: flake.density,
            speedY: flake.speedY,
            speedX: flake.speedX
          };
        }
      }
    };

    const loop = () => {
      drawFlakes();
      animationId = requestAnimationFrame(loop);
    };
    loop();

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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100] opacity-80" />;
};

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const FloatingFlowers = () => {
  const petals = Array.from({ length: 15 });
  return (
    <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
      {petals.map((_, i) => {
        const left = Math.random() * 100;
        const duration = 10 + Math.random() * 15;
        const delay = Math.random() * -20;
        return (
          <motion.div
            key={i}
            className="absolute -top-10 text-white/40 drop-shadow-sm"
            initial={{ y: -50, x: `${left}vw`, rotate: 0, opacity: 0 }}
            animate={{
              y: '120vh',
              x: [`${left}vw`, `${left + 5}vw`, `${left - 5}vw`, `${left}vw`],
              rotate: 360,
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear"
            }}
          >
            <Flower2 size={Math.random() * 16 + 12} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default function SampleMotif7({ data, guestName, lang = 'id' }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();

  const yHero = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const groomName = data?.groom_name || "William";
  const brideName = data?.bride_name || "Eleanor";
  const dateStr = data?.akad_date || "2026-12-25T09:00:00";
  const weddingDate = new Date(dateStr);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP State
  const [rsvpForm, setRsvpForm] = useState({ name: '', attendance: '', guests: '', wishes: '' });
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  // Bank State
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
      audioRef.current.play().catch(() => console.log("Audio playback prevented"));
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

  // Content constants
  const bgImage = data?.cover_image || "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=2000&auto=format&fit=crop";
  const heroImage = data?.hero_image || "https://images.unsplash.com/photo-1543615468-197e41b9d4ec?q=80&w=1500&auto=format&fit=crop";

  return (
    <div className="bg-[#f0f4f8] min-h-screen text-slate-800 font-sans selection:bg-blue-200 selection:text-slate-900 overflow-x-hidden">
      <Snowfall />
      <FloatingFlowers />

      {/* Audio Element */}
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Control */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/50 text-slate-700 shadow-xl hover:bg-white/40 transition-all duration-300"
          >
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cover / Welcome Screen */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <img src={bgImage} alt="Cover Background" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-slate-900/80" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="mb-8"
              >
                <p className="tracking-[0.3em] uppercase text-sm md:text-base text-blue-200/80 mb-2">The Wedding Of</p>
                <h1 className="text-5xl md:text-7xl font-serif tracking-wide mb-4 text-white drop-shadow-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {brideName} <span className="text-blue-300 font-light italic text-4xl md:text-6xl">&amp;</span> {groomName}
                </h1>
              </motion.div>

              {guestName && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="mt-8 mb-12 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 w-full max-w-sm"
                >
                  <p className="text-sm text-slate-300 mb-2">Dear Mr/Mrs/Ms,</p>
                  <p className="text-2xl font-serif text-white">{guestName}</p>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                onClick={handleOpen}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-medium tracking-wider hover:bg-blue-50 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                <Heart size={18} className="text-slate-400 group-hover:text-red-400 transition-colors duration-300" />
                <span>Open Invitation</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (Visible after Opening) */}
      {isOpen && (
        <main className="relative z-10 bg-[#f8fafd]">

          {/* Hero Parallax Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover object-top opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-[#f8fafd]" />
            </motion.div>

            <div className="relative z-10 text-center px-4 mt-32">
              <FadeIn>
                <p className="tracking-[0.4em] text-slate-500 uppercase text-xs md:text-sm mb-4 font-semibold">We Are Getting Married</p>
                <h2 className="text-6xl md:text-8xl font-serif text-slate-800 mb-6 drop-shadow-sm" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {brideName} <br className="md:hidden" /><span className="text-blue-300 mx-4 italic font-light">&amp;</span><br className="md:hidden" /> {groomName}
                </h2>
                <p className="text-lg text-slate-600 font-serif italic mb-12">{weddingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </FadeIn>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-slate-400"
              >
                <ChevronDown size={32} />
              </motion.div>
            </div>
          </section>

          {/* Couple Section */}
          <section className="py-24 px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <FadeIn>
                <div className="flex justify-center mb-6 text-blue-300">
                  <Snowflake size={32} className="animate-spin-slow" />
                </div>
                <h3 className="text-3xl md:text-5xl font-serif text-slate-800 mb-12" style={{ fontFamily: '"Playfair Display", serif' }}>Bride & Groom</h3>
                <p className="text-slate-600 mb-16 max-w-2xl mx-auto leading-relaxed italic">
                  "And above all these put on love, which binds everything together in perfect harmony."
                </p>
              </FadeIn>

              <div className="grid md:grid-cols-2 gap-16 md:gap-8 items-center">
                <FadeIn delay={0.2}>
                  <div className="relative w-48 h-64 md:w-64 md:h-80 mx-auto mb-6 rounded-[2rem] overflow-hidden p-2 bg-white/50 border border-white backdrop-blur-sm shadow-xl">
                    <img src="https://images.unsplash.com/photo-1546822830-4663ec40a3dd?q=80&w=600&auto=format&fit=crop" alt="Bride" className="w-full h-full object-cover rounded-[1.5rem]" />
                  </div>
                  <h4 className="text-3xl font-serif text-slate-800 mb-2">{brideName}</h4>
                  <p className="text-sm text-slate-500 mb-4 uppercase tracking-widest">The Bride</p>
                  <p className="text-slate-600 text-sm">Daughter of Mr. John Doe & Mrs. Jane Doe</p>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="relative w-48 h-64 md:w-64 md:h-80 mx-auto mb-6 rounded-[2rem] overflow-hidden p-2 bg-white/50 border border-white backdrop-blur-sm shadow-xl">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop" alt="Groom" className="w-full h-full object-cover rounded-[1.5rem]" />
                  </div>
                  <h4 className="text-3xl font-serif text-slate-800 mb-2">{groomName}</h4>
                  <p className="text-sm text-slate-500 mb-4 uppercase tracking-widest">The Groom</p>
                  <p className="text-slate-600 text-sm">Son of Mr. Robert Smith & Mrs. Mary Smith</p>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* Countdown Section */}
          <section className="py-20 relative bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=2000&auto=format&fit=crop" alt="Bg" className="w-full h-full object-cover opacity-20" />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <FadeIn>
                <h3 className="text-3xl md:text-4xl font-serif mb-12">Counting the Days</h3>
                <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Mins', value: timeLeft.minutes },
                    { label: 'Secs', value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-2xl md:text-4xl font-light font-serif">{item.value}</span>
                      </div>
                      <span className="text-xs md:text-sm uppercase tracking-wider text-slate-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Event Details Section */}
          <section className="py-24 px-6 bg-gradient-to-b from-[#f8fafd] to-white relative">
            <div className="max-w-5xl mx-auto">
              <FadeIn>
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-5xl font-serif text-slate-800 mb-4">Wedding Events</h3>
                  <p className="text-slate-500">We invite you to celebrate with us</p>
                </div>
              </FadeIn>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Akad / Ceremony */}
                <FadeIn delay={0.2}>
                  <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Heart size={28} />
                      </div>
                      <h4 className="text-2xl font-serif text-slate-800 mb-2">Holy Matrimony</h4>
                      <p className="text-blue-400 font-medium mb-8">Friday, 25 Dec 2026</p>

                      <div className="space-y-4 text-sm text-slate-600 mb-8">
                        <div className="flex items-center justify-center gap-3">
                          <Clock size={16} className="text-slate-400" />
                          <span>09:00 AM - 11:00 AM</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <MapPin size={16} className="text-slate-400" />
                          <span>Grand Chapel, The Winter Hotel</span>
                        </div>
                      </div>

                      <a href="#" className="inline-block px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-200">
                        View Location
                      </a>
                    </div>
                  </div>
                </FadeIn>

                {/* Reception */}
                <FadeIn delay={0.4}>
                  <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Music2 size={28} />
                      </div>
                      <h4 className="text-2xl font-serif text-slate-800 mb-2">Wedding Reception</h4>
                      <p className="text-blue-400 font-medium mb-8">Friday, 25 Dec 2026</p>

                      <div className="space-y-4 text-sm text-slate-600 mb-8">
                        <div className="flex items-center justify-center gap-3">
                          <Clock size={16} className="text-slate-400" />
                          <span>07:00 PM - 10:00 PM</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <MapPin size={16} className="text-slate-400" />
                          <span>Grand Ballroom, The Winter Hotel</span>
                        </div>
                      </div>

                      <a href="#" className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors shadow-md">
                        View Location
                      </a>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Map embedded */}
              <FadeIn delay={0.6}>
                <div className="mt-16 bg-white p-2 rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2!1m3!1m2"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: '1.5rem' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  ></iframe>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Love Story Timeline */}
          <section className="py-24 px-6 relative bg-[#f8fafd]">
            <div className="max-w-3xl mx-auto">
              <FadeIn>
                <h3 className="text-3xl md:text-5xl font-serif text-center text-slate-800 mb-16">Our Journey</h3>
              </FadeIn>

              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-200 before:to-transparent">
                {[
                  { year: '2020', title: 'First Met', desc: 'We met at a winter festival. It was cold outside, but warm in our hearts.' },
                  { year: '2023', title: 'The Proposal', desc: 'Under the falling snow in Central Park, he kneeled and asked the question.' },
                  { year: '2026', title: 'Getting Married', desc: 'And now, we are embarking on a new journey together.' }
                ].map((item, idx) => (
                  <FadeIn key={idx} delay={idx * 0.2}>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Marker */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-50 text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Heart size={14} className="fill-current" />
                      </div>

                      {/* Content */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <span className="font-serif text-blue-400 text-sm font-bold tracking-widest">{item.year}</span>
                        <h4 className="text-lg font-bold text-slate-800 mt-1 mb-2">{item.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Gallery Masonry */}
          <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <FadeIn>
                <div className="text-center mb-16">
                  <Camera size={32} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-3xl md:text-5xl font-serif text-slate-800">Gallery</h3>
                </div>
              </FadeIn>

              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {[
                  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop"
                ].map((src, idx) => (
                  <FadeIn key={idx} delay={idx * 0.1}>
                    <div className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm">
                      <img src={src} alt={`Gallery ${idx + 1}`} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Heart className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP & Wishes Form */}
          <section className="py-24 px-6 bg-[#f8fafd]">
            <div className="max-w-xl mx-auto">
              <FadeIn>
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                    <Send size={24} className="text-blue-400 ml-1" />
                  </div>

                  <div className="text-center mt-6 mb-10">
                    <h3 className="text-3xl font-serif text-slate-800 mb-2">RSVP & Wishes</h3>
                    <p className="text-slate-500 text-sm">Kindly confirm your attendance</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isRsvpSubmitted ? (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                        onSubmit={(e) => {
                          e.preventDefault();
                          setIsRsvpSubmitted(true);
                        }}
                      >
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Your Name"
                            value={rsvpForm.name}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                          />
                        </div>
                        <div>
                          <select
                            required
                            value={rsvpForm.attendance}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-slate-600"
                          >
                            <option value="">Will you attend?</option>
                            <option value="yes">Yes, I will attend</option>
                            <option value="no">Sorry, I can't attend</option>
                          </select>
                        </div>
                        {rsvpForm.attendance === 'yes' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <select
                              required
                              value={rsvpForm.guests}
                              onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-slate-600"
                            >
                              <option value="">Number of Guests</option>
                              <option value="1">1 Person</option>
                              <option value="2">2 Persons</option>
                            </select>
                          </motion.div>
                        )}
                        <div>
                          <textarea
                            required
                            placeholder="Your Wishes"
                            rows={4}
                            value={rsvpForm.wishes}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, wishes: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none"
                          ></textarea>
                        </div>
                        <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2">
                          <Send size={18} />
                          Send RSVP
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Heart size={40} className="fill-current animate-pulse" />
                        </div>
                        <h4 className="text-2xl font-serif text-slate-800 mb-2">Thank You!</h4>
                        <p className="text-slate-500">Your RSVP and wishes have been sent successfully.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* Digital Gift */}
          <section className="py-24 px-6 bg-white relative">
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn>
                <Gift size={32} className="mx-auto text-slate-300 mb-6" />
                <h3 className="text-3xl md:text-5xl font-serif text-slate-800 mb-6">Wedding Gift</h3>
                <p className="text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed">
                  Your blessing and presence at our wedding are the most precious gifts for us. However, if you wish to give a gift, you may send it digitally below.
                </p>
              </FadeIn>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Bank Transfer */}
                <FadeIn delay={0.2}>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white text-left relative overflow-hidden h-full flex flex-col justify-between shadow-xl">
                    <div className="absolute top-0 right-0 p-6 opacity-20">
                      <CreditCard size={64} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">BCA Bank</p>
                      <p className="text-2xl font-mono tracking-widest mb-2 text-white/90">1234 5678 9012</p>
                      <p className="text-slate-300 text-sm uppercase">A.n. {groomName}</p>
                    </div>
                    <button
                      onClick={() => handleCopy('123456789012')}
                      className={`mt-8 px-6 py-3 rounded-xl text-sm font-medium w-max backdrop-blur-md transition-all border flex items-center gap-2
                        ${isCopied ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={16} /> Copied!
                        </>
                      ) : (
                        <>
                          <CreditCard size={16} /> Copy Number
                        </>
                      )}
                    </button>
                  </div>
                </FadeIn>

                {/* QRIS */}
                <FadeIn delay={0.4}>
                  <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] text-center h-full flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                    <QrCode size={32} className="text-blue-400 mb-4" />
                    <p className="font-bold text-slate-800 mb-2">QRIS Payment</p>
                    <p className="text-sm text-slate-500 mb-6">Scan QR code using any e-wallet</p>
                    <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" className="w-full h-full opacity-50" />
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-slate-900 text-center text-slate-400 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
            <FadeIn className="relative z-10">
              <h2 className="text-3xl font-serif text-white mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
                {brideName} <span className="text-blue-300 mx-2 italic font-light">&amp;</span> {groomName}
              </h2>
              <p className="text-sm">Made with <Heart size={12} className="inline text-red-400 mx-1 fill-current" /> by FiveInvitation</p>
            </FadeIn>
          </footer>

        </main>
      )}
    </div>
  );
}
