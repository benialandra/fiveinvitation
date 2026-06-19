import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from './supabase';

/**
 * Validates admin Bearer token against Supabase admin_sessions table.
 * In serverless (Vercel), we cannot use in-memory sessions,
 * so all session validation goes through the database.
 */
export async function validateAdminToken(token: string): Promise<boolean> {
  if (!token || isMock) return false;

  try {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) return false;

    if (Date.now() > new Date(data.expires_at).getTime()) {
      await supabase.from('admin_sessions').delete().eq('token', token);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Middleware-style function for admin-protected Vercel API routes.
 * Returns true if authorized, sends 401 response and returns false if not.
 */
export async function requireAdmin(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return false;
  }

  const token = authHeader.slice(7);
  if (!(await validateAdminToken(token))) {
    res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
    return false;
  }

  return true;
}
