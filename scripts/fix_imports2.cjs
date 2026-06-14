const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'src', 'themes');
const componentsDir = path.join(__dirname, '..', 'src', 'components', 'theme');

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
walkDir(themesDir, (fp) => {
    if (!fp.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(fp, 'utf8');
    let originalContent = content;

    // Calculate the correct relative path from the file's directory to the components directory
    const fileDir = path.dirname(fp);
    let relativePath = path.relative(fileDir, componentsDir).replace(/\\/g, '/');
    
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }

    // Replace ANY of the previous broken imports
    content = content.replace(
        /from '(\.\.\/)*components\/theme'/g,
        `from '${relativePath}'`
    );

    if (content !== originalContent) {
        fs.writeFileSync(fp, content, 'utf8');
        console.log(`Fixed: ${path.basename(fp)} with ${relativePath}`);
        count++;
    }
});
console.log(`Fixed ${count} files.`);
