const fs = require('fs');
const path = require('path');
const https = require('https');

const registryPath = path.join(__dirname, '..', 'src', 'themes', 'registry.tsx');
let content = fs.readFileSync(registryPath, 'utf8');

const regex = /thumbnail:\s*'([^']+)'/g;
let match;
let urls = [];
while ((match = regex.exec(content)) !== null) {
  urls.push(match[1]);
}

urls = [...new Set(urls)]; // unique URLs

const fallbackUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60';

async function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url.startsWith('http')) {
      resolve(false); // Local or broken
      return;
    }
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

async function audit() {
  console.log(`Auditing ${urls.length} unique thumbnails...`);
  let broken = [];
  
  for (let url of urls) {
    const isOk = await checkUrl(url);
    if (!isOk) {
      console.log(`[BROKEN] ${url}`);
      broken.push(url);
    }
  }
  
  if (broken.length > 0) {
    console.log(`Fixing ${broken.length} broken thumbnails...`);
    let newContent = content;
    broken.forEach(bUrl => {
      newContent = newContent.split(`thumbnail: '${bUrl}'`).join(`thumbnail: '${fallbackUrl}'`);
    });
    fs.writeFileSync(registryPath, newContent);
    console.log('Fixed thumbnails and updated registry.tsx.');
  } else {
    console.log('All thumbnails are valid.');
  }
}

audit();
