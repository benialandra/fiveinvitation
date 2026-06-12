const fs = require('fs');
let content = fs.readFileSync('src/themes/WinterRomance.tsx', 'utf8');

const replacements = [
  { p: /bg-\\[#f0f4f8\\]/g, r: 'bg-[#f0f4f8] dark:bg-slate-900' },
  { p: /bg-white/g, r: 'bg-white dark:bg-slate-800' },
  { p: /text-slate-800/g, r: 'text-slate-800 dark:text-white' },
  { p: /text-slate-600/g, r: 'text-slate-600 dark:text-slate-300' },
  { p: /text-slate-500/g, r: 'text-slate-500 dark:text-slate-400' },
  { p: /text-slate-700/g, r: 'text-slate-700 dark:text-slate-200' },
  { p: /bg-slate-50(?!0)/g, r: 'bg-slate-50 dark:bg-slate-800' },
  { p: /border-slate-100/g, r: 'border-slate-100 dark:border-slate-700' },
  { p: /border-slate-200/g, r: 'border-slate-200 dark:border-slate-700' },
  { p: /bg-\\[#f8fafd\\]/g, r: 'bg-[#f8fafd] dark:bg-slate-900' },
  { p: /text-slate-400(?! dark)/g, r: 'text-slate-400 dark:text-slate-400' }
];

if (!content.includes('dark:bg-slate-900')) {
  replacements.forEach(({p, r}) => {
    content = content.replace(p, r);
  });
  fs.writeFileSync('src/themes/WinterRomance.tsx', content);
  console.log('Success');
} else {
  console.log('Already added');
}
