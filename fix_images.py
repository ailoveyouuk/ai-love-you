import os

files = [
    'journal-edition-08.html',
    'journal.html',
    'assets/journals/journalData.js'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # We want to be careful and only replace the ones belonging to edition-08
    content = content.replace('assets/journals/edition-08/sardinia.webp', 'assets/journals/edition-08/sardinia.jpg')
    content = content.replace('assets/journals/edition-08/sevenpines.webp', 'assets/journals/edition-08/sevenpines.jpg')
    content = content.replace('assets/journals/edition-08/ducati.webp', 'assets/journals/edition-08/ducati.jpg')
    content = content.replace('assets/journals/edition-08/ducati-front.webp', 'assets/journals/edition-08/ducati-front.jpg')
    content = content.replace('assets/journals/edition-08/michelin.webp', 'assets/journals/edition-08/michelin.jpg')
    content = content.replace('assets/journals/edition-08/calong.webp', 'assets/journals/edition-08/calong.jpg')
    content = content.replace('assets/journals/edition-08/kinyobi.webp', 'assets/journals/edition-08/kinyobi.jpg')
    content = content.replace('assets/journals/edition-08/watches-and-wonders.webp', 'assets/journals/edition-08/watches-and-wonders.jpg')
    content = content.replace('assets/journals/edition-08/moser.webp', 'assets/journals/edition-08/moser.jpg')
    content = content.replace('assets/journals/edition-08/macbook-neo.webp', 'assets/journals/edition-08/macbook-neo.jpg')
    content = content.replace('assets/journals/edition-08/plaud.webp', 'assets/journals/edition-08/plaud.jpg')
    content = content.replace('assets/journals/edition-08/handycam.webp', 'assets/journals/edition-08/handycam.jpg')
    content = content.replace('assets/journals/edition-08/nhu-xuan.webp', 'assets/journals/edition-08/nhu-xuan.jpg')
    content = content.replace('assets/journals/edition-08/torino.webp', 'assets/journals/edition-08/torino.jpg')
    content = content.replace('assets/journals/edition-08/nat-faulkner.webp', 'assets/journals/edition-08/nat-faulkner.jpg')
    
    with open(file, 'w') as f:
        f.write(content)

print("Replaced .webp with .jpg successfully.")
