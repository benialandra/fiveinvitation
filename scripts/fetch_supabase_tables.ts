import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

async function getTables() {
  try {
    // Fetch OpenAPI schema to get all exposed tables/views
    const schemaRes = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
    const schema = await schemaRes.json();
    
    if (schema.message || schema.hint) {
      console.log('Supabase Error:', schema.message, schema.hint);
      return;
    }

    let definitions = schema.definitions || (schema.components && schema.components.schemas) || {};
    const tables = Object.keys(definitions);
    
    if (tables.length === 0) {
      console.log('No tables found or schema format unknown:', Object.keys(schema));
      return;
    }
    
    console.log(`| Table Name | Row Count | Primary Key |`);
    console.log(`|---|---|---|`);

    for (const tableName of tables) {
      const properties = definitions[tableName].properties || {};
      let primaryKeys = [];
      // Usually, we don't have explicit PKs in definitions easily unless marked.
      // But we can guess 'id' or we can check the path definitions for GET /tableName?id=eq...
      
      // PostgREST swagger has x-primary-key or something similar, let's see.
      // Actually, we can just make a HEAD request to get the exact count
      const countRes = await fetch(`${supabaseUrl}/rest/v1/${tableName}?select=*`, {
        method: 'HEAD',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'count=exact'
        }
      });
      
      const count = countRes.headers.get('content-range') 
        ? countRes.headers.get('content-range').split('/')[1] 
        : 'Unknown';

      // To find primary keys, we can look at the paths for DELETE or PATCH /tableName
      // Usually they require primary key params.
      // Or we can guess it's 'id' if it exists.
      if (properties.id) {
        primaryKeys.push('id');
      }

      console.log(`| ${tableName} | ${count} | ${primaryKeys.join(', ') || 'Unknown'} |`);
    }

  } catch (err) {
    console.error('Error fetching tables:', err);
  }
}

getTables();
