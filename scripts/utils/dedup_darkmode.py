import re

with open('src/themes/WinterRomance.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find any repeated dark classes like 'dark:text-slate-400 dark:text-slate-400'
content = re.sub(r'(dark:[^\s]+)\s+\1', r'\1', content)
content = re.sub(r'(dark:[^\s]+)\s+\1', r'\1', content) # run twice for triples

with open('src/themes/WinterRomance.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Deduplicated")
