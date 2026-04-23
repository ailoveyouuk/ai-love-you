const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldFooter = /<div class="sidebar-footer">\s*<img src="assets\/Logo%20Signature%20fill\.svg"[^>]*>\s*<\/div>/g;
const newFooter = `<div class="sidebar-footer">
                <a href="index.html" class="sidebar-logo-link" style="display: inline-block; transition: opacity 0.3s;">
                    <img src="assets/Logo%20Signature%20fill.svg" alt="AILY Signature" style="width: 100px; filter: invert(49%) sepia(86%) saturate(2971%) hue-rotate(347deg) brightness(98%) contrast(93%);">
                </a>
            </div>`;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (oldFooter.test(content)) {
        content = content.replace(oldFooter, newFooter);
        fs.writeFileSync(f, content);
        console.log('Updated logo in', f);
    }
});
