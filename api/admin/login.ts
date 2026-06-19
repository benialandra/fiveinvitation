import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');

function generateAdminToken(): string {
  const payload = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
  const hmac = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body || {};

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server.' });
  }

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password salah.' });
  }

  const token = generateAdminToken();
  const now = Date.now();
  const SESSION_TTL = 4 * 60 * 60 * 1000; // 4 hours
  const expiresAt = now + SESSION_TTL;

  // Save session to Supabase for persistence across serverless invocations
  if (!isMock) {
    try {
      await supabase.from('admin_sessions').insert({
        token,
        expires_at: new Date(expiresAt).toISOString(),
      });
    } catch (err: any) {
      console.warn('Session insert failed:', err.message);
    }
  }

  return res.json({ success: true, token, expiresIn: SESSION_TTL });
}
