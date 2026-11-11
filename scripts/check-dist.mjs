// Checks the built site in `dist/` for the things that silently break search and LLM discovery.
// Run after `astro build`: `node scripts/check-dist.mjs [distDir]`. Exits 1 when any check fails.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = resolve(root, process.argv[2] ?? 'dist');

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;
const MAX_KEYWORD = 30;

const failures = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);

const read = (path) => readFileSync(path, 'utf8');
const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

if (!existsSync(dist)) {
  console.error(`check-dist: ${dist} does not exist. Run \`astro build\` first.`);
  process.exit(1);
}

// `site` in astro.config.mjs is the single source of the production URL (src/lib/site.ts reads it).
const site = read(join(root, 'astro.config.mjs')).match(/site:\s*'([^']+)'/)?.[1];
if (!site) {
  console.error('check-dist: no `site` found in astro.config.mjs.');
  process.exit(1);
}

const all = files(dist).map((path) => '/' + relative(dist, path));
const exists = new Set(all);
const pages = all.filter((path) => path.endsWith('.html'));
const routeOf = (page) => page.replace(/\.html$/, '').replace(/\/index$/, '') || '/';

const decode = (text) => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const meta = (html, key) =>
  html.match(new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]+content="([^"]*)"`))?.[1] ??
  html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${key}"`))?.[1];

for (const page of pages) {
  const html = read(join(dist, page));
  const where = page;
  const route = routeOf(page);
  const isNotFound = page === '/404.html';

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) fail(where, `expected one <h1>, found ${h1Count}`);

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  if (!title) fail(where, 'missing <title>');
  else if (title.length > MAX_TITLE) fail(where, `title is ${title.length} characters, over ${MAX_TITLE}: "${title}"`);

  const description = decode(meta(html, 'description') ?? '');
  if (!description) fail(where, 'missing meta description');
  else if (description.length > MAX_DESCRIPTION) fail(where, `description is ${description.length} characters, over ${MAX_DESCRIPTION}`);

  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/)?.[1];
  if (isNotFound) {
    if (canonical) fail(where, 'the 404 page must not have a canonical');
    if (meta(html, 'robots') !== 'noindex') fail(where, 'the 404 page must be noindex');
  } else {
    if (canonical !== new URL(route, site).href) fail(where, `canonical is ${canonical}, expected ${new URL(route, site).href}`);
    if (meta(html, 'robots')?.includes('noindex')) fail(where, 'indexable page is marked noindex');
  }

  const ogImage = meta(html, 'og:image');
  if (!ogImage) fail(where, 'missing og:image');
  else if (!ogImage.startsWith(site)) fail(where, `og:image is not on ${site}: ${ogImage}`);
  else if (!exists.has(new URL(ogImage).pathname)) fail(where, `og:image file is missing from dist: ${ogImage}`);

  for (const [, raw] of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(raw);
      for (const keyword of data.keywords ?? []) {
        if (keyword.length > MAX_KEYWORD || keyword.includes(',')) fail(where, `JSON-LD keyword is a sentence, not a keyword: "${keyword}"`);
      }
    } catch (error) {
      fail(where, `JSON-LD does not parse: ${error.message}`);
    }
  }

  // The footer says "No cookies". The only script the site ships is inline JSON-LD; Cloudflare Web
  // Analytics (cookieless) is injected at the edge, so it never appears in dist.
  for (const [, attrs] of html.matchAll(/<script([^>]*)>/g)) {
    if (!/type="application\/ld\+json"/.test(attrs) || /\bsrc=/.test(attrs)) fail(where, `unexpected <script>, breaks the "No cookies" footer: <script${attrs}>`);
  }
  if (/document\.cookie|localStorage|sessionStorage/.test(html)) fail(where, 'the HTML touches cookies or web storage, breaks the "No cookies" footer');

  // A source comment in a component leaks into the page of every route that uses it.
  if (html.includes('<!--')) fail(where, 'the HTML contains a comment');

  for (const [, href] of html.matchAll(/<a[^>]+href="(\/[^"]*)"/g)) {
    const path = href.split(/[#?]/)[0];
    if (path === '/' || exists.has(path) || exists.has(`${path}.html`)) continue;
    fail(where, `broken internal link: ${href}`);
  }

  // Head resources (icons, Markdown alternate) the page points at.
  for (const [, href] of html.matchAll(/<link[^>]+href="(\/[^"]*)"/g)) {
    if (!exists.has(href.split(/[#?]/)[0])) fail(where, `<link> points at a file missing from dist: ${href}`);
  }
}

// Browsers, feed readers and link previews request these at the root even when no page links them.
for (const icon of ['/favicon.ico', '/apple-touch-icon.png']) {
  if (!exists.has(icon)) fail(icon, 'missing from dist (run `pnpm icons`)');
}

// Every indexable page is in the sitemap, and nothing else is.
const sitemapPath = '/sitemap-0.xml';
if (!exists.has(sitemapPath)) {
  fail(sitemapPath, 'missing from dist');
} else {
  const listed = new Set([...read(join(dist, sitemapPath)).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const expected = new Set(pages.filter((page) => page !== '/404.html').map((page) => new URL(routeOf(page), site).href));
  for (const url of expected) if (!listed.has(url)) fail(sitemapPath, `missing page ${url}`);
  for (const url of listed) if (!expected.has(url)) fail(sitemapPath, `lists ${url}, which is not a page`);
}

// Every Markdown copy points at its HTML page as canonical (see "Configuration" in the README).
const headers = exists.has('/_headers') ? read(join(dist, '_headers')) : '';
for (const copy of all.filter((path) => path.endsWith('.md'))) {
  const html = copy.replace(/\.md$/, '');
  const rule = headers.split(/\n(?=\S)/).find((block) => block.startsWith(copy + '\n'));
  if (!exists.has(`${html}.html`)) fail(copy, `has no HTML page at ${html}`);
  if (!rule?.includes(`Link: <${new URL(html, site).href}>; rel="canonical"`)) fail('_headers', `no canonical Link rule for ${copy}`);
}

// llms.txt only links to files the site serves.
if (exists.has('/llms.txt')) {
  for (const [, url] of read(join(dist, 'llms.txt')).matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
    if (!url.startsWith(site)) continue;
    const path = new URL(url).pathname;
    if (!exists.has(path) && !exists.has(`${path}.html`)) fail('llms.txt', `links to ${url}, which is not in dist`);
  }
}

if (failures.length > 0) {
  console.error(`check-dist: ${failures.length} problem${failures.length === 1 ? '' : 's'} in ${dist}\n`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`check-dist: ${pages.length} pages OK`);
