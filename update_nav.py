import glob
import re
import os

html_files = glob.glob('*.html')
html_files.remove('index.html')

logo_html = """                <a href="index.html" class="sidebar-logo-link" style="display: block; transition: opacity 0.3s; opacity: 0.8; margin-bottom: 2.5rem;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
                    <img src="assets/Logo%20Signature%20fill.svg" alt="AILY Signature" style="width: 100px; filter: invert(49%) sepia(86%) saturate(2971%) hue-rotate(347deg) brightness(98%) contrast(93%);">
                </a>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove it from sidebar-footer safely
    # We will regex match the anchor block that contains 'assets/Logo%20Signature%20fill.svg' inside sidebar-footer if possible
    # Actually, the user says "doesn't show the AI Love You logo". Was it even there on these pages?
    # Some pages might not have it. Let's just remove any <a href="index.html" class="sidebar-logo-link"... block anywhere.
    
    # 2. But we must be careful not to remove other anchors. 
    # The block is exactly:
    pattern_remove = re.compile(r'<a href="index\.html"[^>]*class="sidebar-logo-link"[^>]*>.*?</a>', re.DOTALL)
    content = pattern_remove.sub('', content)

    # 3. Add it to the top. Look for <div class="sidebar-top"> or <nav class="studio-sidebar-nav">
    # If the file has <aside class="studio-sidebar">, we inject the logo before the first <nav class="studio-sidebar-nav">
    
    if '<nav class="studio-sidebar-nav">' in content:
        content = content.replace('<nav class="studio-sidebar-nav">', logo_html + '\n                <nav class="studio-sidebar-nav">')
    
    # Clean up empty sidebar-footer
    content = re.sub(r'<div class="sidebar-footer">\s*</div>', '<div class="sidebar-footer"></div>', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated HTML files.")
