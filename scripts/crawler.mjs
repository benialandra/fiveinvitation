import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseUrl = 'http://localhost:3000';
  const visited = new Set();
  const queue = [baseUrl];
  const errors = [];
  
  console.log("Starting crawler at", baseUrl);
  
  while (queue.length > 0) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);
    
    console.log(`Checking: ${currentUrl}`);
    
    try {
      const response = await page.goto(currentUrl, { waitUntil: 'networkidle', timeout: 10000 });
      
      if (!response.ok()) {
        errors.push(`[HTTP ${response.status()}] on ${currentUrl}`);
      }
      
      // Check for obvious client-side errors like "Not Found" text
      const bodyText = await page.textContent('body');
      if (bodyText.includes('Page Not Found') || bodyText.includes('404')) {
         errors.push(`[404 Text] on ${currentUrl}`);
      }
      
      // Find all links
      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => a.href);
      });
      
      for (const href of hrefs) {
        if (href.startsWith(baseUrl)) {
           // Remove hash fragments
           const cleanHref = href.split('#')[0];
           if (!visited.has(cleanHref) && !queue.includes(cleanHref)) {
             queue.push(cleanHref);
           }
        }
      }
    } catch (e) {
      errors.push(`[Exception] on ${currentUrl}: ${e.message}`);
    }
  }
  
  console.log("\n--- Crawl Results ---");
  console.log(`Pages Visited: ${visited.size}`);
  if (errors.length > 0) {
    console.log("Errors Found:");
    errors.forEach(e => console.log(e));
  } else {
    console.log("No broken links found!");
  }
  
  await browser.close();
})();
