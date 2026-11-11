// Saves a PNG of one page of the built site, to look at a change the way a visitor sees it.
// `pnpm screenshot` builds first, so the picture never comes from a stale dist/.
//
//   pnpm screenshot /blog/<slug> --phone --dark          one screen, phone width, dark mode
//   pnpm screenshot / --full                             the whole page, desktop width
//   pnpm screenshot /blog/<slug> --selector "pre"        only the first element that matches
//   pnpm screenshot / --out /tmp/home.png                choose the file (default: .screenshots/, gitignored)
//
// --origin shoots a server that is already running, such as `pnpm dev` for a dev-only prototype, instead of dist/.
// Call the script directly then, since there is nothing to build:
//   node scripts/screenshot.mjs "/blog/<slug>?variant=D" --phone --origin http://localhost:4321
import { mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { parseArgs } from 'node:util';
import { VIEWPORTS, distDir, launchChromium, root, serveDist } from './lib/serve-dist.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    phone: { type: 'boolean', default: false },
    dark: { type: 'boolean', default: false },
    full: { type: 'boolean', default: false },
    selector: { type: 'string' },
    out: { type: 'string' },
    origin: { type: 'string' },
  },
});

const route = positionals[0] ?? '/';
const viewportName = values.phone ? 'phone' : 'desktop';
const colorScheme = values.dark ? 'dark' : 'light';
const slug = route.replace(/^\/|\/$/g, '').replace(/[/?&=]+/g, '-') || 'home';
const name = `${slug}-${viewportName}-${colorScheme}.png`;
const out = values.out ?? join(root, '.screenshots', name);
mkdirSync(dirname(out), { recursive: true });

const server = values.origin ? { origin: values.origin.replace(/\/$/, ''), close() {} } : await serveDist(distDir(undefined, 'screenshot'));
const browser = await launchChromium('screenshot', server.close);
const page = await browser.newPage({ viewport: VIEWPORTS[viewportName], colorScheme });

const response = await page.goto(server.origin + route).catch((error) => {
  console.error(`screenshot: cannot open ${server.origin}${route}. Is the server running? (${error.message.split('\n')[0]})`);
});
if (!response) {
  process.exitCode = 1;
} else if (!response.ok()) {
  console.error(`screenshot: ${route} answered ${response.status()}; is it a route on ${server.origin}?`);
  process.exitCode = 1;
} else if (values.selector) {
  await page.locator(values.selector).first().screenshot({ path: out });
} else {
  await page.screenshot({ path: out, fullPage: values.full });
}

await browser.close();
server.close();
if (!process.exitCode) console.log(`screenshot: ${out.startsWith(root) ? relative(root, out) : out}`);
