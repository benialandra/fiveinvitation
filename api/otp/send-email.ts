import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email tidak valid.' });
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  if (!isMock) {
    try {
      const { error } = await supabase.from('otp_store').upsert(
        [{ email, otp, expires_at: new Date(expiresAt).toISOString() }],
        { onConflict: 'email' }
      );
      if (error) {
        console.warn('Supabase otp_store upsert failed:', error.message);
        // Note: Without a DB, Vercel Serverless cannot reliably store OTP in memory
        // if the next request hits a different cold start.
        return res.status(500).json({ error: 'Gagal menyimpan OTP di database.' });
      }
    } catch (err: any) {
      console.error('Supabase otp_store exception:', err.message);
      return res.status(500).json({ error: 'Kesalahan sistem saat menyimpan OTP.' });
    }
  }

  try {
    if (process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || 'dummy',
          pass: process.env.SMTP_PASS || 'dummy'
        }
      });

      await transporter.sendMail({
        from: '"FiveInvitation" <noreply@fiveinvitation.com>',
        to: email,
        subject: 'Kode OTP Verifikasi - FiveInvitation',
        text: `Kode OTP Anda adalah: ${otp}. Kode ini berlaku selama 5 menit.`,
        html: `<div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Verifikasi Email Anda</h2>
          <p>Gunakan kode OTP berikut untuk melanjutkan pesanan Anda:</p>
          <h1 style="color: #C5A059; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          <p>Kode ini hanya berlaku selama 5 menit.</p>
        </div>`
      });
    } else {
      console.log(`[DEV MODE] Simulated OTP for ${email}: ${otp}`);
    }
    return res.json({ success: true, message: 'OTP terkirim.' });
  } catch (error: any) {
    console.error('Gagal mengirim OTP:', error);
    return res.status(500).json({ error: 'Gagal mengirim email OTP. Pastikan konfigurasi SMTP benar.' });
  }
}
