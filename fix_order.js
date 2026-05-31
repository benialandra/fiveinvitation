import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseUrl = rawSupabaseUrl.replace(/^["']|["']$/g, '');
const supabaseKey = (process.env.VITE_SUPABASE_ANON_KEY || 'mock-key').replace(/^["']|["']$/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data, error } = await supabase.from('orders').select('*').eq('status', 'PENDING');
  console.log("Found pending orders:", data);
  if (data && data.length > 0) {
    for (let order of data) {
      const { error: updErr } = await supabase.from('orders').update({ status: 'PAID' }).eq('unique_code', order.unique_code);
      if (updErr) console.error(updErr);
      else console.log(`Updated ${order.unique_code} to PAID`);
    }
  }
}
fix();
