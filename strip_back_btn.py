import glob, re

for f in glob.glob('journal-edition-*.html'):
    with open(f, 'r') as file:
        content = file.read()
    
    # Target and strip the specific anchor tag
    new_content = re.sub(r'\s*<a href="journal\.html" class="sidebar-link" [^>]*>← BACK TO ARCHIVE</a>', '', content)
    
    with open(f, 'w') as file:
        file.write(new_content)

print('Stripped redundant back to archive buttons.')
