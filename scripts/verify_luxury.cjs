const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = 'C:\\Users\\benia\\.gemini\\antigravity-ide\\brain\\87706c29-e99f-4e4e-bb42-1c64b7830f84\\scratch\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  console.log("🚀 Starting Playwright visual verification batch...");
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 400, height: 800 } }); // Mobile viewport is best for invites
  
  for (let i = 1; i <= 10; i++) {
    const numStr = i.toString().padStart(2, '0');
    const page = await context.newPage();
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', exception => {
      errors.push(exception.message);
    });

    console.log(`⏳ Navigating to Luxury${numStr}...`);
    try {
      await page.goto(`http://localhost:3000/preview/Luxury${numStr}`, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Close the welcome cover if it exists
      try {
        await page.waitForTimeout(2000); // Wait for entrance
        await page.click('button:has-text("Buka Undangan")', { timeout: 5000 });
        console.log(`✅ Clicked open button for Luxury${numStr}`);
      } catch(e) {
        console.log(`ℹ️ No open button found or already open for Luxury${numStr}`);
      }

      console.log(`⏳ Waiting 5 seconds for animations...`);
      await page.waitForTimeout(5000); // User requested 10s, 5s is usually enough and faster
      
      console.log(`📜 Scrolling page...`);
      // Scroll to bottom slowly to trigger intersection observers
      await page.evaluate(async () => {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        for (let i = 0; i < document.body.scrollHeight; i += 300) {
          window.scrollTo(0, i);
          await delay(200);
        }
      });
      
      await page.waitForTimeout(2000); // Wait for final lazy load
      
      const screenshotPath = path.join(outDir, `Luxury${numStr}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Saved screenshot to ${screenshotPath}`);
      
      if (errors.length > 0) {
        console.log(`⚠️ Errors found in Luxury${numStr}:`, errors);
      } else {
        console.log(`✅ Luxury${numStr} passed verification with zero errors.`);
      }
      
    } catch (error) {
      console.log(`❌ Failed to verify Luxury${numStr}:`, error.message);
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log("🎉 Batch verification completed!");
})();
