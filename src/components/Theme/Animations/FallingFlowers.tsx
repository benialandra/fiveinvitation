import React, { useEffect, useState } from 'react';

const SakuraPetal = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 2 4 6 4 10C4 14.5 12 22 12 22C12 22 20 14.5 20 10C20 6 16 2 12 2Z" fill="currentColor" />
  </svg>
);

export const FallingFlowers: React.FC = () => {
  const [flowers, setFlowers] = useState<Array<{ id: number; left: number; animationDuration: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate 15 falling flowers
    const newFlowers = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      animationDuration: Math.random() * 5 + 8, // 8-13s
      delay: Math.random() * 10, // 0-10s
      size: Math.random() * 0.5 + 0.5, // 0.5 - 1 scale
    }));
    setFlowers(newFlowers);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute top-[-5%] text-pink-300/60 will-change-transform"
          style={{
            left: `${flower.left}%`,
            transform: `scale(${flower.size})`,
            animation: `fall ${flower.animationDuration}s linear ${flower.delay}s infinite`,
          }}
        >
          <div style={{ animation: `sway ${flower.animationDuration / 2}s ease-in-out infinite alternate` }}>
            <SakuraPetal />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-5vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        @keyframes sway {
          0% { transform: translateX(-20px) rotate(-15deg); }
          100% { transform: translateX(20px) rotate(15deg); }
        }
      `}</style>
    </div>
  );
};
