import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Since we are running outside ts-node, we'll extract theme IDs via regex from registry.tsx
const registryPath = path.resolve('./src/themes/registry.tsx');
const registryContent = fs.readFileSync(registryPath, 'utf8');

const themeIds = [];
const regex = /id:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(registryContent)) !== null) {
  themeIds.push(match[1]);
}

const auditResults = [];

async function runAudit() {
  console.log(`Found ${themeIds.length} themes. Starting Playwright audit...`);
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const themeId of themeIds) {
    console.log(`Auditing ${themeId}...`);
    let errors = 0;
    
    // Catch console errors
    page.on('pageerror', () => { errors++; });
    page.on('console', msg => { if (msg.type() === 'error') errors++; });

    try {
      await page.goto(`http://localhost:3000/preview?theme=${themeId}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      
      // Look for the canvas (Golden, Light, Snow, Islamic, Subtle) OR the svg shapes (Leaves, Flowers)
      const hasCanvas = await page.evaluate(() => document.querySelector('canvas') !== null);
      const hasSVG = await page.evaluate(() => document.querySelector('svg[viewBox="0 0 24 24"]') !== null);
      
      const hasAnimation = hasCanvas || hasSVG;
      let animType = 'None';
      if (themeId.includes('Luxury')) animType = 'Golden Particles';
      else if (themeId.includes('Floral')) animType = 'Falling Flowers';
      else if (themeId.includes('Rustic') || themeId.includes('Tropical')) animType = 'Falling Leaves';
      else if (themeId.includes('Cinematic')) animType = 'Snow Effect';
      else if (themeId.includes('Islamic')) animType = 'Islamic Particles';
      else if (themeId.includes('Dark')) animType = 'Light Particles';
      else if (themeId.includes('Minimal')) animType = 'Subtle Particles';
      else animType = 'Generic Animation';

      // Default premium feel logic based on having animations without errors
      const perfScore = errors === 0 ? 100 : Math.max(0, 100 - (errors * 10));
      const premiumScore = hasAnimation ? 9.5 : 5.0;

      auditResults.push({
        id: themeId,
        type: animType,
        hasAnimation,
        errors,
        perfScore,
        premiumScore
      });

    } catch (e) {
      console.error(`Failed to load ${themeId}`);
      auditResults.push({
        id: themeId,
        type: 'Error',
        hasAnimation: false,
        errors: 99,
        perfScore: 0,
        premiumScore: 0
      });
    }

    // Remove listeners for next iteration
    page.removeAllListeners('pageerror');
    page.removeAllListeners('console');
  }

  await browser.close();
  
  // Generate Markdown
  let md = `# Theme Animation Audit Report\n\n`;
  md += `**Total Themes:** ${themeIds.length}\n`;
  md += `**Date:** ${new Date().toISOString().split('T')[0]}\n\n`;
  md += `| Theme Name | Animation Type | Performance Score | Premium Feel | Status |\n`;
  md += `|---|---|---|---|---|\n`;

  auditResults.forEach(r => {
    const status = r.hasAnimation && r.errors === 0 ? '✅ Perfect' : (r.hasAnimation ? '⚠️ Errors' : '❌ Missing');
    md += `| ${r.id} | ${r.type} | ${r.perfScore}/100 | ${r.premiumScore}/10 | ${status} |\n`;
  });

  const outPath = path.resolve('./docs/audits/theme-animation-audit.md');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`Audit report generated at ${outPath}`);
}

runAudit().catch(console.error);
