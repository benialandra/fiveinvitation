import React, { useState, useEffect, memo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export interface SharedCountdownProps {
  targetDate: string | Date;
  colors?: {
    primary?: string;
    text?: string;
    background?: string;
    accent?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  labels?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
    title?: string;
  };
  className?: string;
}

const SharedCountdown = memo<SharedCountdownProps>(({
  targetDate,
  colors = { primary: '#c5a059', text: '#ffffff', background: '#333333' },
  fonts = { heading: 'serif', body: 'sans-serif' },
  labels = { days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik', title: 'Menghitung Hari Bahagia' },
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const { ref, inView } = useIntersectionObserver({ once: true, rootMargin: "-50px" });

  useEffect(() => {
    if (!targetDate) return;
    const dateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const target = dateObj.getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate || isExpired) return null;

  return (
    <div ref={ref} className={`w-full max-w-2xl mx-auto text-center ${className}`}>
      {labels.title && (
        <h3 
          className={`reveal-up ${inView ? 'in-view' : ''} text-2xl md:text-3xl mb-8`}
          style={{ fontFamily: fonts.heading, color: colors.text }}
        >
          {labels.title}
        </h3>
      )}
      
      <div className="grid grid-cols-4 gap-3 md:gap-6">
        {[
          { label: labels.days, value: timeLeft.days },
          { label: labels.hours, value: timeLeft.hours },
          { label: labels.minutes, value: timeLeft.minutes },
          { label: labels.seconds, value: timeLeft.seconds },
        ].map((item, idx) => (
          <div 
            key={idx}
            className={`reveal-up ${inView ? 'in-view' : ''} flex flex-col items-center`}
            style={{ transitionDelay: `${idx * 0.1}s` }}
          >
            <div 
              className="w-16 h-18 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center shadow-lg backdrop-blur-sm border"
              style={{ backgroundColor: colors.background, borderColor: colors.primary, opacity: 0.8 }}
            >
              <span className="text-2xl md:text-4xl font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>
                {item.value}
              </span>
            </div>
            <span className="text-[10px] md:text-xs uppercase tracking-wider mt-3 font-semibold" style={{ color: colors.text, fontFamily: fonts.body }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

SharedCountdown.displayName = 'SharedCountdown';

export default SharedCountdown;
