const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  const content = "Hello World test upload";
  const buffer = Buffer.from(content, 'utf-8');
  
  const fileName = `test_${Date.now()}.txt`;
  
  const { data, error } = await supabase.storage
    .from('fiveinvitation-bucket')
    .upload(`uploads/${fileName}`, buffer, {
      contentType: 'text/plain',
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Supabase upload failed:", error);
  } else {
    console.log("Supabase upload succeeded:", data);
    const { data: publicData } = supabase.storage.from('fiveinvitation-bucket').getPublicUrl(`uploads/${fileName}`);
    console.log("Public URL:", publicData.publicUrl);
  }
}

testUpload();
