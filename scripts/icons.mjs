// Renders public/favicon.ico and public/apple-touch-icon.png from public/favicon.svg,
// for browsers, feed readers and link previews that ask for those files by default.
// Run with `pnpm icons` after changing public/favicon.svg.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const publicDir = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
const svg = await readFile(publicDir('favicon.svg'), 'utf8');

// favicon.ico: one 32×32 PNG inside an ICO container (ICONDIR + one ICONDIRENTRY).
const png = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette size
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // image size
header.writeUInt32LE(header.length, 18); // image offset
await writeFile(publicDir('favicon.ico'), Buffer.concat([header, png]));

// apple-touch-icon.png: 180×180 with square corners, because iOS rounds them itself
// and fills transparent corners with black.
const square = svg.replace(/\s+rx="[^"]*"/, '');
await sharp(Buffer.from(square)).resize(180, 180).png().toFile(publicDir('apple-touch-icon.png'));

console.log('Wrote public/favicon.ico and public/apple-touch-icon.png');
