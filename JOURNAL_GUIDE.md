# AI Love You: Journal Hub Publishing Guide

This document outlines the standard operating procedure for creating and publishing new journal entries, articles, or volumes (like "The AILY Edit") on the AI Love You website.

## 1. Duplication & File Structure
Every new journal entry should be a duplicate of the master template: `aily-edit-01.html`. 
1. Copy `aily-edit-01.html`.
2. Rename the new file to your entry title, for example: `brutalist-shadows.html`.
3. Save it in the root directory alongside `journal.html`.

## 2. Updating Meta & Header Information
Open your newly created file and update the following:
- **Title Tag:** `<title>Brutalist Shadows in Modern Cinema — AI Love You</title>`
- **Hero Image:** Update the `<img src="aily-edit-01-hero.png">` to point to a new hero image (e.g., `<img src="brutalist_cinema_hero.png">`). *All hero images should ideally be styled as cinematic, wide aspect ratio 16:9 shots to maintain the brutalist/sci-fi aesthetic.*
- **Header Title:** Update `<h1>THE AILY EDIT / VOL. 01</h1>` to your new title.
- **Article Tags:** Update the date and relevant tags in the `<div class="article-tags">` block.

## 3. Formatting the Content Body
The master template uses specific semantic structures. You can pick and choose which modules you need for your entry:
- **Editor's Foreword (`<section class="editors-foreword">`):** Use for introductory blurbs or an overview of the volume.
- **Pull Quotes (`<blockquote class="pull-quote">`):** Use for prominent, large typographic quotes. Include a `<span>` for the citation.
- **Integrated Body Text (`<section class="about-layout">`):** Use standard `<h2>` and `<p>` tags for the main text. 
- **Reference Links:** To add an inline citation, use `<a href="..." class="reference-link" target="_blank">[1]</a>`.
- **The Global Shortlist Component:** If this is a volume of The AILY Edit, update the 5 cities in the `<section class="shortlist-section">`. If this is a standard article, you can delete this section.

## 4. Adding the Article to the Journal Feed
Once your page is complete, you must add it to the feed in `journal.html` so users can find it and filter by tags.

1. Open `journal.html`.
2. Locate the `<section class="journal-grid" id="journal-feed">` block.
3. Copy an existing piece of the feed (either the live "AILY Edit Vol. 01" or create a new block).
4. Update the outer `<a>` or `<div>` tag attributes:
   - `href="brutalist-shadows.html"`
   - `data-tags="design, film"` (Must exactly match the `data-filter` names used in the filter buttons: `design`, `architecture`, `fabrication`, or `film`).
   - `data-title="brutalist shadows in modern cinema"` (Must be entirely lowercase for the search engine to match it).
5. Ensure the inner visual tags (e.g., `<span>#Design</span><span>#Film</span>`) match your `data-tags` to display correctly to users.

---

*Note: For dynamic or external content linking, refer to the global `script.js` which handles the nav animation and filtering logic.*
