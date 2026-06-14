const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'src', 'themes');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

const importStatement = `import { SharedCountdown, SharedRSVP, SharedGift } from '../../components/theme';\n`;

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') || filePath.includes('MasterTheme') || filePath.includes('registry') || filePath.includes('StandardSections') || filePath.includes('CinematicTheme')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Check if already refactored
    if (content.includes('SharedCountdown')) return;

    // Inject Import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextLineIndex + 1) + importStatement + content.slice(nextLineIndex + 1);
    } else {
        content = importStatement + content;
    }

    // Replace Countdown (4 -> 5)
    content = content.replace(
        /\{\/\* 4\. COUNTDOWN TIMER \*\/\}[\s\S]*?(?=\{\/\* 5\. EVENT DETAILS \*\/\})/g,
        `{/* 4. COUNTDOWN TIMER */}
          <SharedCountdown targetDate={weddingDate} colors={{ primary: '#c5a059', text: '#ffffff', background: '#333333' }} />\n\n          `
    );

    // Replace RSVP (8 -> 9)
    content = content.replace(
        /\{\/\* 8\. RSVP & WISHES FORM \*\/\}[\s\S]*?(?=\{\/\* 9\. WEDDING GIFT \/ ANGPAO DIGITAL \*\/\})/g,
        `{/* 8. RSVP & WISHES FORM */}
          <SharedRSVP orderId={data?.id} colors={{ primary: '#c5a059', text: '#333333', background: '#fcfcfc', accent: '#f5f5f5' }} />\n\n          `
    );

    // Replace Gift (9 -> 10)
    content = content.replace(
        /\{\/\* 9\. WEDDING GIFT \/ ANGPAO DIGITAL \*\/\}[\s\S]*?(?=\{\/\* 10\. CLOSING FOOTER \*\/\})/g,
        `{/* 9. WEDDING GIFT / ANGPAO DIGITAL */}
          <SharedGift bankName={data?.bank_name_1 || "Bank BCA"} bankAccount={data?.bank_account_1} bankOwner={data?.bank_account_name_1 || "Nama Pemilik"} colors={{ primary: '#c5a059', text: '#333333', background: '#fdfbf7' }} />\n\n          `
    );

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Refactored: ${path.basename(filePath)}`);
    }
}

let count = 0;
walkDir(themesDir, (fp) => {
    processFile(fp);
    count++;
});
console.log(`Processed ${count} files.`);
