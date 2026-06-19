import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../../_lib/supabase';
import { requireAdmin } from '../../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const isAuth = await requireAdmin(req, res);
  if (!isAuth) return;

  try {
    if (isMock) return res.status(400).json({ error: 'Connect to real Supabase to seed' });

    const { themes } = req.body || {};
    if (!themes || !Array.isArray(themes)) {
      return res.status(400).json({ error: 'Invalid themes payload' });
    }

    const { error } = await supabase.from('themes').upsert(themes, { onConflict: 'id' });
    if (error) throw error;
    
    return res.json({ success: true, message: 'Themes seeded successfully' });
  } catch (err: any) {
    console.error('Failed to seed themes:', err);
    return res.status(500).json({ error: err.message });
  }
}
