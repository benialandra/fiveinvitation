import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mock.supabase.co';
const supabaseKey = 'mock-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('orders').select('*');
  console.log('Orders:', JSON.stringify(data, null, 2));
  if (error) console.error('Error:', error);
}

check();
