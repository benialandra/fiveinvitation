import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const THEME_DIR = path.join(__dirname, '../src/themes');
  const REGISTRY_PATH = path.join(THEME_DIR, 'registry.tsx');

  console.log("Fetching themes from DB...");
  const res = await fetch('http://localhost:3000/api/themes');
  if (!res.ok) {
    console.error("Failed to fetch themes.");
    return;
  }
  const dbThemes = await res.json();
  
  let registryContent = fs.readFileSync(REGISTRY_PATH, 'utf-8');
  let addedCount = 0;

  for (const theme of dbThemes) {
    // If theme id is already in registry, skip
    if (registryContent.includes(`id: '${theme.id}'`) || registryContent.includes(`id: "${theme.id}"`)) {
      continue;
    }

    // Prepare component name (PascalCase)
    const componentName = theme.name
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
    
    if (!componentName) continue;

    // Check if component already exists
    const componentPath = path.join(THEME_DIR, `${componentName}.tsx`);
    if (!fs.existsSync(componentPath)) {
      // Create a basic MasterTheme wrapper
      const tsxContent = `import React from 'react';
import MasterTheme from './MasterTheme';

interface ThemeProps {
  data?: any;
  guestName?: string;
  lang?: 'en' | 'id';
}

export default function ${componentName}({ data, guestName, lang = 'id' }: ThemeProps) {
  // Tema mockup ini menggunakan MasterTheme secara default
  return (
    <MasterTheme 
      groom={data?.groom_name || "Groom"} 
      bride={data?.bride_name || "Bride"} 
      date={data?.akad_date ? new Date(data.akad_date).toLocaleDateString() : "12 Dec 2026"}
      hero_image={data?.hero_image || "${theme.thumbnail || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000'}"}
      cover_image={data?.cover_image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2000"}
      guestName={guestName}
      lang={lang}
      config_json={data?.config_json}
    />
  );
}
`;
      fs.writeFileSync(componentPath, tsxContent);
      console.log(`Created ${componentName}.tsx`);
    }

    // Add to registry.tsx
    const importStatement = `import ${componentName} from './${componentName}';`;
    if (!registryContent.includes(importStatement)) {
       // Insert import after last import
       const importRegex = /import.*?;(\r?\n)/g;
       let lastMatch;
       let match;
       while ((match = importRegex.exec(registryContent)) !== null) {
          lastMatch = match;
       }
       if (lastMatch) {
          const insertPos = lastMatch.index + lastMatch[0].length;
          registryContent = registryContent.slice(0, insertPos) + importStatement + '\n' + registryContent.slice(insertPos);
       } else {
          registryContent = importStatement + '\n' + registryContent;
       }
    }

    // Add to THEME_REGISTRY array
    const newThemeObj = `
  {
    id: '${theme.id}',
    name: '${theme.name.replace(/'/g, "\\'")}',
    category: '${theme.category || 'Premium'}',
    price: ${theme.price || 0},
    thumbnail: '${theme.thumbnail || ''}',
    component: ${componentName}
  },`;

    const registryArrayRegex = /export const THEME_REGISTRY: ThemeMeta\[\] = \[\s*/;
    if (registryArrayRegex.test(registryContent)) {
       registryContent = registryContent.replace(registryArrayRegex, `export const THEME_REGISTRY: ThemeMeta[] = [${newThemeObj}`);
    } else {
       console.error("Could not find THEME_REGISTRY array in registry.tsx");
    }

    addedCount++;
  }

  fs.writeFileSync(REGISTRY_PATH, registryContent);
  console.log(`Successfully generated and registered ${addedCount} missing themes.`);
}

main().catch(console.error);
