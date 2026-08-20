import glob
import re

files = glob.glob('journal-edition-*.html')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract edition number from filename
    edition_num = re.search(r'journal-edition-(\d+)\.html', file).group(1)
    
    # If the sticky header isn't there, inject it
    if 'class="sticky-breadcrumb-header"' not in content:
        bc_html = f"""
        <header class="sticky-breadcrumb-header" style="z-index: 100;">
            <nav class="pdp-breadcrumbs" style="display: flex; gap: 0.5rem; color: var(--ink-gray); font-family: var(--font-display); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
                <a href="journal.html" style="color: inherit; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.6'" onmouseout="this.style.opacity='1'">JOURNAL</a> <span style="opacity: 0.5;">//</span> 
                <span style="color: var(--text-color); opacity: 0.8;">EDITION {edition_num}</span>
            </nav>
        </header>"""
        
        # Inject right inside <article class="journal-content">
        # Or before <header class="edition-header">
        content = re.sub(r'(<header class="edition-header">)', bc_html + r'\n            \1', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Fixed breadcrumbs for {len(files)} journal files.")
