import os
import re

html_dir = './'

NAV_REPLACEMENT = """    <!-- Mobile Navigation Fixed Top Bar -->
    <nav class="studio-nav">
        <a href="index.html" class="nav-brand-mobile">
            <img src="assets/Logo%20Signature%20fill.svg" alt="AILY Logo">
        </a>
        <div class="nav-actions-mobile">
            <a href="cart.html" class="bag-icon-trigger" aria-label="View Bag" style="color: var(--text-color); position: relative;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span class="bag-count-badge">0</span>
            </a>
            <button class="menu-toggle" aria-label="Toggle Menu">
                <span></span>
                <span></span>
            </button>
        </div>
        
        <!-- Full Screen Mobile Overlay -->
        <div class="nav-links">
            <a href="shop.html">Store</a>
            <a href="journal.html">Journal</a>
            <a href="about.html">About</a>
        </div>
    </nav>

"""

def update_html_files():
    for filename in os.listdir(html_dir):
        if not filename.endswith('.html'):
            continue

        filepath = os.path.join(html_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # Step 1: Remove existing studio-nav block if present
        # We look for <nav class="studio-nav"... and everything inside until </nav>
        nav_pattern_start = re.compile(r'<!-- Mobile Navigation Toggle \(Top Right\) -->\s*<nav class="studio-nav".*?</nav>', re.DOTALL)
        content = nav_pattern_start.sub('', content)
        
        # Also handle cases where the comment is missing
        nav_pattern_no_comment = re.compile(r'<nav class="studio-nav".*?</nav>\s*', re.DOTALL)
        content = nav_pattern_no_comment.sub('', content)

        # Step 2: Inject new nav block right before <main>
        # Find <main ...> and insert the NAV_REPLACEMENT just before it
        main_pattern = re.compile(r'(<main\s)')
        # Only replace if <main is found
        if main_pattern.search(content):
            # To ensure we don't mess up spacing too much, we insert it before the match.
            parts = main_pattern.split(content, 1)
            new_content = parts[0] + NAV_REPLACEMENT + parts[1] + parts[2]
            
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"Skipped {filename} (no <main> found)")

if __name__ == '__main__':
    update_html_files()
