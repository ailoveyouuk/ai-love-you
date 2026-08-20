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
- **Tool Command:**
  ```bash
  afconvert -f mp4f -d aac -b 128000 input.m4a output.m4a
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

---
*Last Updated: April 2026*
