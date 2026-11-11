// Runs axe-core on every page of the built site in `dist/`, in light and dark mode, at desktop and phone widths.
// Fails on any WCAG 2.2 level A or AA violation, color contrast included, and on links that touch: two links on the
// same line with no space between them read as one ("ExperienceBlog"), which axe does not flag.
// Run after `astro build`: `node scripts/check-a11y.mjs [distDir]`. Exits 1 when any check fails.
// Needs Chromium once per machine: `pnpm exec playwright install --only-shell chromium`.
import { AxeBuilder } from '@axe-core/playwright';
import { COLOR_SCHEMES, VIEWPORTS, distDir, launchChromium, routesOf, serveDist } from './lib/serve-dist.mjs';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
/** Smallest gap, in CSS pixels, between two links on the same line. A space in the body font is about 4px. */
const MIN_LINK_GAP = 2;

const dist = distDir(process.argv[2], 'check-a11y');
const routes = routesOf(dist);
const server = await serveDist(dist);
const browser = await launchChromium('check-a11y', server.close);

/** Pairs of visible links on the same line whose boxes are closer than `minGap`, as "first" + "second" texts. */
const touchingLinks = (minGap) => {
  const boxes = [...document.querySelectorAll('a[href]')].flatMap((link) =>
    [...link.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0).map((rect) => ({ link, rect })),
  );
  const pairs = [];
  for (const [i, a] of boxes.entries()) {
    for (const b of boxes.slice(i + 1)) {
      if (a.link === b.link || a.link.contains(b.link) || b.link.contains(a.link)) continue;
      const overlap = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
      if (overlap < Math.min(a.rect.height, b.rect.height) / 2) continue;
      const gap = Math.max(a.rect.left, b.rect.left) - Math.min(a.rect.right, b.rect.right);
      if (gap < minGap) pairs.push(`"${a.link.textContent.trim()}" + "${b.link.textContent.trim()}"`);
    }
  }
  return pairs;
};

const failures = [];
for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  for (const colorScheme of COLOR_SCHEMES) {
    const context = await browser.newContext({ viewport, colorScheme });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(server.origin + route);
      const where = `${route} (${viewportName}, ${colorScheme})`;
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      for (const violation of violations) {
        const targets = violation.nodes.map((node) => node.target.join(' ')).join(', ');
        failures.push(`${where}: ${violation.id}: ${violation.help}. Elements: ${targets}`);
      }
      for (const pair of await page.evaluate(touchingLinks, MIN_LINK_GAP)) {
        failures.push(`${where}: link-spacing: links touch and read as one: ${pair}`);
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
