import glob
import re

files = glob.glob("journal-edition-*.html")
files.sort()

# Extract titles and dates
editions = {}
for file in files:
    with open(file, "r") as f:
        html = f.read()
    
    # Title
    match = re.search(r"<title>(.*?)</title>", html)
    if match:
        full_title = match.group(1).split("—")[0].strip()
        num_match = re.search(r"Edition (\d+):\s*(.*)", full_title)
        if num_match:
            num = int(num_match.group(1))
            title = num_match.group(2).strip()
        else:
            continue
    else:
        continue
        
    # Date
    date_match = re.search(r"Published:\s*([^<]+)", html)
    pub_date = date_match.group(1).strip() if date_match else "April 2026"
    
    editions[num] = {"file": file, "title": title, "date": pub_date}

# Update CSS
with open("index.css", "r") as f:
    css = f.read()

new_css = """
/* Edition Navigation Footer */
.edition-nav-footer {
    margin-top: 6rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
.edition-nav-footer .nav-next,
.edition-nav-footer .nav-prev {
    display: flex;
    flex-direction: column;
}
/* Desktop: Next on left, Prev on right */
.edition-nav-footer .nav-next {
    align-items: flex-start;
    text-align: left;
}
.edition-nav-footer .nav-prev {
    align-items: flex-end;
    text-align: right;
}
.edition-nav-footer .nav-label {
    font-family: var(--font-display);
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink-gray);
    margin-bottom: 0.5rem;
}
.edition-nav-footer .nav-link {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--text-color);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 0.3s ease, border-color 0.3s ease, padding 0.3s ease;
    margin-bottom: 0.3rem;
}
.edition-nav-footer .nav-next .nav-link {
    border-left: 2px solid transparent;
    padding-left: 0;
}
.edition-nav-footer .nav-next .nav-link:hover {
    color: var(--accent-color);
    border-left: 2px solid var(--accent-color);
    padding-left: 12px;
}
.edition-nav-footer .nav-prev .nav-link {
    border-right: 2px solid transparent;
    padding-right: 0;
}
.edition-nav-footer .nav-prev .nav-link:hover {
    color: var(--accent-color);
    border-right: 2px solid var(--accent-color);
    padding-right: 12px;
}
.edition-nav-footer .nav-date {
    font-family: var(--font-display);
    font-size: 0.65rem;
    color: var(--ink-gray);
    letter-spacing: 0.05em;
    text-transform: uppercase;
}
@media (max-width: 768px) {
    .edition-nav-footer {
        flex-direction: column;
        gap: 3rem;
    }
    .edition-nav-footer .nav-next {
        width: 100%;
        align-items: flex-end;
        text-align: right;
    }
    .edition-nav-footer .nav-next .nav-link {
        border-left: none;
        border-right: 2px solid transparent;
        padding-left: 0;
        padding-right: 0;
    }
    .edition-nav-footer .nav-next .nav-link:hover {
        border-left: none;
        border-right: 2px solid var(--accent-color);
        padding-left: 0;
        padding-right: 12px;
    }
    
    .edition-nav-footer .nav-prev {
        width: 100%;
        align-items: flex-start;
        text-align: left;
    }
    .edition-nav-footer .nav-prev .nav-link {
        border-right: none;
        border-left: 2px solid transparent;
        padding-right: 0;
        padding-left: 0;
    }
    .edition-nav-footer .nav-prev .nav-link:hover {
        border-right: none;
        border-left: 2px solid var(--accent-color);
        padding-right: 0;
        padding-left: 12px;
    }
}
"""

if "/* Edition Navigation Footer */" in css:
    css = css.split("/* Edition Navigation Footer */")[0] + new_css
else:
    css += "\n" + new_css

with open("index.css", "w") as f:
    f.write(css)

# Update HTML files
for num in sorted(editions.keys()):
    current_file = editions[num]["file"]
    
    prev_num = num - 1
    next_num = num + 1
    
    prev_html = ""
    if prev_num in editions:
        prev_data = editions[prev_num]
        prev_html = f"""        <div class="nav-prev">
            <span class="nav-label">PREVIOUS EDITION</span>
            <a href="{prev_data["file"]}" class="nav-link">EDITION {prev_num:02d} // {prev_data["title"]}</a>
            <span class="nav-date">{prev_data["date"]}</span>
        </div>"""
    else:
        prev_html = """        <div class="nav-prev"></div>"""

    next_html = ""
    if next_num in editions:
        next_data = editions[next_num]
        next_html = f"""        <div class="nav-next">
            <span class="nav-label">NEXT EDITION</span>
            <a href="{next_data["file"]}" class="nav-link">EDITION {next_num:02d} // {next_data["title"]}</a>
            <span class="nav-date">{next_data["date"]}</span>
        </div>"""
    else:
        next_html = """        <div class="nav-next"></div>"""
        
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
        gf_start = html.find('id="shortlist"')
    
    if gf_start == -1:
        print(f"Skipping {current_file}: could not find global-five or shortlist section")
        continue
        
    gf_end = html.find('</section>', gf_start)
    if gf_end == -1:
        continue
    end_of_section = gf_end + len('</section>')
    
    # Replace from end_of_section to </main>
    main_end = html.find('</main>', end_of_section)
    if main_end == -1:
        continue
        
    new_html = html[:end_of_section] + "\n            " + nav_block + "\n        " + html[main_end:]
    
    with open(current_file, "w") as f:
        f.write(new_html)

print("Updated HTML and CSS.")
