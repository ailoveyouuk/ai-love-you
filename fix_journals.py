import glob
import re

files = glob.glob('journal-edition-*.html')

logo_html = """            <a href="index.html" class="sidebar-logo-link" style="display: block; transition: opacity 0.3s; opacity: 0.8; margin-bottom: 2.5rem;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
                <img src="assets/Logo%20Signature%20fill.svg" alt="AILY Signature" style="width: 100px; filter: invert(49%) sepia(86%) saturate(2971%) hue-rotate(347deg) brightness(98%) contrast(93%);">
            </a>"""

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add logo to journal-sidebar if not there
    if 'class="sidebar-logo-link"' not in content:
        # insert right before <nav class="sticky-nav-sidebar">
        content = content.replace('<nav class="sticky-nav-sidebar">', logo_html + '\n            <nav class="sticky-nav-sidebar">')

    # 2. Extract top-breadcrumbs and move to journal-content as sticky-breadcrumb-header
    bc_match = re.search(r'<!-- Top Breadcrumbs -->\s*<div class="top-breadcrumbs">(.*?)</div>', content, re.DOTALL)
    if bc_match:
        bc_content = bc_match.group(1).strip()
        # Remove old one
        content = re.sub(r'<!-- Top Breadcrumbs -->\s*<div class="top-breadcrumbs">.*?</div>', '', content, flags=re.DOTALL)
        
        new_header = f"""
        <header class="sticky-breadcrumb-header">
            <div class="top-breadcrumbs" style="position: relative; padding: 0; border: none; top: auto; background: transparent;">
                {bc_content}
            </div>
        </header>"""
        # Inject at the very beginning of <main class="journal-content">
        # Sometimes it's <main class="journal-content" id="v2-test"> or similar
        content = re.sub(r'(<main[^>]*class="journal-content"[^>]*>)', r'\1' + new_header, content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Fixed {len(files)} journal files.")
