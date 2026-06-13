const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatest() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error:", error);
  } else if (data && data.length > 0) {
    console.log("Latest updated order details:");
    console.log("Order Code:", data[0].unique_code);
    console.log("Groom Name:", data[0].groom_name);
    console.log("Bride Name:", data[0].bride_name);
    console.log("Groom Parents:", data[0].groom_parents);
    console.log("Bride Parents:", data[0].bride_parents);
    console.log("Cover Image:", data[0].cover_image);
    console.log("Hero Image:", data[0].hero_image);
    console.log("Customizations:", data[0].customizations);
    console.log("Updated At:", data[0].updated_at);
  } else {
    console.log("No orders found.");
  }
}

checkLatest();
