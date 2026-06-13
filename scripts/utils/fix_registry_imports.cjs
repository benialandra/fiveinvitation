const fs = require('fs');
const file = 'src/themes/registry.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
let changed = 0;
for (let i=0; i<lines.length; i++) {
  if (lines[i].includes("import('./cinematic-variants/')")) {
     const match = lines[i].match(/const ([A-Za-z0-9_]+) = /);
     if (match) {
        lines[i] = lines[i].replace("import('./cinematic-variants/')", `import('./cinematic-variants/${match[1]}')`);
        changed++;
     }
  }
}
fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed', changed, 'lines');
