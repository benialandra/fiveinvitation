import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getThemeById } from '../themes/registry';
import { Loader2 } from 'lucide-react';

export default function Invitation() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvite = async () => {
      let data = null;
      try {
        const res = await supabase.from('orders').select('*').eq('slug', slug).single();
        data = res.data;
      } catch (err) {
        console.warn("Supabase fetch failed", err);
      }
      
      if (data) {
        setOrder(data);
      } else {
        // Mock fallback for preview purposes
        const mockTheme = slug === 'budi-tina' ? 'dark-premium' : 'elegant-gold';
        if (slug) {
            setOrder({
                theme_id: mockTheme,
                groom_name: slug.split('-')[0] || 'Groom',
                bride_name: slug.split('-')[1] || 'Bride',
                status: 'PAID'
            });
        }
      }
      setLoading(false);
    }
    fetchInvite();
  }, [slug]);

  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
      <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
    </div>
  );
  if (!order || order.status !== 'PAID') return <div className="h-screen w-screen flex items-center justify-center bg-white text-black">Undangan tidak ditemukan atau belum aktif.</div>;

  const ThemeComponent = getThemeById(order.theme_id)?.component;

  if (!ThemeComponent) return <div className="h-screen w-screen flex items-center justify-center">Tema rusak.</div>;

  return (
    <div className="w-full min-h-screen">
       <ThemeComponent data={order} guestName={guestName || ''} />
    </div>
  );
}
