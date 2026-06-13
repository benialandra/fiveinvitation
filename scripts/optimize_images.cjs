const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, '../src/themes'), function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Regex to match <img (not having loading attribute)
    let modified = content.replace(/<img\s+(?!.*loading="lazy")(.*?)\/?>/gi, (match, attrs) => {
      // Don't lazy load Hero or Cover
      if (attrs.includes('alt="Hero"') || attrs.includes('alt="Cover"')) {
        return match;
      }
      return `<img loading="lazy" ${attrs}/>`;
    });
    
    // Also append WebP and resizing if we find Unsplash URLs that are not customized
    modified = modified.replace(/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+([^"']*)/g, (match, params) => {
        if (!match.includes('fm=webp')) {
           return match + (match.includes('?') ? '&fm=webp&q=60' : '?fm=webp&q=60');
        }
        return match;
    });

    if (content !== modified) {
      fs.writeFileSync(filePath, modified);
      console.log('Optimized:', filePath);
    }
  }
});
