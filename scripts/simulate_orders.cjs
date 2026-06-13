const { execSync } = require('child_process');

async function simulate() {
  const themesToTest = ['luxury01', 'minimal01', 'islamic01', 'floral01', 'rustic01'];

  for (const theme of themesToTest) {
    console.log(`\n--- Simulating Order for ${theme} ---`);
    
    const groomName = `Groom_${theme}`;
    const brideName = `Bride_${theme}`;
    const slug = `test-${theme}-${Date.now()}`;
    const akadDate = new Date();
    akadDate.setDate(akadDate.getDate() + 30);
    
    try {
      const res = await fetch('http://localhost:3000/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: `SIM-${Date.now()}`,
          gross_amount: 150000,
          first_name: groomName,
          email: 'test@example.com',
          groom_name: groomName,
          bride_name: brideName,
          theme_id: theme,
          akad_date: akadDate.toISOString(),
          slug: slug,
          customizations: { font: 'default', color: 'default' }
        })
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error(`Failed to parse response: ${text.substring(0, 100)}...`);
        continue;
      }
      
      if (!res.ok) {
        console.error(`API Error: ${data.error}`);
        continue;
      }
      
      console.log(`Order created. Slug: ${slug}. Token: ${data.token ? 'Yes' : 'No'}`);
      
      // Normally we would use Playwright here to verify, but since we just want to ensure it created, we can fetch the preview page
      const pageRes = await fetch(`http://localhost:3000/api/invitation?slug=${slug}`);
      if (pageRes.ok) {
        console.log(`Successfully retrieved invitation data for ${slug}`);
        const invData = await pageRes.json();
        if (invData.theme_id === theme) {
            console.log("SUCCESS: Mapping is correct.");
        } else {
            console.error("ERROR: Mapping mismatch.");
        }
      } else {
        console.error(`Failed to fetch invitation API for ${slug}`);
      }
      
    } catch (err) {
      console.error(`Fetch error: ${err.message}`);
    }
  }
}

simulate();
