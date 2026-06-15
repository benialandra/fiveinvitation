const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../src/themes/Luxury');

const animations = [
  'GoldenParticles', // 01
  'SnowEffect',      // 02
  'FallingLeaves',   // 03
  'LightParticles',  // 04
  'SubtleParticles', // 05
  'FallingFlowers',  // 06
  'IslamicParticles',// 07
  'GoldenParticles', // 08
  'SnowEffect',      // 09
  'FallingLeaves'    // 10
];

for (let i = 1; i <= 10; i++) {
  const numStr = i.toString().padStart(2, '0');
  const filePath = path.join(themesDir, `Luxury${numStr}.tsx`);
  
  if (fs.existsSync(filePath)) {
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Replace <GoldenParticles /> with the new animation
    const anim = animations[i - 1];
    code = code.replace(/<GoldenParticles \/>/g, `<${anim} />`);
    
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`✅ Updated Luxury${numStr}.tsx with Animation: ${anim}`);
  } else {
    console.log(`⚠️ File not found: Luxury${numStr}.tsx`);
  }
}
