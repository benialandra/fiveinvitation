import re

with open('src/themes/WinterRomance.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'bg-\\[#f0f4f8\\]', r'bg-[#f0f4f8] dark:bg-slate-900'),
    (r'bg-white', r'bg-white dark:bg-slate-800'),
    (r'text-slate-800', r'text-slate-800 dark:text-white'),
    (r'text-slate-600', r'text-slate-600 dark:text-slate-300'),
    (r'text-slate-500', r'text-slate-500 dark:text-slate-400'),
    (r'text-slate-700', r'text-slate-700 dark:text-slate-200'),
    (r'bg-slate-50(?![0-9])', r'bg-slate-50 dark:bg-slate-800'),
    (r'border-slate-100', r'border-slate-100 dark:border-slate-700'),
    (r'border-slate-200', r'border-slate-200 dark:border-slate-700'),
    (r'bg-\\[#f8fafd\\]', r'bg-[#f8fafd] dark:bg-slate-900'),
    (r'text-slate-400(?! dark)', r'text-slate-400 dark:text-slate-400')
]

if 'dark:bg-slate-900' not in content:
    for p, r in replacements:
        content = re.sub(p, r, content)
    with open('src/themes/WinterRomance.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced")
else:
    print("Already done")
