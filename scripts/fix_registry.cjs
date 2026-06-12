const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '../src/themes/registry.tsx');
let code = fs.readFileSync(registryPath, 'utf8');

// We will use a regex to match the object blocks in THEME_REGISTRY.
// Each object has name: '...', category: '...', price: ..., thumbnail: '...', component: ...
code = code.replace(/name:\s*'([^']+)',([\s\S]*?)component:\s*([A-Za-z0-9_]+)/g, (match, nameVal, middle, oldComp) => {
  if (nameVal.startsWith('Cinematic ')) {
    const parts = nameVal.split(' ');
    const num = parts.pop();
    const correctCompName = parts.join('') + '_' + num;
    return "name: '" + nameVal + "'," + middle + "component: " + correctCompName;
  }
  return match;
});

fs.writeFileSync(registryPath, code);
console.log("Registry component references repaired successfully.");
