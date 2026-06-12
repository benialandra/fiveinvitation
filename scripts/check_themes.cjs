const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkThemes() {
  const { data, error } = await supabase.from('themes').select('id, name, config_json');
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Themes found in database:", data.length);
    data.forEach(t => {
      console.log(`- ID: ${t.id}, Name: ${t.name}, Has config_json: ${!!t.config_json}`);
    });
  }
}

checkThemes();
