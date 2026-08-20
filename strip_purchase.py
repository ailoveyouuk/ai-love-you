import re

with open('product.html', 'r') as f:
    html = f.read()

# Remove the <div class="pdp-content-right"> completely
html = re.sub(r'<div class="pdp-content-right".*?</div>\s*</div>', '', html, flags=re.DOTALL)

with open('product.html', 'w') as f:
    f.write(html)

print("Removed pdp-content-right.")
