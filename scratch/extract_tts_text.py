from bs4 import BeautifulSoup
import os

html_path = "/Users/lewismckinnon/Library/CloudStorage/GoogleDrive-mckinnonla@gmail.com/My Drive/AI Love You/Antigravity/Website Development/journal-edition-07.html"

with open(html_path, 'r') as f:
    soup = BeautifulSoup(f, 'html.parser')

content = []

# Title
content.append(soup.find('h1').get_text(strip=True))

# Sections
sections = soup.find_all('section')
for section in sections:
    # Dept label
    dept = section.find('span', class_='dept-label')
    if dept:
        content.append(dept.get_text(strip=True))
    
    # Section title
    title = section.find('h2', class_='section-title')
    if title:
        content.append(title.get_text(strip=True))
    
    # Lead text
    lead = section.find('p', class_='lead-text')
    if lead:
        content.append(lead.get_text(strip=True))
    
    # Body text
    body = section.find('div', class_='body-text')
    if body:
        content.append(body.get_text())

full_text = "\n\n".join(content)

output_path = "/Users/lewismckinnon/Library/CloudStorage/GoogleDrive-mckinnonla@gmail.com/My Drive/AI Love You/Antigravity/Website Development/assets/audio/edition-07-text.txt"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w') as f:
    f.write(full_text)

print(f"Extracted text to {output_path}")
