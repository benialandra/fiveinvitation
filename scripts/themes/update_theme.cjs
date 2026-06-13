const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTheme() {
  const codes = ['INV-IUW4FD', 'INV-6QG8M8'];
  
  for (const code of codes) {
    const { data, error } = await supabase
      .from('orders')
      .update({ theme_id: 'autumn-sunset' })
      .eq('unique_code', code)
      .select();

    if (error) {
      console.error(`Error updating theme for ${code}:`, error);
    } else {
      console.log(`Successfully updated theme for ${code} to 'autumn-sunset'`);
    }
  }
}

updateTheme();
