import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing slug' });
  }

  try {
    if (isMock) return res.status(404).json({ error: 'Mock DB' });
    
    // Only select public-safe columns
    const { data: order, error } = await supabase
      .from('orders')
      .select('unique_code, groom_name, bride_name, groom_parents, bride_parents, akad_date, resepsi_date, location_name, maps_link, story, cover_image, hero_image, music_url, theme_id, status, customizations')
      .eq('slug', slug)
      .single();
    
    if (error || !order) return res.status(404).json({ error: 'Invitation not found' });
    
    if (order.status !== 'PAID') return res.status(403).json({ error: 'Invitation is not active yet (Pending Payment)' });
    
    const { data: theme } = await supabase.from('themes').select('id, name, config_json').eq('id', order.theme_id).single();
    
    return res.json({ order, theme });
  } catch (err) {
    console.error('Public invitation fetch error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
