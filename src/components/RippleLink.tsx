import React, { useState, MouseEvent } from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface RippleLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export default function RippleLink({ children, className = '', onClick, ...props }: RippleLinkProps) {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  React.useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 500);
    } else {
      setIsRippling(false);
    }
  }, [coords]);

  React.useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    onClick?.(e);
  };

  return (
    <Link
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
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
