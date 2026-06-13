const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("Connecting to:", supabaseUrl);
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error("Error fetching order:", error);
  } else if (data && data.length > 0) {
    console.log("Table columns found in Supabase:", Object.keys(data[0]));
    console.log("Example order data:", data[0]);
  } else {
    console.log("No orders found in table.");
  }
}

inspect();
