// Renders public/og.png, the 1200×630 image shown when a page is shared.
// Run with `pnpm og-image` after changing the name, Headline, Differentiators, or Domains.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../public/og.png', import.meta.url));
const font = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fcfcfb"/>
  <rect x="0" y="0" width="16" height="630" fill="#0b6b3a"/>
  <text x="96" y="250" font-family="${font}" font-size="88" font-weight="700" fill="#1d1d1b">Pedro Lizárraga</text>
  <text x="96" y="330" font-family="${font}" font-size="44" font-weight="600" fill="#1d1d1b">Senior Software Engineer | Full-Stack</text>
  <text x="96" y="400" font-family="${font}" font-size="32" fill="#5c5c57">TypeScript · Node.js · React · Angular · GraphQL</text>
  <text x="96" y="446" font-family="${font}" font-size="32" fill="#5c5c57">Healthcare on Epic FHIR · B2B commerce</text>
  <text x="96" y="492" font-family="${font}" font-size="32" fill="#5c5c57">Electronic invoicing · AI agents</text>
  <text x="96" y="560" font-family="${font}" font-size="30" font-weight="600" fill="#0b6b3a">pedrolizarraga.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(output);
console.log(`Wrote ${output}`);
