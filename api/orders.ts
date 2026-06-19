import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from './_lib/supabase';
// @ts-ignore
import midtransClient from 'midtrans-client';
import { requireAdmin } from './_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { orderCode } = req.query;

  // GET: Fetch all orders (Admin) or Fetch single order by code
  if (req.method === 'GET') {
    try {
      if (orderCode && typeof orderCode === 'string') {
        if (isMock) return res.status(404).json({ error: 'Not found' });
        const { data, error } = await supabase.from('orders').select('*').eq('unique_code', orderCode).single();
        if (error || !data) return res.status(404).json({ error: 'Not found' });
        return res.json(data);
      } else {
        const isAuth = await requireAdmin(req, res);
        if (!isAuth) return;
        if (isMock) return res.json({ orders: [] });
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.json({ orders: data });
      }
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // PUT: Update single order by code
  if (req.method === 'PUT') {
    if (!orderCode || typeof orderCode !== 'string') return res.status(400).json({ error: 'Missing order code' });
    try {
      const {
        groom_name, bride_name, groom_parents, bride_parents,
        akad_date, resepsi_date, location_name, maps_link,
        story, music_url, slug, cover_image, hero_image, customizations
      } = req.body || {};

      const updateData: any = {
        groom_name, bride_name, groom_parents, bride_parents,
        location_name, maps_link, story, music_url, slug, cover_image, hero_image,
        akad_date: akad_date || null, resepsi_date: resepsi_date || null,
        customizations: customizations ? (typeof customizations === 'string' ? JSON.parse(customizations) : customizations) : null,
      };

      if (isMock) return res.json({ status: 'success', data: updateData });

      const { data, error } = await supabase.from('orders').update(updateData).eq('unique_code', orderCode).select().single();
      if (error) return res.status(500).json({ error: error.message || 'Failed to update order' });
      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }

  // POST: Create order and Midtrans transaction
  if (req.method === 'POST') {
    try {
      const { order_id, gross_amount, first_name, email, theme_id, groom_name, bride_name, customizations } = req.body || {};

      if (!isMock) {
        const insertData: any = {
          unique_code: order_id, groom_name, bride_name, theme_id,
          status: 'PENDING', slug: req.body?.slug, akad_date: req.body?.akad_date || null,
          customer_email: email, is_email_verified: true,
          customizations: customizations || null,
        };
        let { error } = await supabase.from('orders').insert([insertData]);
        if (error && error.message && error.message.includes('customer_email')) {
          const fallbackData = { ...insertData };
          delete fallbackData.customer_email;
          const result = await supabase.from('orders').insert([fallbackData]);
          error = result.error;
        }
        if (error) {
          if (error.code === '23505' && error.message?.includes('slug')) {
            return res.status(400).json({ error: 'Custom URL (slug) ini sudah digunakan. Silakan pilih URL lain.' });
          }
          return res.status(500).json({ error: 'Terdapat kesalahan saat menyimpan pesanan.' });
        }
      }

      let token = 'debug-token-12345';
      let redirect_url = '#';
      const serverKey = process.env.MIDTRANS_SERVER_KEY;
      if (serverKey && serverKey !== 'dummy_server_key') {
        const snap = new midtransClient.Snap({
          isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
          serverKey: serverKey.replace(/^["']|["']$/g, ''),
          clientKey: (process.env.VITE_MIDTRANS_CLIENT_KEY || '').replace(/^["']|["']$/g, ''),
        });
        const appUrl = process.env.VITE_APP_URL || 'https://fiveinvitation.com';
        const parameter: any = {
          transaction_details: { order_id, gross_amount: Math.round(gross_amount) },
          credit_card: { secure: true },
          customer_details: { first_name: first_name || 'Guest', email: email || 'guest@example.com' },
          callbacks: { finish: `${appUrl}/track`, error: `${appUrl}/track`, pending: `${appUrl}/track` },
        };
        const transaction = await snap.createTransaction(parameter);
        token = transaction.token;
        redirect_url = transaction.redirect_url;
      }
      return res.json({ token, redirect_url });
    } catch (error: any) {
      console.error('Order create error:', error);
      return res.status(500).json({ error: 'Failed to generate payment token' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
