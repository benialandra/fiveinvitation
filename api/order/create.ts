import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';
// @ts-ignore
import midtransClient from 'midtrans-client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { order_id, gross_amount, first_name, email, theme_id, groom_name, bride_name, customizations } = req.body || {};

    // Save to Supabase
    if (!isMock) {
      const insertData: any = {
        unique_code: order_id,
        groom_name,
        bride_name,
        theme_id,
        status: 'PENDING',
        slug: req.body?.slug,
        akad_date: req.body?.akad_date || null,
        customer_email: email,
        is_email_verified: true,
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
        console.error('Supabase insert error:', JSON.stringify(error));
        if (error.code === '23505' && error.message?.includes('slug')) {
          return res.status(400).json({ error: 'Custom URL (slug) ini sudah digunakan. Silakan pilih URL lain.' });
        }
        return res.status(500).json({ error: 'Terdapat kesalahan saat menyimpan pesanan.' });
      }
    }

    // Midtrans Payment Token
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
        transaction_details: {
          order_id,
          gross_amount: Math.round(gross_amount),
        },
        credit_card: { secure: true },
        customer_details: {
          first_name: first_name || 'Guest',
          email: email || 'guest@example.com',
        },
        callbacks: {
          finish: `${appUrl}/track`,
          error: `${appUrl}/track`,
          pending: `${appUrl}/track`,
        },
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
