const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '../src/themes/registry.tsx');
let code = fs.readFileSync(registryPath, 'utf8');

const badUrls = [
  "https://elglmntxhbxrysewliqb.supabase.co/storage/v1/object/public/fiveinvitation-bucket/uploads/1780461197556_Screenshot2024-11-29205020.png",
  "https://elglmntxhbxrysewliqb.supabase.co/storage/v1/object/public/fiveinvitation-bucket/uploads/1780315086220_ChatGPTImageMay28202611_27_01PM.png",
  "https://images.unsplash.com/photo-1507504031003-b417242a901f?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544078754-0a3791001a1c?q=80&w=300&auto=format&fit=crop"
];

const fallbackUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300&auto=format&fit=crop";

badUrls.forEach(badUrl => {
  // Use simple string replacement globally
  code = code.split(badUrl).join(fallbackUrl);
});

fs.writeFileSync(registryPath, code);
console.log("Broken thumbnails replaced with fallback successfully.");
