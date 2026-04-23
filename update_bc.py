import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# E.g.: <div class="top-breadcrumbs">\n            <a href="index.html">ARCHIVE</a> <span>/</span> <a href="journal.html">JOURNAL</a> <span>/</span> <a>EDITION 06</a>\n        </div>
old_journal_bc = re.compile(r'<div class="top-breadcrumbs">\s*<a href="index\.html">ARCHIVE</a> <span>/</span> <a href="journal\.html">JOURNAL</a> <span>/</span> <a>([^<]+)</a>\s*</div>', re.MULTILINE)

for f in html_files:
    if f.startswith('journal-edition-'):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        def rep_journal(match):
            name = match.group(1).upper()
            return f'<div class="top-breadcrumbs">\n            <a href="journal.html">JOURNAL</a> <span style="opacity: 0.5;">//</span> <a>{name}</a>\n        </div>'
            
        if old_journal_bc.search(content):
            content = old_journal_bc.sub(rep_journal, content)
            
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated breadcrumbs in {f}")

print("Breadcrumb fixes complete.")
