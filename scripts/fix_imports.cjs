const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(path.join(process.cwd(), 'src'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace @/lib/utils to @/utils/utils
    content = content.replace(/@\/lib\/utils/g, '@/utils/utils');
    // Replace @/lib/supabase to @/supabase/supabase
    content = content.replace(/@\/lib\/supabase/g, '@/supabase/supabase');

    // Replace relative paths
    content = content.replace(/(\.\.\/)+lib\/utils/g, (match) => match.replace('lib', 'utils'));
    content = content.replace(/(\.\.\/)+lib\/supabase/g, (match) => match.replace('lib', 'supabase'));
    content = content.replace(/\.\/lib\/utils/g, './utils/utils');
    content = content.replace(/\.\/lib\/supabase/g, './supabase/supabase');

    // Also update index.css
    if (filePath.endsWith('main.tsx')) {
        content = content.replace(/import '\.\/index\.css';/, "import './styles/index.css';");
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  }
});
