const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '../src/themes');
const sharedComponentsList = [
    'SharedHero',
    'SharedStory',
    'SharedCountdown',
    'SharedGallery',
    'SharedGift',
    'SharedRSVP'
];

function getFilesRecursively(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

function analyzeThemes() {
    const files = getFilesRecursively(THEMES_DIR).filter(f => f.endsWith('.tsx') && !f.endsWith('registry.tsx') && !f.endsWith('registry.ts') && !f.endsWith('MasterTheme.tsx'));
    
    let stats = {
        totalThemes: files.length,
        fullyCompliant: 0,
        partiallyCompliant: 0,
        nonCompliant: 0,
        missingImports: []
    };

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        let importedShared = 0;
        let missing = [];

        sharedComponentsList.forEach(comp => {
            if (content.includes(`import ${comp}`) || content.includes(`import { ${comp} }`)) {
                importedShared++;
            } else {
                missing.push(comp);
            }
        });

        if (importedShared === sharedComponentsList.length) {
            stats.fullyCompliant++;
        } else if (importedShared > 0) {
            stats.partiallyCompliant++;
            stats.missingImports.push({ file, missing });
        } else {
            stats.nonCompliant++;
            stats.missingImports.push({ file, missing });
        }
    });

    console.log("=== Phase 1: Component Compliance Audit ===");
    console.log(`Total Themes: ${stats.totalThemes}`);
    console.log(`Fully Compliant (uses all 6 Shared components): ${stats.fullyCompliant}`);
    console.log(`Partially Compliant: ${stats.partiallyCompliant}`);
    console.log(`Non Compliant: ${stats.nonCompliant}`);
    
    if (stats.fullyCompliant === stats.totalThemes) {
        console.log("\nAll themes are fully compliant!");
    } else {
        console.log("\nSample of missing imports:");
        stats.missingImports.slice(0, 5).forEach(m => {
            console.log(`- ${m.file} is missing: ${m.missing.join(', ')}`);
        });
    }
}

analyzeThemes();
