const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  
  const targetDir = path.join(__dirname, '../scratch/screenshots');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    console.log(`⏳ Navigating to Luxury01...`);
    await page.goto(`http://localhost:3000/preview/Luxury/Luxury01`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Auto-open invitation
    const openBtn = await page.locator('text=Open Invitation');
    if (await openBtn.count() > 0) {
      await openBtn.first().click();
    }
    
    console.log(`⏳ Waiting for animations...`);
    await page.waitForTimeout(5000);
    
    // Scroll entire page
    let lastHeight = await page.evaluate('document.body.scrollHeight');
    while (true) {
        await page.evaluate('window.scrollBy(0, 500)');
        await page.waitForTimeout(500);
        let newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === lastHeight) break;
        lastHeight = newHeight;
    }
    
    // Wait for lazy load
    await page.waitForTimeout(2000);

    const screenshotPath = path.join(targetDir, `Luxury01_Redesign.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Saved screenshot to ${screenshotPath}`);

  } catch (err) {
    console.error(`Error processing Luxury01:`, err);
  }

  await browser.close();
  console.log('🎉 Verification completed!');
})();
