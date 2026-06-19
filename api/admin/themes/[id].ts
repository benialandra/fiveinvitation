import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../../_lib/supabase';
import { requireAdmin } from '../../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  // Require admin token
  const isAuth = await requireAdmin(req, res);
  if (!isAuth) return;

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing theme id' });

  try {
    const { name, category, price, thumbnail: currentThumbnail, config_json } = req.body || {};
    
    // Note: multer uploads removed. Vercel is read-only.
    // Client should upload to Supabase Storage and send URL via 'thumbnail' body param
    let finalThumbnail = currentThumbnail || '';

    if (isMock) return res.json({ success: true, thumbnail: finalThumbnail });

    let parsedConfig: any = undefined;
    try {
      if (config_json && config_json !== 'undefined') {
        parsedConfig = typeof config_json === 'string' ? JSON.parse(config_json) : config_json;
      }
    } catch {
      return res.status(400).json({ error: 'Invalid JSON format in config_json' });
    }

    const updatePayload: any = {
      name,
      category,
      price: Number(price),
      thumbnail: finalThumbnail
    };
    if (parsedConfig !== undefined) updatePayload.config_json = parsedConfig;

    const { data: dbData, error } = await supabase
      .from('themes')
      .update(updatePayload)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    const returnedTheme = dbData && dbData.length > 0 ? dbData[0] : { id, ...updatePayload };
    return res.json({ success: true, thumbnail: finalThumbnail, theme: returnedTheme });
  } catch (err: any) {
    console.error('Failed to update theme:', err);
    return res.status(500).json({ error: err.message });
  }
}
