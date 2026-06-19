import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from './_lib/supabase';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, otp } = req.body || {};

  if (action === 'send') {
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email tidak valid.' });
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    if (!isMock) {
      try {
        const { error } = await supabase.from('otp_store').upsert([{ email, otp: generatedOtp, expires_at: new Date(expiresAt).toISOString() }], { onConflict: 'email' });
        if (error) return res.status(500).json({ error: 'Gagal menyimpan OTP di database.' });
      } catch (err: any) {
        return res.status(500).json({ error: 'Kesalahan sistem saat menyimpan OTP.' });
      }
    }

    try {
      if (process.env.SMTP_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.ethereal.email',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
          from: '"FiveInvitation" <noreply@fiveinvitation.com>',
          to: email,
          subject: 'Kode OTP Verifikasi - FiveInvitation',
          text: `Kode OTP Anda adalah: ${generatedOtp}. Kode ini berlaku selama 5 menit.`,
          html: `<div style="font-family: sans-serif; text-align: center; padding: 20px;"><h2>Verifikasi Email Anda</h2><p>Gunakan kode OTP berikut untuk melanjutkan pesanan Anda:</p><h1 style="color: #C5A059; letter-spacing: 5px; font-size: 32px;">${generatedOtp}</h1><p>Kode ini hanya berlaku selama 5 menit.</p></div>`
        });
      } else {
        console.log(`[DEV MODE] Simulated OTP for ${email}: ${generatedOtp}`);
      }
      return res.json({ success: true, message: 'OTP terkirim.' });
    } catch (error: any) {
      return res.status(500).json({ error: 'Gagal mengirim email OTP. Pastikan konfigurasi SMTP benar.' });
    }
  }

  if (action === 'verify') {
    if (!email || !otp) return res.status(400).json({ error: 'Email atau OTP kosong.' });
    if (isMock) return res.json({ success: true, message: 'Email berhasil diverifikasi (Mock).' });

    try {
      const { data, error } = await supabase.from('otp_store').select('*').eq('email', email).single();
      if (error || !data) return res.status(400).json({ error: 'Kode OTP tidak ditemukan atau belum dikirim.' });
      if (Date.now() > new Date(data.expires_at).getTime()) {
        await supabase.from('otp_store').delete().eq('email', email);
        return res.status(400).json({ error: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang.' });
      }
      if (data.otp !== otp) return res.status(400).json({ error: 'Kode OTP salah.' });

      await supabase.from('otp_store').delete().eq('email', email);
      return res.json({ success: true, message: 'Email berhasil diverifikasi.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Terjadi kesalahan saat memverifikasi OTP.' });
    }
  }

  return res.status(400).json({ error: 'Invalid action' });
}
