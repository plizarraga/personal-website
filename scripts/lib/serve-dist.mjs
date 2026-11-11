// Serves the built site in `dist/` and opens it in headless Chromium, for the scripts that look at real pages
// (check-a11y.mjs, screenshot.mjs).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, relative, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

export const root = new URL('../..', import.meta.url).pathname;

/** The widths every visual check runs at. */
export const VIEWPORTS = { desktop: { width: 1280, height: 800 }, phone: { width: 390, height: 844 } };
export const COLOR_SCHEMES = ['light', 'dark'];

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

/** Resolves the dist folder (relative to the repo root) and exits with a hint when it was never built. */
export function distDir(name, script) {
  const dist = resolve(root, name ?? 'dist');
  if (!existsSync(dist)) {
    console.error(`${script}: ${dist} does not exist. Run \`astro build\` first.`);
    process.exit(1);
  }
  return dist;
}

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

/** One route per built page: `experience.html` is served at `/experience` (`build.format: 'file'`). */
export function routesOf(dist) {
  return files(dist)
    .filter((path) => path.endsWith('.html'))
    .map((path) => '/' + relative(dist, path).split(sep).join('/').replace(/\.html$/, '').replace(/(^|\/)index$/, ''))
    .sort();
}

/** Serves dist/ the way Cloudflare does (`/experience` falls back to `experience.html`) on a free local port. */
export async function serveDist(dist) {
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
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

/** Launches headless Chromium, or exits with the install command when it is missing. */
export async function launchChromium(script, onFail) {
  try {
    return await chromium.launch();
  } catch (error) {
    onFail?.();
    console.error(`${script}: Chromium is missing. Install it once with \`pnpm exec playwright install --only-shell chromium\`.`);
    console.error(String(error).split('\n')[0]);
    process.exit(1);
  }
}
