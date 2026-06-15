const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncDb() {
  console.log("Synchronizing database...");
  
  // Try to delete obsolete themes
  const retainList = ['Luxury01', 'Floral01', 'Minimal01', 'Islamic01', 'Dark01', 'CinematicTheme'];
  
  try {
    const { data, error } = await supabase
      .from('themes')
      .delete()
      .not('name', 'in', `(${retainList.join(',')})`);
      
    if (error) {
      console.error("Failed to delete via API. This is expected if RLS prevents deletion via Anon Key.");
      console.error(error.message);
    } else {
      console.log("Successfully deleted obsolete themes via API.");
    }
  } catch (e) {
    console.error("Exception during deletion:", e);
  }
}

syncDb();
