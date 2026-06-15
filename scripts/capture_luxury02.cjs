const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runReview() {
  const outputDir = path.join(__dirname, '..', 'docs', 'reviews');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching Playwright...");
  const browser = await chromium.launch({ headless: true });

  async function reviewLayout(isMobile, name) {
    console.log(`Starting ${name} review...`);
    const context = await browser.newContext(
      isMobile 
        ? { viewport: { width: 375, height: 812 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' } 
        : { viewport: { width: 1440, height: 900 } }
    );
    const page = await context.newPage();

    console.log(`Navigating to Luxury02 (${name})...`);
    await page.goto('http://localhost:3000/preview/luxury02', { waitUntil: 'networkidle' });

    // Click 'Break The Seal'
    console.log("Clicking Break The Seal...");
    try {
      const btn = await page.waitForSelector('button:has-text("Break The Seal")', { timeout: 5000 });
      if (btn) await btn.click();
    } catch (e) {
      console.log("Button not found or already open.");
    }

    console.log("Waiting 10 seconds for initial animations...");
    await page.waitForTimeout(10000);

    console.log("Scrolling slowly and capturing screenshots...");
    // We capture top, middle, and bottom
    await page.screenshot({ path: path.join(outputDir, `${name}_1_hero.png`) });
    
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, `${name}_2_gallery.png`) });
    
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, `${name}_3_rsvp.png`) });
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, `${name}_4_footer.png`) });

    await context.close();
    console.log(`Finished ${name} review.`);
  }

  try {
    await reviewLayout(true, 'mobile');
    await reviewLayout(false, 'desktop');
  } catch (err) {
    console.error("Error during review:", err);
  } finally {
    await browser.close();
    console.log("Playwright closed.");
  }
}

runReview();
