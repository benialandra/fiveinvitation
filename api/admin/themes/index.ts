import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../../_lib/supabase';
import { requireAdmin } from '../../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Require admin token
  const isAuth = await requireAdmin(req, res);
  if (!isAuth) return;

  try {
    const { id, name, category, price, thumbnail, config_json } = req.body || {};

    if (isMock) return res.json({ success: true, message: 'Simulated theme creation' });

    let parsedConfig: any = null;
    try {
      if (config_json && config_json !== 'undefined') {
        parsedConfig = typeof config_json === 'string' ? JSON.parse(config_json) : config_json;
      }
    } catch {
      return res.status(400).json({ error: 'Invalid JSON format in config_json' });
    }

    const finalThumbnail = thumbnail || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop';

    // Note: File uploads (multer) are NOT supported in Vercel Serverless.
    // In production, frontend should upload directly to Supabase Storage and send the URL here.

    const { data, error } = await supabase.from('themes').insert([{
      id: id || `theme-${Date.now()}`,
      name,
      category,
      price: Number(price),
      thumbnail: finalThumbnail,
      sales: 0,
      config_json: parsedConfig
    }]).select().single();

    if (error) throw error;
    
    return res.json({ success: true, theme: data });
  } catch (err: any) {
    console.error('Failed to create theme:', err);
    return res.status(500).json({ error: err.message });
  }
}
