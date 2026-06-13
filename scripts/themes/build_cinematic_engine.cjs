const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/themes/AutumnSunset.tsx');
const destPath = path.join(__dirname, '../src/themes/CinematicTheme.tsx');

let code = fs.readFileSync(srcPath, 'utf8');

// 1. Change component name
code = code.replace(/export default function AutumnSunset/g, 'export default function CinematicTheme');

// 2. Add config prop to interface
code = code.replace(/interface ThemeProps \{/g, `export interface CinematicConfig {
  particleType: 'leaves' | 'sakura' | 'snow' | 'sparkles' | 'raindrops';
  colors: {
    bgBase: string;
    bgMid: string;
    bgLight: string;
    primary: string;
    primaryHover: string;
    textMain: string;
    textMuted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface ThemeProps {
  config?: CinematicConfig;`);

// 3. Update component signature
code = code.replace(
  /export default function CinematicTheme\(\{\s*data,\s*guestName,\s*lang\s*=\s*'id'\s*\}\:\s*ThemeProps\)\s*\{/,
  `export default function CinematicTheme({ data, guestName, lang = 'id', config }: ThemeProps) {
  const finalConfig = config || {
    particleType: 'leaves',
    colors: {
      bgBase: '#120804',
      bgMid: '#180d07',
      bgLight: '#2d1b10',
      primary: '#df9f28',
      primaryHover: '#f59e0b',
      textMain: '#faf6f0',
      textMuted: '#d5c2b0'
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Plus Jakarta Sans', sans-serif"
    }
  };`
);

// 4. Inject CSS Variables at root div
code = code.replace(
  /<div className="bg-\[#120804\] text-\[#faf6f0\]/g,
  `<div style={{
        '--c-bg-base': finalConfig.colors.bgBase,
        '--c-bg-mid': finalConfig.colors.bgMid,
        '--c-bg-light': finalConfig.colors.bgLight,
        '--c-primary': finalConfig.colors.primary,
        '--c-primary-hover': finalConfig.colors.primaryHover,
        '--c-text-main': finalConfig.colors.textMain,
        '--c-text-muted': finalConfig.colors.textMuted,
        fontFamily: finalConfig.fonts.body
      } as React.CSSProperties} className="bg-[var(--c-bg-base)] text-[var(--c-text-main)]`
);

// Replace Tailwind Arbitrary values with CSS vars
const replacements = {
  '#120804': 'var(--c-bg-base)',
  '#180d07': 'var(--c-bg-mid)',
  '#2d1b10': 'var(--c-bg-light)',
  '#df9f28': 'var(--c-primary)',
  '#f59e0b': 'var(--c-primary-hover)',
  '#faf6f0': 'var(--c-text-main)',
  '#d5c2b0': 'var(--c-text-muted)'
};

for (const [hex, cssVar] of Object.entries(replacements)) {
  // Regex to replace hex in tailwind classes like bg-[#120804] -> bg-[var(--c-bg-base)]
  const regex = new RegExp(`\\[${hex}\\]`, 'gi');
  code = code.replace(regex, `[${cssVar}]`);
}

// Replace font families
code = code.replace(/"Playfair Display", serif/g, `\${finalConfig.fonts.heading}`);
code = code.replace(/'"Playfair Display", serif'/g, `finalConfig.fonts.heading`);
code = code.replace(/"Plus Jakarta Sans", sans-serif/g, `\${finalConfig.fonts.body}`);

// Advanced Particle System Modification
// We need to pass finalConfig to FallingLeaves, but it's defined outside.
// Let's modify FallingLeaves to accept config
code = code.replace(/const FallingLeaves = \(\) => \{/, 'const FallingLeaves = ({ type, colors }: { type: string, colors: any }) => {');
code = code.replace(/<FallingLeaves \/>/g, '<FallingLeaves type={finalConfig.particleType} colors={finalConfig.colors} />');

// Modify FallingLeaves logic to support sakura, snow, sparkles
const particleLogic = `
    const getParticleConfig = (type) => {
      switch(type) {
        case 'sakura': return {
          colors: ['rgba(255, 183, 197, 0.7)', 'rgba(255, 192, 203, 0.6)', 'rgba(255, 20:147, 0.5)'],
          speedY: [0.5, 1.2], speedX: [-0.5, 0.5], size: [6, 12], shape: 'sakura'
        };
        case 'snow': return {
          colors: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.5)', 'rgba(240, 248, 255, 0.7)'],
          speedY: [0.3, 0.8], speedX: [-0.2, 0.2], size: [2, 6], shape: 'circle'
        };
        case 'sparkles': return {
          colors: [colors.primary, colors.primaryHover, 'rgba(255, 215, 0, 0.8)'],
          speedY: [-0.5, -1.5], speedX: [-0.3, 0.3], size: [1, 3], shape: 'star'
        };
        case 'raindrops': return {
          colors: ['rgba(173, 216, 230, 0.4)', 'rgba(135, 206, 235, 0.5)'],
          speedY: [4, 8], speedX: [0, 0.2], size: [1, 2], shape: 'line'
        };
        default: return { // leaves
          colors: ['rgba(212, 175, 55, 0.65)', 'rgba(205, 127, 50, 0.6)', 'rgba(184, 115, 51, 0.65)'],
          speedY: [0.5, 1.5], speedX: [-0.3, 0.3], size: [8, 15], shape: 'leaf'
        };
      }
    };
    
    const pConf = getParticleConfig(type);
    const leafColors = pConf.colors;
`;

// Replace leafColors definition inside FallingLeaves
code = code.replace(/const leafColors = \[\s*'rgba\(212, 175, 55, 0\.65\)',[\s\S]*?\];/, particleLogic);

// Replace drawLeaf with a generic draw function
code = code.replace(/const drawLeaf = \([\s\S]*?ctx\.restore\(\);\s*\};/, `
    const drawLeaf = (ctx, x, y, size, rotation, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      
      if (pConf.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (pConf.shape === 'line') {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size * 5);
        ctx.lineWidth = size;
        ctx.stroke();
      } else if (pConf.shape === 'star') {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
      } else { // leaf or sakura
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.bezierCurveTo(size / 2, -size / 2, size, 0, 0, size);
        ctx.bezierCurveTo(-size, 0, -size / 2, -size / 2, 0, -size / 2);
        ctx.fill();
      }
      ctx.restore();
    };
`);

// Add Dynamic Font Loading
const fontLoader = `
  // Inject Premium Cinematic Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    const hFont = finalConfig.fonts.heading.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
    const bFont = finalConfig.fonts.body.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
    link.href = \`https://fonts.googleapis.com/css2?family=\${hFont}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=\${bFont}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap\`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) document.head.removeChild(link);
    };
  }, [finalConfig.fonts]);
`;

code = code.replace(/\/\/ Inject Premium Cinematic Google Fonts[\s\S]*?\}\, \[\]\);/, fontLoader);

fs.writeFileSync(destPath, code);
console.log('CinematicTheme.tsx generated successfully.');
