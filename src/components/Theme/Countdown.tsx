import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { BaseSectionProps } from './types';

export default function Countdown({ data, lang = 'id', className = '', variants }: BaseSectionProps) {
  const targetDateStr = data.akad_date || new Date(Date.now() + 86400000 * 30).toISOString();
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(targetDateStr).getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

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
  }, [targetDateStr]);

  const timeUnits = [
    { label: lang === 'id' ? 'Hari' : 'Days', value: timeLeft.days },
    { label: lang === 'id' ? 'Jam' : 'Hours', value: timeLeft.hours },
    { label: lang === 'id' ? 'Menit' : 'Mins', value: timeLeft.minutes },
    { label: lang === 'id' ? 'Detik' : 'Secs', value: timeLeft.seconds },
  ];

  const defaultVariants = variants || {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <m.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={defaultVariants}
      className={`grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto ${className}`}
    >
      {timeUnits.map((unit, idx) => (
        <div key={idx} className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-2xl md:text-4xl font-serif font-semibold">{String(unit.value).padStart(2, '0')}</span>
          <span className="text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-80">{unit.label}</span>
        </div>
      ))}
    </m.div>
  );
}
