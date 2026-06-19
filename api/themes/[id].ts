import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing theme id' });

  try {
    if (isMock) return res.status(404).json({ error: 'Mock database' });

    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Theme not found', details: error.message });

    return res.json(data);
  } catch (err: any) {
    console.error('Failed to fetch theme:', err);
    return res.status(500).json({ error: err.message });
  }
}
