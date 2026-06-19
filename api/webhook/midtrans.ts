import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isMock } from '../_lib/supabase';
// @ts-ignore
import midtransClient from 'midtrans-client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const serverKey = process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key';
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const snap = new midtransClient.Snap({
  isProduction,
  serverKey: serverKey.replace(/^["']|["']$/g, ''),
  clientKey: (process.env.VITE_MIDTRANS_CLIENT_KEY || '').replace(/^["']|["']$/g, ''),
});

async function sendEmailNotification(to: string, subject: string, text: string, html: string) {
  if (!process.env.SMTP_USER) {
    console.log(`[SIMULATED EMAIL to ${to}] Subject: ${subject}`);
    return;
  }
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: '"FiveInvitation" <noreply@fiveinvitation.com>',
    to,
    subject,
    text,
    html
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const rawServerKey = serverKey.replace(/^["']|["']$/g, '');
    
    // SECURITY: Verify Midtrans webhook signature
    if (rawServerKey && rawServerKey !== 'dummy_server_key' && req.body.signature_key) {
      const { order_id, status_code, gross_amount, signature_key } = req.body;
      const expectedSignature = crypto
        .createHash('sha512')
        .update(`${order_id}${status_code}${gross_amount}${rawServerKey}`)
        .digest('hex');
        
      if (signature_key !== expectedSignature) {
        console.error(`Webhook signature mismatch for order ${order_id}`);
        return res.status(403).json({ error: 'Invalid webhook signature' });
      }
    }

    const statusResponse = await snap.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Payment notification received. OrderId: ${orderId}, Status: ${transactionStatus}`);
    
    let status = 'PENDING';
    if (transactionStatus == 'capture') {
        if (fraudStatus == 'challenge'){
          status = 'CHALLENGE';
        } else if (fraudStatus == 'accept'){
          status = 'PAID';
        }
    } else if (transactionStatus == 'settlement') {
        status = 'PAID';
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
        status = 'CANCELLED';
    } else if (transactionStatus == 'pending'){
        status = 'PENDING';
    }
    
    if (!isMock) {
      try {
        const { data: orderData } = await supabase.from('orders').select('*').eq('unique_code', orderId).single();
        await supabase.from('orders').update({ status }).eq('unique_code', orderId);

        // Send payment success email
        if (status === 'PAID' && orderData && orderData.status !== 'PAID' && orderData.customer_email) {
          await sendEmailNotification(
            orderData.customer_email,
            `Pembayaran Berhasil - Undangan ${orderData.groom_name} & ${orderData.bride_name}`,
            `Pembayaran untuk order ${orderId} telah berhasil. Anda sekarang dapat menyebarkan undangan Anda.`,
            `<p>Halo,</p><p>Pembayaran untuk pesanan undangan Anda dengan kode <strong>${orderId}</strong> telah berhasil.</p><p>Anda sekarang dapat melengkapi data dan menyebarkan undangan Anda.</p>`
          );
        }
      } catch(dbErr) {
        console.error('Failed to update status in Supabase:', dbErr);
      }
    } else {
       if (status === 'PAID') {
          await sendEmailNotification(
           'customer@example.com',
           `Mock Pembayaran Berhasil - Order ${orderId}`,
           `Mock email: Pembayaran untuk order ${orderId} telah berhasil.`,
           `<p>Mock email: Pembayaran untuk order ${orderId} telah berhasil.</p>`
         );
       }
    }

    return res.status(200).json({ status: 'OK', order_id: orderId, resolved_status: status });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
