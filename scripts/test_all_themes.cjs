const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'src', 'themes');

function getThemeIds() {
    const ids = [];
    fs.readdirSync(themesDir).forEach(folder => {
        const folderPath = path.join(themesDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            fs.readdirSync(folderPath).forEach(file => {
                if (file.endsWith('.tsx')) {
                    // e.g. Dark01.tsx -> dark-01
                    const match = file.match(/^([A-Za-z]+)(\d+)\.tsx$/);
                    if (match) {
                        ids.push(`${match[1].toLowerCase()}-${match[2]}`);
                    }
                }
            });
        }
    });
    return ids;
}

(async () => {
    console.log('Launching Playwright...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const themeIds = getThemeIds();
    console.log(`Found ${themeIds.length} themes to test.`);

    let successCount = 0;
    let failCount = 0;

    for (const themeId of themeIds) {
        try {
            const url = `http://localhost:3000/preview/${themeId}`;
            const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
            
            // Allow a short moment for client-side rendering
            await page.waitForTimeout(500);

            // Check if any error boundary caught an error by checking for typical error texts
            const bodyText = await page.innerText('body');
            if (bodyText.includes('Something went wrong') || bodyText.includes('TypeError')) {
                console.error(`❌ [FAILED] ${themeId} - React Render Error`);
                failCount++;
            } else if (response.status() === 200) {
                console.log(`✅ [SUCCESS] ${themeId} loaded beautifully.`);
                successCount++;
            } else {
                console.error(`❌ [FAILED] ${themeId} - HTTP Status ${response.status()}`);
                failCount++;
            }
        } catch (error) {
            console.error(`❌ [FAILED] ${themeId} - Exception: ${error.message}`);
            failCount++;
        }
    }

    console.log(`\n--- TEST SUMMARY ---`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total: ${themeIds.length}`);

    await browser.close();
    process.exit(failCount === 0 ? 0 : 1);
})();
