import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;

  try {
    if (isMock) {
      if (id) return res.status(404).json({ error: 'Mock database' });
      return res.json({ themes: [] });
    }

    if (id && typeof id === 'string') {
      const { data, error } = await supabase.from('themes').select('*').eq('id', id).single();
      if (error) return res.status(404).json({ error: 'Theme not found', details: error.message });
      return res.json(data);
    } else {
      const { data, error } = await supabase.from('themes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json({ themes: data });
    }
  } catch (err: any) {
    console.error('Failed to fetch themes:', err);
    return res.status(500).json({ error: err.message });
  }
}
