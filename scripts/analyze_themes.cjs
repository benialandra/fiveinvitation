const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'themes');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const requiredSections = ['1. HERO', '3. BRIDE', '4. COUNTDOWN', '6. LOVE STORY', '7. PHOTO GALLERY', '8. RSVP', '9. WEDDING GIFT', '10. CLOSING FOOTER'];
const stats = {
    total: 0,
    missing: {},
    filesMissing: []
};

requiredSections.forEach(s => stats.missing[s] = 0);

walkDir(themesDir, function(filePath) {
    if (filePath.endsWith('.tsx') && !filePath.includes('registry') && !filePath.includes('MasterTheme') && !filePath.includes('StandardSections') && !filePath.includes('CinematicTheme')) {
        stats.total++;
        const content = fs.readFileSync(filePath, 'utf8');
        let fileIsMissing = false;
        requiredSections.forEach(s => {
            if (!content.includes(s)) {
                stats.missing[s]++;
                fileIsMissing = true;
            }
        });
        if (fileIsMissing) {
            stats.filesMissing.push(path.basename(filePath));
        }
    }
});

console.log(JSON.stringify(stats, null, 2));
