const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../src/themes/Luxury');

for (let i = 1; i <= 10; i++) {
  const numStr = i.toString().padStart(2, '0');
  const filePath = path.join(themesDir, `Luxury${numStr}.tsx`);
  
  if (fs.existsSync(filePath)) {
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Update imports
    code = code.replace(/SharedGallery/g, 'PremiumGallery');
    code = code.replace(/SharedRSVP/g, 'PremiumRSVP');
    
    // Inject variant
    code = code.replace(/<PremiumGallery/g, `<PremiumGallery variant={${i}}`);
    code = code.replace(/<PremiumRSVP/g, `<PremiumRSVP variant={${i}}`);
    
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`✅ Updated Luxury${numStr}.tsx with Premium Variant ${i}`);
  } else {
    console.log(`⚠️ File not found: Luxury${numStr}.tsx`);
  }
}
