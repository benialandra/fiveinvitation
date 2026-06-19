import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { orderCode } = req.query;
  if (!orderCode || typeof orderCode !== 'string') {
    return res.status(400).json({ error: 'Missing order code' });
  }

  if (req.method === 'GET') {
    try {
      if (isMock) return res.status(404).json({ error: 'Not found' });

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('unique_code', orderCode)
        .single();

      if (error || !data) return res.status(404).json({ error: 'Not found' });

      return res.json(data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
        groom_name, bride_name, groom_parents, bride_parents,
        akad_date, resepsi_date, location_name, maps_link,
        story, music_url, slug, cover_image, hero_image,
        customizations
      } = req.body || {};

      const updateData: any = {
        groom_name, bride_name, groom_parents, bride_parents,
        location_name, maps_link, story, music_url, slug,
        cover_image, hero_image,
        akad_date: akad_date || null,
        resepsi_date: resepsi_date || null,
        customizations: customizations
          ? (typeof customizations === 'string' ? JSON.parse(customizations) : customizations)
          : null,
      };

      if (isMock) return res.json({ status: 'success', data: updateData });

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('unique_code', orderCode)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        return res.status(500).json({ error: error.message || 'Failed to update order' });
      }

      return res.json(data);
    } catch (err: any) {
      console.error('Failed to update order:', err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
