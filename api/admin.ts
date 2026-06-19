import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from './_lib/supabase';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');

function generateAdminToken(): string {
  const payload = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
  const hmac = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.body?.action || req.query?.action;

  if (action === 'login' && req.method === 'POST') {
    const { password } = req.body || {};
    if (!ADMIN_PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server.' });
    if (!password || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Password salah.' });

    const token = generateAdminToken();
    const SESSION_TTL = 4 * 60 * 60 * 1000;
    const expiresAt = Date.now() + SESSION_TTL;

    if (!isMock) {
      try {
        await supabase.from('admin_sessions').insert({ token, expires_at: new Date(expiresAt).toISOString() });
      } catch (err: any) {
        console.warn('Session insert failed:', err.message);
      }
    }
    return res.json({ success: true, token, expiresIn: SESSION_TTL });
  }

  if (action === 'logout' && req.method === 'POST') {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      if (!isMock) {
        try { await supabase.from('admin_sessions').delete().eq('token', token); } catch {}
      }
    }
    return res.json({ success: true });
  }

  if (action === 'session' && req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = authHeader.slice(7);

    if (isMock) return res.status(401).json({ error: 'Mock mode' });

    try {
      const { data, error } = await supabase.from('admin_sessions').select('*').eq('token', token).single();
      if (error || !data) return res.status(401).json({ error: 'Unauthorized' });
      if (Date.now() > new Date(data.expires_at).getTime()) {
        await supabase.from('admin_sessions').delete().eq('token', token);
        return res.status(401).json({ error: 'Unauthorized: Token expired' });
      }
      return res.json({ authenticated: true });
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  return res.status(405).json({ error: 'Action not valid or method not allowed' });
}
