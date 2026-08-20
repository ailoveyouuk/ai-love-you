import urllib.request
from bs4 import BeautifulSoup

url = "https://www.ailoveyou.uk/shop/p/diner-cinematography"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        soup = BeautifulSoup(content, 'html.parser')
        
        excerpt = soup.find('div', class_='ProductItem-details-excerpt')
        if excerpt:
            print(excerpt.decode_contents())
        else:
            print("Excerpt inner contents not found.")
except Exception as e:
    print(f"Error: {e}")
