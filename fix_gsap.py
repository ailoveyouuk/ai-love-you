import glob

gsap_scripts = """    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
"""

for f in glob.glob('journal-edition-*.html'):
    with open(f, 'r') as file:
        c = file.read()
    
    if "gsap.min.js" not in c:
        c = c.replace('<script src="script.js"></script>', gsap_scripts + '    <script src="script.js"></script>')
        with open(f, 'w') as file:
            file.write(c)

print('Injected GSAP successfully.')
