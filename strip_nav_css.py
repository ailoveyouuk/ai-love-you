import glob, re

for f in glob.glob('journal-edition-*.html'):
    with open(f, 'r') as file:
        content = file.read()
    
    # We will just strip everything between .nav-list { and /* Content Area */
    new_content = re.sub(r'\.nav-list \{.*?(?=\/\* Content Area \*\/)', '', content, flags=re.DOTALL)
    
    with open(f, 'w') as file:
        file.write(new_content)

print('Stripped localized nav CSS.')
