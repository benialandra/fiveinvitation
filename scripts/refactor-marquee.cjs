const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, 'src/pages/Home.tsx');
let c = fs.readFileSync(homePath, 'utf8');

const target1 = '<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${order.image})` }}></div>';
const replacement1 = '<img src={order.image} loading="lazy" alt={order.names} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />';

c = c.split(target1).join(replacement1);

fs.writeFileSync(homePath, c);
console.log('Fixed marquee images');
