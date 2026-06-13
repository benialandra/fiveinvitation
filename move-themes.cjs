const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'src', 'themes');
const variantsDir = path.join(themesDir, 'cinematic-variants');
const registryFile = path.join(themesDir, 'registry.tsx');

// 1. Move files and update imports
if (fs.existsSync(variantsDir)) {
  const files = fs.readdirSync(variantsDir);
  let movedCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const oldPath = path.join(variantsDir, file);
      const newPath = path.join(themesDir, file);
      
      let content = fs.readFileSync(oldPath, 'utf8');
      // Update the import path for CinematicTheme
      content = content.replace(/from '\.\.\/CinematicTheme'/g, "from './CinematicTheme'");
      
      fs.writeFileSync(newPath, content);
      fs.unlinkSync(oldPath);
      movedCount++;
    }
  });
  
  // Remove dir if empty
  try {
    fs.rmdirSync(variantsDir);
    console.log(`Successfully moved ${movedCount} files and removed variants directory.`);
  } catch (e) {
    console.error("Could not remove variants dir:", e);
  }
}

// 2. Update registry.tsx
if (fs.existsSync(registryFile)) {
  let registryContent = fs.readFileSync(registryFile, 'utf8');
  const initialContent = registryContent;
  
  // Update the imports to point to current directory
  registryContent = registryContent.replace(/\.\/cinematic-variants\//g, './');
  
  if (registryContent !== initialContent) {
    fs.writeFileSync(registryFile, registryContent);
    console.log("Updated registry.tsx imports successfully.");
  }
}

