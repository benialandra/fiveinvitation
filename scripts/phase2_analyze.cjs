const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '../src/themes');

function getFilesRecursively(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

function extractJSXStructure(code) {
    // A simplified extraction of the JSX structure to ignore content and styling
    // 1. Remove imports
    let structure = code.replace(/import.*?from.*?;/g, '');
    // 2. Remove comments
    structure = structure.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    // 3. Extract tag names AND className/style props to account for visual differences
    const tags = [];
    // Regex matches <Tag className="..." style={{...}}>
    const tagRegex = /<([a-zA-Z0-9]+)[^>]*>/g;
    let match;
    while ((match = tagRegex.exec(structure)) !== null) {
        // Find className and style within the tag to add to the structure
        const fullTag = match[0];
        const classNameMatch = fullTag.match(/className=["'{](.*?)["'}]/);
        const className = classNameMatch ? classNameMatch[1].replace(/\s+/g, '.') : '';
        const styleMatch = fullTag.match(/style={{(.*?)}}/);
        const styleProps = styleMatch ? styleMatch[1].replace(/\s+/g, '') : '';
        const hasMotion = fullTag.includes('initial=') || fullTag.includes('animate=') ? 'motion' : '';
        
        tags.push(`${match[1]}.${className}.${styleProps}.${hasMotion}`);
    }
    return tags.join(',');
}

function calculateSimilarity(str1, str2) {
    // Jaccard similarity based on bigrams of tags
    const bigrams1 = new Set();
    const bigrams2 = new Set();
    
    const arr1 = str1.split(',');
    for (let i = 0; i < arr1.length - 1; i++) {
        bigrams1.add(arr1[i] + ',' + arr1[i+1]);
    }
    
    const arr2 = str2.split(',');
    for (let i = 0; i < arr2.length - 1; i++) {
        bigrams2.add(arr2[i] + ',' + arr2[i+1]);
    }
    
    let intersection = 0;
    for (const b of bigrams1) {
        if (bigrams2.has(b)) intersection++;
    }
    
    const union = bigrams1.size + bigrams2.size - intersection;
    return union === 0 ? 0 : (intersection / union) * 100;
}

function analyzeDuplicates() {
    const files = getFilesRecursively(THEMES_DIR).filter(f => f.endsWith('.tsx') && !f.endsWith('registry.tsx') && !f.endsWith('MasterTheme.tsx'));
    
    console.log(`Analyzing ${files.length} themes for duplicates...`);
    
    const themeStructures = files.map(file => {
        const content = fs.readFileSync(file, 'utf-8');
        return {
            file,
            name: path.basename(file),
            structure: extractJSXStructure(content)
        };
    });
    
    const clusters = [];
    const visited = new Set();
    
    for (let i = 0; i < themeStructures.length; i++) {
        if (visited.has(i)) continue;
        
        const cluster = [themeStructures[i]];
        visited.add(i);
        
        for (let j = i + 1; j < themeStructures.length; j++) {
            if (visited.has(j)) continue;
            
            const similarity = calculateSimilarity(themeStructures[i].structure, themeStructures[j].structure);
            if (similarity > 70) {
                themeStructures[j].similarity = similarity;
                cluster.push(themeStructures[j]);
                visited.add(j);
            }
        }
        
        if (cluster.length > 1) {
            clusters.push(cluster);
        }
    }
    
    console.log(`\nFound ${clusters.length} clusters of duplicated themes (>70% similarity)`);
    clusters.forEach((cluster, idx) => {
        console.log(`\nCluster ${idx + 1} (${cluster.length} themes):`);
        console.log(`  Base: ${cluster[0].name}`);
        cluster.slice(1).forEach(t => {
            console.log(`  Duplicate: ${t.name} (${t.similarity.toFixed(2)}% similar)`);
        });
    });

    fs.writeFileSync('duplicate_clusters.json', JSON.stringify(clusters.map(c => c.map(t => t.file)), null, 2));
    console.log(`\nWritten duplicate_clusters.json`);
}

analyzeDuplicates();
