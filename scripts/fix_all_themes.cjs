const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'themes');
const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.tsx') && f !== 'registry.tsx' && !f.includes('_'));

const requiredSections = [
  { name: 'Countdown', keywords: ['<Countdown', 'Hitung Mundur', 'days', 'hours', 'minutes', 'timeLeft'] },
  { name: 'Story', keywords: ['<Story', 'Love Story', 'Cerita', 'Kisah', 'stories'] },
  { name: 'RSVP', keywords: ['<RSVP', 'Kehadiran', 'Konfirmasi', 'reservation', 'Reserve Your Seat'] },
  { name: 'Gift', keywords: ['<Gift', 'Hadiah', 'Kado', 'bankAccounts', 'rekening', 'Wedding Gift'] },
  { name: 'Footer', keywords: ['<Footer', 'Terima Kasih', 'Thank You', 'footer', 'The End'] }
];
// Hero, BrideGroom, Gallery are almost always present inline due to data.groom_name and data.gallery_1.
// We'll focus on the interactive/structural sections that are often missing.

let report = [];

files.forEach(file => {
  const filePath = path.join(themesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  let missingImports = [];
  let injectJSX = [];

  requiredSections.forEach(sec => {
    let found = false;
    for (let kw of sec.keywords) {
      if (content.includes(kw) || new RegExp(kw, 'i').test(content)) {
        found = true;
        break;
      }
    }
    if (!found) {
      missingImports.push(sec.name);
      injectJSX.push(`<${sec.name} data={data} lang={typeof lang !== 'undefined' ? lang : "id"} />`);
    }
  });

  if (missingImports.length > 0) {
    // Add imports
    const importStatements = missingImports.map(imp => `import ${imp} from '../components/Theme/${imp}';`).join('\n');
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImportLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImportLine + 1) + importStatements + '\n' + content.slice(endOfLastImportLine + 1);
    }

    const jsxBlock = '\n          {/* Auto-injected missing sections */}\n          <div className="w-full relative z-20">\n            ' + injectJSX.join('\n            ') + '\n          </div>\n';

    if (content.includes('</main>')) {
      content = content.replace('</main>', jsxBlock + '        </main>');
    } else if (content.includes('</SmoothScrollLayout>')) {
      content = content.replace('</SmoothScrollLayout>', jsxBlock + '    </SmoothScrollLayout>');
    } else {
      const lastDiv = content.lastIndexOf('</div>');
      if (lastDiv !== -1) {
        content = content.slice(0, lastDiv) + jsxBlock + content.slice(lastDiv);
      }
    }

    fs.writeFileSync(filePath, content);
    report.push({ theme: file.replace('.tsx', ''), added: missingImports });
  }
});

console.log("FIX REPORT:");
console.log(JSON.stringify(report, null, 2));
