import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`PAGE ERROR EXCEPTION: ${error.message}`);
  });

  await page.goto('http://localhost:3000/themes', { waitUntil: 'networkidle' });
  
  // Wait a bit for React to render
  await page.waitForTimeout(2000);
  
  const text = await page.textContent('body');
  console.log("Body text contains:");
  console.log(text.slice(0, 500));
  
  await browser.close();
})();
