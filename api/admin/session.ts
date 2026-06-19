import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.slice(7);

  if (isMock) return res.status(401).json({ error: 'Mock mode' });

  try {
    const { data, error } = await supabase.from('admin_sessions').select('*').eq('token', token).single();
    if (error || !data) return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
    if (Date.now() > new Date(data.expires_at).getTime()) {
      await supabase.from('admin_sessions').delete().eq('token', token);
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    return res.json({ authenticated: true });
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
