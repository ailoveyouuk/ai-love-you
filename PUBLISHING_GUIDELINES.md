# AI Love You // Publishing Guidelines

To maintain the premium editorial experience and high-performance standards of the site, all new content must adhere to the following specifications before publishing.

## 1. Imagery (WebP Standard)
All editorial images must be converted to WebP to ensure fast loading times and high visual fidelity.
- **Format:** `.webp`
- **Max Dimension:** 1600px (Width or Height).
- **Quality:** 75% (Standard for high-end editorial).
- **Tool Command:** 
  ```bash
  cwebp -q 75 input.jpg -o output.webp
  ```

## 2. Audio (Optimized Bitrate)
Audio files must be optimized for web streaming to prevent large repository sizes and slow buffering.
- **Format:** `.m4a` (AAC)
- **Bitrate:** 128kbps Stereo.
- **Tool Command:** `afconvert` is not reliably available — use `ffmpeg` instead:
  ```bash
  ffmpeg -y -i input.m4a -c:a aac -b:a 128k -ac 2 -ar 44100 output.m4a
  ```

## 3. Journal Navigation
Every individual journal edition page must include the standardized navigation footer immediately following the "Global Five" (or "Shortlist") section.
- **Left Justified:** Link to the NEXT edition (if available).
- **Right Justified:** Link to the PREVIOUS edition (if available).
- **Style:** Orange font and orange border-line on hover.

## 4. Homepage Updates
When a new edition is published:
- The **Hero Section** of `index.html` must be updated to feature the new edition's title, subtitle, and audio link.
- The **Journal Grid** on the homepage and `journal.html` must be updated to include the new edition card.

## 5. Pull Quotes (Standard for All Editions)
Every edition should feature 2–3 print-style pull quotes, pulled from strong, genuinely attributed quotes already present in the body copy (a named person or organisation, in quotation marks — not a paraphrase or an unattributed scare-quote fragment). Skip a department entirely rather than inventing or forcing a weak attribution.
- Place the block immediately after the closing `</p>` of the paragraph containing the quoted sentence.
- Markup:
  ```html
  <div class="pull-quote">
  <blockquote>"The quoted sentence, trimmed to its strongest single line."</blockquote>
  <cite>Full Name, Title/Publication</cite>
  </div>
  ```
- Spread the 2–3 quotes across different departments within the edition rather than clustering them in one section.
- Styling lives in `index.css` under `.pull-quote`.

## 6. SEO Metadata
Every page (homepage, About, Contact, Support, and every journal edition) must include, in the `<head>`:
- `<meta name="description">` — a unique, page-specific summary (~150–250 characters).
- `<link rel="canonical">` pointing to the page's live URL.
- Open Graph tags: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:image` (absolute URL), `og:url`.
- Twitter Card tags: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.
- `og:type` is `website` for the homepage/About/Contact/Support and `article` for journal editions.
- For a journal edition, `og:image`/`twitter:image` should point at the edition's own hero image.

## 7. journalData.js Structure (Search & Department Filtering)
Every edition must be represented in `assets/journals/journalData.js` as **one entry per department**, not a single whole-edition entry — a single entry means the edition never appears when a reader filters by department (Movies, Vehicles, etc.) or in the homepage period dropdown.
- One object per department section in the edition, using the same `category` slugs as the homepage filter buttons (`movies`, `music`, `products`, `design`, `architecture`, `style`, `travel`, `vehicles`, `food-drink`, `watches`, `technology`, `art-photography`).
- Required fields per entry: `id` (e.g. `ed15-movies`), `category`, `title`, `subtitle`, `duration`, `image`, `link` (`journal-edition-XX.html#section-id`), `edition` (`"Edition XX"`), **`publishDate`** (not `published` — this is the field the homepage period dropdown and search actually read, e.g. `"20 August 2026"`), `keywords`, `audioSrc`.
- Also add five `category: "global-five"` entries (one per curated event), using the same `publishDate` as the edition's other entries.
- See Editions 08–14 in `journalData.js` for the current reference pattern.

## 8. Global Five — Event Currency
The Global Five section should list real, dated, near-future events **relative to the edition's own publish date** — not events that predate it. If an edition's publish date is later revised, its Global Five section and works-cited list must be revised to match.

---
*Last Updated: August 2026*
