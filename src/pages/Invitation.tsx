import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getThemeById } from '../themes/registry';
import MasterTheme from '../themes/MasterTheme';
import { Loader2 } from 'lucide-react';

export default function Invitation() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to');
  
  const [order, setOrder] = useState<any>(null);
  const [themeData, setThemeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvite = async () => {
      let data = null;
      try {
        const res = await supabase.from('orders').select('*').eq('slug', slug).single();
        data = res.data;
      } catch (err) {
        console.warn("Supabase fetch order failed", err);
      }
      
      if (data) {
        setOrder(data);
        // Fetch theme data dynamically
        if (data.theme_id) {
           try {
             const { data: tData } = await supabase.from('themes').select('*').eq('id', data.theme_id).single();
             if (tData) setThemeData(tData);
           } catch {
             // Fallback to registry
           }
        }
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

  let content = null;
  
  if (themeData && themeData.config_json) {
     content = <MasterTheme 
                 bride={order.bride_name} 
                 groom={order.groom_name} 
                 date={order.akad_date ? new Date(order.akad_date).toLocaleDateString() : undefined} 
                 hero_image={order.hero_image}
                 cover_image={order.cover_image}
                 config_json={themeData.config_json} 
               />;
  } else {
     const ThemeComponent = getThemeById(order.theme_id)?.component;
     if (!ThemeComponent) return <div className="h-screen w-screen flex items-center justify-center">Tema rusak.</div>;
     content = <ThemeComponent data={order} guestName={guestName || ''} />;
  }

  return (
    <div className="w-full min-h-screen">
       {content}
    </div>
  );
}
