import React, { useEffect, useState } from 'react';

const Leaf = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 2 2 8 2 12C2 17 8 22 12 22C16 22 22 17 22 12C22 8 16 2 12 2ZM12 20C9 20 5 16 4 12C4 9 8 4 12 4C16 4 20 9 20 12C19 16 15 20 12 20Z" fill="currentColor" />
    <path d="M12 4V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M12 12L16 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M12 15L8 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const FallingLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Array<{ id: number; left: number; animationDuration: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const newLeaves = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 6 + 10, // 10-16s
      delay: Math.random() * 10,
      size: Math.random() * 0.4 + 0.6,
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-[-5%] text-emerald-800/40 will-change-transform"
          style={{
            left: `${leaf.left}%`,
            transform: `scale(${leaf.size})`,
            animation: `leafFall ${leaf.animationDuration}s linear ${leaf.delay}s infinite`,
          }}
        >
          <div style={{ animation: `leafSway ${leaf.animationDuration / 3}s ease-in-out infinite alternate` }}>
            <Leaf />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes leafFall {
          0% { transform: translateY(-5vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        @keyframes leafSway {
          0% { transform: translateX(-30px) rotate(-30deg); }
          100% { transform: translateX(30px) rotate(30deg); }
        }
      `}</style>
    </div>
  );
};
