import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const rawSupabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseUrl = rawSupabaseUrl.replace(/^["']|["']$/g, '');
const supabaseKey = (process.env.VITE_SUPABASE_ANON_KEY || 'mock-key').replace(/^["']|["']$/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('orders').select('*');
  console.log("All orders:", data);
}
check();
