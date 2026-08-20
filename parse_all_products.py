import urllib.request
from bs4 import BeautifulSoup
import json
import re

urls = [
    "https://www.ailoveyou.uk/shop/p/dont-let-go-its-here",
    "https://www.ailoveyou.uk/shop/p/man-without-a-face-unexplained",
    "https://www.ailoveyou.uk/shop/p/patience-unexplained",
    "https://www.ailoveyou.uk/shop/p/solo-unexplained",
    "https://www.ailoveyou.uk/shop/p/umbrella-unexplained",
    "https://www.ailoveyou.uk/shop/p/horizon-light-logic",
    "https://www.ailoveyou.uk/shop/p/beam-light-logic",
    "https://www.ailoveyou.uk/shop/p/prism-light-logic",
    "https://www.ailoveyou.uk/shop/p/flow-ink-reverie",
    "https://www.ailoveyou.uk/shop/p/awake-ink-reverie",
    "https://www.ailoveyou.uk/shop/p/stillpoint-ink-reverie",
    "https://www.ailoveyou.uk/shop/p/labyrinth-tessellate",
    "https://www.ailoveyou.uk/shop/p/labyrinth-cool-tessellate",
    "https://www.ailoveyou.uk/shop/p/perception-sightlines",
    "https://www.ailoveyou.uk/shop/p/vision-sightlines",
    "https://www.ailoveyou.uk/shop/p/clarity-sightlines",
    "https://www.ailoveyou.uk/shop/p/leap-carbon-line",
    "https://www.ailoveyou.uk/shop/p/study-carbon-line"
]

results = {}

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Squarespace usually puts these descriptions into accordion blocks or specific markdown blocks
            blocks = soup.find_all('div', class_='sqs-block-markdown')
            content_html = ""
            for b in blocks:
                 text = b.get_text()
                 if "Concept" in text or "Edition Statement" in text or "Paper:" in text or "Ink & Longevity" in text:
                     
                     # We want to keep the rough HTML structure (strong tags, line breaks)
                     for tag in b.find_all(['h1', 'h2', 'h3', 'h4']):
                         tag.name = 'strong'
                     
                     for p in b.find_all('p'):
                         # Replace p tags with text + double breaks
                         content_html += str(p).replace('<p>', '').replace('</p>', '<br><br>')
                         
            # If markdown block missed it, try html blocks
            if not content_html:
                blocks = soup.find_all('div', class_='sqs-block-html')
                for b in blocks:
                     text = b.get_text()
                     if "Concept" in text or "Edition Statement" in text or "Paper:" in text or "Ink & Longevity" in text:
                         for p in b.find_all(['p', 'h3', 'h4']):
                             if p.name in ['h3', 'h4']:
                                 content_html += f"<strong>{p.get_text()}</strong><br>"
                             else:
                                 content_html += f"{p.get_text()}<br><br>"
            
            slug = url.split('/')[-1]
            if content_html:
                # Cleanup trailing breaks
                content_html = re.sub(r'(<br>)+$', '', content_html)
                # Cleanup the 'by AI Love You' which might be standalone
                content_html = f"<strong>by AI Love You</strong><br><br>{content_html}"
                results[slug] = content_html
            else:
                results[slug] = "HTML NOT FOUND"
                
    except Exception as e:
        results[url.split('/')[-1]] = f"ERROR: {str(e)}"

# Save to a temp JSON file for easy inspection
with open('temp_descriptions.json', 'w') as f:
    json.dump(results, f, indent=4)
print("Finished scraping.")
