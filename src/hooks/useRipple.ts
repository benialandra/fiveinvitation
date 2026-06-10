import { useState, useCallback } from 'react';

export function useRipple() {
  const [ripples, setRipples] = useState<{x:number;y:number;id:number}[]>([]);
  
  const addRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
  }, []);

  return { ripples, addRipple };
}
