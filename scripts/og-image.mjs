// Renders public/og.png, the 1200×630 image shown when a page is shared and as the search result thumbnail.
// Run with `pnpm og-image` after changing the name, Headline, or photo.
// og-photo.jpg is the LinkedIn profile photo cropped to head and shoulders, at twice the panel size.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../public/og.png', import.meta.url));
const photo = fileURLToPath(new URL('og-photo.jpg', import.meta.url));
const font = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";

/** Width of the photo panel on the right edge. The text sits large on the left so it stays legible as a thumbnail. */
const PANEL = 440;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fcfcfb"/>
  <rect x="0" y="0" width="16" height="630" fill="#0b6b3a"/>
  <text x="80" y="230" font-family="${font}" font-size="104" font-weight="700" fill="#1d1d1b">Pedro</text>
  <text x="80" y="340" font-family="${font}" font-size="104" font-weight="700" fill="#1d1d1b">Lizárraga</text>
  <text x="80" y="420" font-family="${font}" font-size="34" font-weight="600" fill="#1d1d1b">Senior Software Engineer | Full-Stack</text>
  <text x="80" y="530" font-family="${font}" font-size="34" font-weight="600" fill="#0b6b3a">pedrolizarraga.com</text>
</svg>`;

const portrait = await sharp(photo).resize(PANEL, 630, { fit: 'cover', position: 'top' }).toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: portrait, left: 1200 - PANEL, top: 0 }])
  .png({ palette: true, quality: 90 })
  .toFile(output);
console.log(`Wrote ${output}`);
