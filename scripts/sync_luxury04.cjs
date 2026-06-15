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
    id: 'luxury04',
    name: 'The Great Gala',
    category: 'Luxury',
    price: 400000,
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=60&w=300&auto=format&fit=crop&fm=webp'
  };

  const { data: existing, error: fetchErr } = await supabase
    .from('themes')
    .select('id')
    .eq('id', 'luxury04');
    
  if (fetchErr) {
    console.log("Fetch Error:", fetchErr);
  }

  if (existing && existing.length > 0) {
    console.log("Record already exists. Updating...");
    const { data: updated, error: updErr } = await supabase
      .from('themes')
      .update(themeData)
      .eq('id', 'luxury04')
      .select();
    if (updErr) console.log("Update err:", updErr);
  } else {
    console.log("Inserting new record...");
    const { data: inserted, error: insErr } = await supabase
      .from('themes')
      .insert([themeData])
      .select();
    if (insErr) console.log("Insert err:", insErr);
  }
  
  // Verify no duplicates
  const { data: allThemes } = await supabase.from('themes').select('id, name');
  const counts = allThemes.filter(t => t.id === 'luxury04').length;
  console.log(`Verification: Found ${counts} record(s) for luxury04 in DB.`);
}
sync();
