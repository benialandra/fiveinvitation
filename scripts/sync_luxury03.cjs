const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) process.env[k] = envConfig[k];

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  const themeData = {
    id: 'luxury03',
    name: 'Haute Couture',
    category: 'Luxury',
    price: 450000,
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=300&auto=format&fit=crop&fm=webp'
  };

  const { data: existing, error: fetchErr } = await supabase
    .from('themes')
    .select('id')
    .eq('id', 'luxury03');
    
  if (fetchErr) {
    console.log("Fetch Error:", fetchErr);
  }

  if (existing && existing.length > 0) {
    console.log("Record already exists. Updating...");
    const { data: updated, error: updErr } = await supabase
      .from('themes')
      .update(themeData)
      .eq('id', 'luxury03')
      .select();
    console.log("Update result:", updated);
    if (updErr) console.log("Update err:", updErr);
  } else {
    console.log("Inserting new record...");
    const { data: inserted, error: insErr } = await supabase
      .from('themes')
      .insert([themeData])
      .select();
    console.log("Insert result:", inserted);
    if (insErr) console.log("Insert err:", insErr);
  }
}
sync();
