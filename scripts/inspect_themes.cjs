const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) process.env[k] = envConfig[k];

const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

async function verify() {
  const { data, error } = await supabase.from('themes').select('id, name, category');
  if (error) return console.error(error);
  
  console.log("Total DB Records:", data.length);
  const ids = data.map(t => t.id);
  const uniqueIds = new Set(ids);
  
  if (ids.length === uniqueIds.size) {
    console.log("VERIFIED: No duplicate records found. All IDs are unique.");
  } else {
    console.log("WARNING: Duplicates found!");
  }
  
  console.log("Current themes in DB:");
  console.table(data);
}
verify();
