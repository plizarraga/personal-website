// Submits every URL in the built sitemap to IndexNow, which shares it with Bing (and through Bing, DuckDuckGo),
// Yandex, Seznam, and Naver. `pnpm run deploy` runs it after `wrangler deploy`.
// The key is public by design: search engines confirm it by fetching public/<KEY>.txt from the live site.
import { readFile } from 'node:fs/promises';

const KEY = '366bd7a754362cd9c2d3123ccfd0e0f8';
const HOST = 'pedrolizarraga.com';
const keyLocation = `https://${HOST}/${KEY}.txt`;

const sitemap = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
if (urlList.length === 0) throw new Error('indexnow: no URLs in dist/sitemap-0.xml; run the build first');

// IndexNow rejects the batch if the live key file is missing, for example on the first deploy that adds it.
const live = await fetch(keyLocation);
if (!live.ok || (await live.text()).trim() !== KEY) throw new Error(`indexnow: ${keyLocation} does not serve the key`);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation, urlList }),
});
// 200 means submitted; 202 means received while the key is still being validated.
if (response.status !== 200 && response.status !== 202) {
  throw new Error(`indexnow: HTTP ${response.status} ${await response.text()}`);
}
console.log(`indexnow: submitted ${urlList.length} URLs (HTTP ${response.status})`);
