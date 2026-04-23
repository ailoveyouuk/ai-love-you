import glob, re

for f in glob.glob('journal-edition-*.html'):
    with open(f, 'r') as file:
        content = file.read()
    
    # Strip the inline scroll spy logic
    new_content = re.sub(r'<script>\s*// Scroll Spy Logic.*?</script>', '', content, flags=re.DOTALL)
    
    with open(f, 'w') as file:
        file.write(new_content)

print('Stripped localized scripts.')
