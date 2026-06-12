const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const customizationsObj = {
    font: 'Great Vibes',
    color: '#8F9779',
    groom_image: 'https://example.com/groom.jpg',
    bride_image: 'https://example.com/bride.jpg',
    gallery_1: 'https://example.com/gal1.jpg',
    gallery_2: 'https://example.com/gal2.jpg',
    gallery_3: 'https://example.com/gal3.jpg',
    gallery_4: 'https://example.com/gal4.jpg'
  };

  const { data, error } = await supabase
    .from('orders')
    .update({ customizations: customizationsObj })
    .eq('unique_code', 'INV-IUW4FD')
    .select()
    .single();

  if (error) {
    console.error("Error updating customizations:", error);
  } else {
    console.log("Successfully updated order customizations:", data.customizations);
  }
}

testUpdate();
