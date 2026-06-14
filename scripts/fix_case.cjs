const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

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

let count = 0;
walkDir(srcDir, (fp) => {
    if (!fp.endsWith('.tsx') && !fp.endsWith('.ts')) return;
    
    let content = fs.readFileSync(fp, 'utf8');
    let originalContent = content;

    content = content.replace(
        /from '([^']*)components\/theme'/g,
        "from '$1components/Theme'"
    );

    if (content !== originalContent) {
        fs.writeFileSync(fp, content, 'utf8');
        console.log(`Fixed casing in: ${path.basename(fp)}`);
        count++;
    }
});
console.log(`Fixed casing in ${count} files.`);
