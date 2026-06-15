const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

const targetDevices = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'iPhone 14 Pro Max', ...devices['iPhone 14 Pro Max'] },
  { name: 'Galaxy A54', viewport: { width: 412, height: 915 }, userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36' }
];

async function runReview() {
  const outputDir = path.join(__dirname, '..', 'docs', 'reviews', 'luxury04');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching Playwright for Luxury04 cross-device test...");
  const browser = await chromium.launch({ headless: true });

  for (const device of targetDevices) {
    console.log(`\nTesting on ${device.name}...`);
    const context = await browser.newContext(device);
    const page = await context.newPage();

    // Check console errors
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`[CONSOLE ERROR - ${device.name}]: "${msg.text()}"`);
    });

    console.log("Navigating...");
    await page.goto('http://localhost:3000/preview/luxury04', { waitUntil: 'networkidle' });

    console.log("Waiting 5 seconds...");
    await page.waitForTimeout(5000);

    console.log("Scrolling and capturing...");
    const safeName = device.name.replace(/ /g, '_').toLowerCase();
    
    // Top
    await page.screenshot({ path: path.join(outputDir, `${safeName}_1_hero.png`) });
    
    // Middle
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDir, `${safeName}_2_mid.png`) });
    
    // Bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    console.log("Waiting 5 seconds at the end...");
    await page.waitForTimeout(5000); 
    await page.screenshot({ path: path.join(outputDir, `${safeName}_3_footer.png`) });

    await context.close();
  }

  await browser.close();
  console.log("\nAll cross-device tests finished.");
}

runReview();
