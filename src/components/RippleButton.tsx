import React, { useState, useEffect, MouseEvent } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function RippleButton({ children, className = '', onClick, ...props }: RippleButtonProps) {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 500); // Ripple duration
    } else {
      setIsRippling(false);
    }
  }, [coords]);

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    onClick?.(e);
  };

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {isRippling ? (
        <span
          className="absolute bg-white/30 rounded-full animate-[ripple_0.5s_linear]"
          style={{
            left: coords.x,
            top: coords.y,
            width: 20,
            height: 20,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ) : null}
      <span className="relative z-10 flex items-center justify-center w-full h-full gap-2">{children}</span>
    </button>
  );
}
