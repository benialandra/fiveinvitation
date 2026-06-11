const fs = require('fs');
let content = fs.readFileSync('src/themes/registry.tsx', 'utf8');
content = content.replace(/^import\s+([A-Za-z0-9_]+)\s+from\s+'\.\/(.*?)';\r?$/gm, 'const $1 = React.lazy(() => import(\'./$2\'));');
fs.writeFileSync('src/themes/registry.tsx', content);
