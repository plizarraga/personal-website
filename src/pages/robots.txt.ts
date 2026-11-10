import type { APIRoute } from 'astro';

/** Every crawler, including AI crawlers, may read the whole site. */
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`);
};
