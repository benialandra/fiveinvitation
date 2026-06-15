const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runReview() {
  const outputDir = path.join(__dirname, '..', 'docs', 'reviews');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching Playwright for Luxury03...");
  const browser = await chromium.launch({ headless: true });

  async function reviewLayout(isMobile, name) {
    console.log(`Starting ${name} review...`);
    const context = await browser.newContext(
      isMobile 
        ? { viewport: { width: 375, height: 812 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' } 
        : { viewport: { width: 1440, height: 900 } }
    );
    const page = await context.newPage();

    console.log(`Navigating to Luxury03 (${name})...`);
    await page.goto('http://localhost:3000/preview/luxury03', { waitUntil: 'networkidle' });

    // Click 'Enter'
    console.log("Clicking Enter...");
    try {
      const btn = await page.waitForSelector('button:has-text("Enter")', { timeout: 5000 });
      if (btn) await btn.click();
    } catch (e) {
      console.log("Button not found or already open.");
    }

    console.log("Waiting 5 seconds for initial animations...");
    await page.waitForTimeout(5000);

    console.log("Scrolling slowly and capturing screenshots...");
    // Top (Hero)
    await page.screenshot({ path: path.join(outputDir, `luxury03_${name}_1_hero.png`) });
    
    // Middle (Story / Gallery)
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, `luxury03_${name}_2_gallery.png`) });
    
    // Middle-Bottom (RSVP / Details)
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, `luxury03_${name}_3_rsvp.png`) });
    
    // Bottom (Footer / Gift)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(5000); // Wait 5 seconds at the end as requested
    await page.screenshot({ path: path.join(outputDir, `luxury03_${name}_4_footer.png`) });

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
