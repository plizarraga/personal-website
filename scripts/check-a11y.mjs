// Runs axe-core on every page of the built site in `dist/`, in light and dark mode, at desktop and phone widths.
// Fails on any WCAG 2.2 level A or AA violation, color contrast included.
// Run after `astro build`: `node scripts/check-a11y.mjs [distDir]`. Exits 1 when any check fails.
// Needs Chromium once per machine: `pnpm exec playwright install --only-shell chromium`.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, relative, resolve, sep } from 'node:path';
import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright';

const root = new URL('..', import.meta.url).pathname;
const dist = resolve(root, process.argv[2] ?? 'dist');

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const VIEWPORTS = { desktop: { width: 1280, height: 800 }, phone: { width: 390, height: 844 } };
const COLOR_SCHEMES = ['light', 'dark'];
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

if (!existsSync(dist)) {
  console.error(`check-a11y: ${dist} does not exist. Run \`astro build\` first.`);
  process.exit(1);
}

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

// One route per built page: `experience.html` is served at `/experience` (`build.format: 'file'`).
const routes = files(dist)
  .filter((path) => path.endsWith('.html'))
  .map((path) => '/' + relative(dist, path).split(sep).join('/').replace(/\.html$/, '').replace(/(^|\/)index$/, ''))
  .sort();

// Serves dist/ the way Cloudflare does: `/experience` falls back to `experience.html`.
const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  for (const candidate of [path, `${path}.html`, join(path, 'index.html')]) {
    const file = join(dist, candidate);
    if (file.startsWith(dist) && existsSync(file) && statSync(file).isFile()) {
      response.writeHead(200, { 'content-type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream' });
      response.end(readFileSync(file));
      return;
    }
  }
  response.writeHead(404).end();
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  server.close();
  console.error('check-a11y: Chromium is missing. Install it once with `pnpm exec playwright install --only-shell chromium`.');
  console.error(String(error).split('\n')[0]);
  process.exit(1);
}

const failures = [];
for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  for (const colorScheme of COLOR_SCHEMES) {
    const context = await browser.newContext({ viewport, colorScheme });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(origin + route);
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      for (const violation of violations) {
        const targets = violation.nodes.map((node) => node.target.join(' ')).join(', ');
        failures.push(`${route} (${viewportName}, ${colorScheme}): ${violation.id}: ${violation.help}. Elements: ${targets}`);
      }
    }
    await context.close();
  }
}

await browser.close();
server.close();

const runs = routes.length * Object.keys(VIEWPORTS).length * COLOR_SCHEMES.length;
if (failures.length > 0) {
  console.error(`check-a11y: ${failures.length} violation(s) in ${runs} page checks:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`check-a11y: ${routes.length} pages OK in light and dark mode, desktop and phone (${runs} checks)`);
