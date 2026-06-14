const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const varsToInject = `  
  const bankName = data?.customizations?.bank_name || "BCA";
  const bankAccount = data?.customizations?.bank_account || "1234567890";
  const bankOwner = data?.customizations?.bank_owner || groomName;
  
  const galleryImages = [
    data?.customizations?.gallery_1 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000",
    data?.customizations?.gallery_2 || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
    data?.customizations?.gallery_3 || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000",
    data?.customizations?.gallery_4 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000"
  ];
`;

walkDir(path.join(process.cwd(), 'src/themes'), (filePath) => {
  if (filePath.endsWith('.tsx') && !filePath.endsWith('MasterTheme.tsx') && !filePath.endsWith('registry.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Inject variables if they don't exist
    if (!content.includes('const bankName =')) {
      const injectionPoint = /const dateStr = [^\n]+;\n/;
      content = content.replace(injectionPoint, (match) => match + varsToInject);
    }

    // Fix SharedGallery
    content = content.replace(/<SharedGallery([^>]*)>/g, (match, p1) => {
      if (!p1.includes('images=')) {
        // If it closes immediately with '/>'
        if (match.endsWith('/>')) {
          return `<SharedGallery${p1.slice(0, -2)} images={galleryImages} />`;
        }
        return `<SharedGallery${p1} images={galleryImages}>`;
      }
      return match;
    });

    // Fix SharedGift
    content = content.replace(/<SharedGift([^>]*)>/g, (match, p1) => {
      if (!p1.includes('bankName=')) {
        if (match.endsWith('/>')) {
          return `<SharedGift${p1.slice(0, -2)} bankName={bankName} bankAccount={bankAccount} bankOwner={bankOwner} />`;
        }
        return `<SharedGift${p1} bankName={bankName} bankAccount={bankAccount} bankOwner={bankOwner}>`;
      }
      return match;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated props in ${filePath}`);
    }
  }
});
