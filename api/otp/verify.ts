import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp } = req.body || {};
  
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email atau OTP kosong.' });
  }

  if (isMock) {
    // Mock mode bypass
    return res.json({ success: true, message: 'Email berhasil diverifikasi (Mock).' });
  }

  try {
    const { data, error } = await supabase.from('otp_store').select('*').eq('email', email).single();
    
    if (error || !data) {
      return res.status(400).json({ error: 'Kode OTP tidak ditemukan atau belum dikirim.' });
    }

    if (Date.now() > new Date(data.expires_at).getTime()) {
      await supabase.from('otp_store').delete().eq('email', email);
      return res.status(400).json({ error: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang.' });
    }

    if (data.otp !== otp) {
      return res.status(400).json({ error: 'Kode OTP salah.' });
    }

    // Valid
    await supabase.from('otp_store').delete().eq('email', email);
    return res.json({ success: true, message: 'Email berhasil diverifikasi.' });

  } catch (err: any) {
    console.error('OTP verify error:', err);
    return res.status(500).json({ error: 'Terjadi kesalahan saat memverifikasi OTP.' });
  }
}
