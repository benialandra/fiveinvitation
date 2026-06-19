import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (isMock) return res.json([]);

    const limit = parseInt(req.query.limit as string) || 100;
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.json([]);
    }
    return res.json(data || []);
  } catch (err) {
    console.error('Failed to fetch themes:', err);
    return res.json([]);
  }
}
