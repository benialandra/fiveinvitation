const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Navigating to login...");
    await page.goto('http://localhost:3000/secure-admin-login');
    
    console.log("Logging in...");
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    console.log("Waiting for dashboard...");
    await page.waitForSelector('text=Dashboard Overview');
    
    console.log("Navigating to Themes tab...");
    await page.click('button:has-text("Themes")');
    await page.waitForSelector('text=Theme Catalog');
    
    console.log("Clicking Edit Tema for the first theme...");
    // Find the first theme's settings button
    await page.hover('.group\\/menu button');
    await page.click('text=Edit Tema');
    
    console.log("Waiting for Edit Tema modal...");
    await page.waitForSelector('h3:has-text("Edit Tema")');
    
    // Simulate removing an existing gallery image if any
    const removeBtns = await page.$$('.bg-black\\/50.text-white.rounded-full.p-1.hover\\:bg-red-500');
    if (removeBtns.length > 0) {
        console.log("Removing existing gallery image...");
        await removeBtns[0].click();
    }
    
    console.log("Uploading a new thumbnail image...");
    // We can just upload a dummy file
    const fs = require('fs');
    fs.writeFileSync('dummy.jpg', 'dummy image content');
    await page.setInputFiles('input[type="file"]', 'dummy.jpg');
    
    console.log("Submitting form...");
    
    // Setup listeners to catch errors
    page.on('console', msg => {
        if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
    });
    
    const [response] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/api/admin/themes/')),
        page.click('button:has-text("Simpan Perubahan")')
    ]);
    
    console.log("Response status:", response.status());
    console.log("Response body:", await response.text());
    
    // Wait for any toast
    await page.waitForTimeout(2000);
    
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
})();
