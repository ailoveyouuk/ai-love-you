import glob
import re

files = glob.glob("journal-edition-*.html")
files.sort()

# Extract titles
titles = {}
for file in files:
    with open(file, "r") as f:
        html = f.read()
    match = re.search(r'<title>(.*?)</title>', html)
    if match:
        title = match.group(1).split('—')[0].strip()
        # example: "Edition 01: The Aesthetic Convergence"
        num_match = re.search(r'Edition (\d+)', title)
        if num_match:
            num = int(num_match.group(1))
            titles[num] = (file, title)

for num in sorted(titles.keys()):
    current_file, current_title = titles[num]
    
    prev_num = num - 1
    next_num = num + 1
    
    prev_html = ""
    if prev_num in titles:
        prev_file, prev_title = titles[prev_num]
        prev_html = f"""
        <div class="nav-prev">
            <span class="nav-label">PREVIOUS EDITION</span>
            <a href="{prev_file}" class="nav-link">{prev_title}</a>
        </div>"""
    else:
        prev_html = """
        <div class="nav-prev">
        </div>"""

    next_html = ""
    if next_num in titles:
        next_file, next_title = titles[next_num]
        next_html = f"""
        <div class="nav-next">
            <span class="nav-label">NEXT EDITION</span>
            <a href="{next_file}" class="nav-link">{next_title}</a>
        </div>"""
    else:
        next_html = """
        <div class="nav-next">
        </div>"""
        
    nav_block = f"""</article>

            <div class="edition-nav-footer">
                {next_html}
                {prev_html}
            </div>"""

    with open(current_file, "r") as f:
        html = f.read()

    # Find the end of global-five section
    gf_start = html.find('id="global-five"')
    if gf_start == -1:
        continue
    gf_end = html.find('</section>', gf_start)
    if gf_end == -1:
        continue
    end_of_section = gf_end + len('</section>')
    
    # We want to keep everything up to end_of_section (which is </section>).
    # Then we replace everything from end_of_section up to </main> with nav_block
    main_end = html.find('</main>', end_of_section)
    
    new_html = html[:end_of_section] + "\n            " + nav_block + "\n        " + html[main_end:]
    
    with open(current_file, "w") as f:
        f.write(new_html)

print("Navigation fixed for all files.")
