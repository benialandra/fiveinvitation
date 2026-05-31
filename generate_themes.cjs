const fs = require('fs');
const categories = ['Elegant', 'Dark', 'Minimalist', 'Islamic', 'Floral'];
const thumbs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507504031003-b417242a901f?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop'
];

let items = '';
for (let i = 7; i <= 100; i++) {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const thumb = thumbs[Math.floor(Math.random() * thumbs.length)];
  const price = (Math.floor(Math.random() * 10) + 10) * 10000;
  
  items += `  {
    id: 'mockup-theme-${i}',
    name: 'Sample Motif ${i}',
    category: '${cat}',
    price: ${price},
    thumbnail: '${thumb}',
    component: () => <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">Mockup Theme ${i} (Sample)</div>
  }`;
  if (i < 100) items += ',\n';
}

const lines = fs.readFileSync('src/themes/registry.tsx', 'utf8').split('\n');
const insertIndex = lines.findIndex(l => l.trim() === '];');
lines.splice(insertIndex, 0, '  ,\n' + items);
fs.writeFileSync('src/themes/registry.tsx', lines.join('\n'));
console.log('generated');
