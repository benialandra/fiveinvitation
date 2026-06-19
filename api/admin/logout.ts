import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (!isMock) {
      try {
        await supabase.from('admin_sessions').delete().eq('token', token);
      } catch {}
    }
  }
  return res.json({ success: true });
}
