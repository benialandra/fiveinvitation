const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

let modifiedCount = 0;

walk('src/themes', filePath => {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // 1. Replace import { motion, ... } from 'framer-motion' with import { m, ... } from 'framer-motion'
        // This regex handles various spacing and trailing commas
        content = content.replace(/import\s*{\s*([^}]*?)\bmotion\b([^}]*?)\s*}\s*from\s*['"]framer-motion['"];?/g, (match, before, after) => {
            // Replace 'motion' with 'm'
            let newImportList = before + 'm' + after;
            return `import { ${newImportList.trim()} } from 'framer-motion';`;
        });
        
        // 2. Replace <motion.div to <m.div
        content = content.replace(/<motion\./g, '<m.');
        content = content.replace(/<\/motion\./g, '</m.');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
        }
    }
});

console.log(`Successfully refactored ${modifiedCount} theme files to use 'm' instead of 'motion'.`);
