import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from './_lib/supabase';
import { requireAdmin } from './_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const isAuth = await requireAdmin(req, res);
  if (!isAuth) return;

  const action = req.body?.action || req.query?.action;

  // POST action=create
  if (req.method === 'POST' && action === 'create') {
    try {
      const { id, name, category, price, thumbnail, config_json } = req.body || {};
      if (isMock) return res.json({ success: true, message: 'Simulated' });

      let parsedConfig = null;
      if (config_json && config_json !== 'undefined') {
        parsedConfig = typeof config_json === 'string' ? JSON.parse(config_json) : config_json;
      }
      const finalThumbnail = thumbnail || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000';

      const { data, error } = await supabase.from('themes').insert([{
        id: id || `theme-${Date.now()}`, name, category, price: Number(price), thumbnail: finalThumbnail, sales: 0, config_json: parsedConfig
      }]).select().single();

      if (error) throw error;
      return res.json({ success: true, theme: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // PUT action=update
  if (req.method === 'PUT' && action === 'update') {
    try {
      const { id, name, category, price, thumbnail, config_json } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      if (isMock) return res.json({ success: true, thumbnail });

      let parsedConfig: any = undefined;
      if (config_json && config_json !== 'undefined') {
        parsedConfig = typeof config_json === 'string' ? JSON.parse(config_json) : config_json;
      }

      const updatePayload: any = { name, category, price: Number(price), thumbnail };
      if (parsedConfig !== undefined) updatePayload.config_json = parsedConfig;

      const { data, error } = await supabase.from('themes').update(updatePayload).eq('id', id).select();
      if (error) throw error;
      return res.json({ success: true, theme: data?.[0] || { id, ...updatePayload } });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST action=seed
  if (req.method === 'POST' && action === 'seed') {
    try {
      if (isMock) return res.status(400).json({ error: 'Mock DB' });
      const { themes } = req.body || {};
      if (!themes || !Array.isArray(themes)) return res.status(400).json({ error: 'Invalid payload' });

      const { error } = await supabase.from('themes').upsert(themes, { onConflict: 'id' });
      if (error) throw error;
      return res.json({ success: true, message: 'Themes seeded' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
