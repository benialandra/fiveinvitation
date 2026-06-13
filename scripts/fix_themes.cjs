const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'themes');

const targetThemes = [
  'CinematicLoveStory',
  'DarkPremium',
  'FairytaleCastle',
  'GlassmorphismElegance',
  'IslamicElegant',
  'MinimalistMonochrome',
  'OceanBreeze',
  'RealisticRomance',
  'ScandinavianMinimalist',
  'UltraPremiumInteractive'
];

targetThemes.forEach(theme => {
  const filePath = path.join(themesDir, `${theme}.tsx`);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  const hasCountdown = content.includes('Countdown') || content.includes('Hitung Mundur');
  const hasStory = content.includes('Story') || content.includes('Cerita');
  const hasRSVP = content.includes('RSVP') || content.includes('Kehadiran');
  const hasGift = content.includes('Gift') || content.includes('Hadiah');
  const hasFooter = content.includes('Footer') || content.includes('<footer');

  let missingImports = [];
  let injectJSX = [];

  if (!hasCountdown) { missingImports.push('Countdown'); injectJSX.push('<Countdown data={data} lang={lang} />'); }
  if (!hasStory) { missingImports.push('Story'); injectJSX.push('<Story data={data} lang={lang} />'); }
  if (!hasRSVP) { missingImports.push('RSVP'); injectJSX.push('<RSVP data={data} lang={lang} />'); }
  if (!hasGift) { missingImports.push('Gift'); injectJSX.push('<Gift data={data} lang={lang} />'); }
  if (!hasFooter) { missingImports.push('Footer'); injectJSX.push('<Footer data={data} lang={lang} />'); }

  if (missingImports.length === 0) return;

  // Add imports
  const importStatements = missingImports.map(imp => `import ${imp} from '../components/Theme/${imp}';`).join('\n');
  
  // Find last import
  const lastImportIndex = content.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    const endOfLastImportLine = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, endOfLastImportLine + 1) + importStatements + '\n' + content.slice(endOfLastImportLine + 1);
  }

  // Inject JSX right before the end of the return statement
  // This is tricky. Most themes have `</main>` or `</SmoothScrollLayout>` or a final `</div>`.
  // We'll try to find the logical end of the component before the closing tags.
  
  // Let's inject it right before `<Footer` or `<footer` if it exists, otherwise before `</main>`, else before last `</div>`
  
  const jsxBlock = '\n          {/* Auto-injected missing sections */}\n          <div className="w-full relative z-20">\n            ' + injectJSX.join('\n            ') + '\n          </div>\n';

  if (content.includes('<footer')) {
    content = content.replace('<footer', jsxBlock + '          <footer');
  } else if (content.includes('<Footer')) {
    content = content.replace('<Footer', jsxBlock + '          <Footer');
  } else if (content.includes('</main>')) {
    content = content.replace('</main>', jsxBlock + '        </main>');
  } else if (content.includes('</SmoothScrollLayout>')) {
    content = content.replace('</SmoothScrollLayout>', jsxBlock + '    </SmoothScrollLayout>');
  } else {
    // Inject before the LAST closing </div>
    const lastDiv = content.lastIndexOf('</div>');
    if (lastDiv !== -1) {
      content = content.slice(0, lastDiv) + jsxBlock + content.slice(lastDiv);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Injected [${missingImports.join(', ')}] into ${theme}.tsx`);
  }
});
