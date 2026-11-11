// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  site: 'https://pedrolizarraga.com',
  // Pages build to `experience.html` and are served at `/experience`, without a trailing slash.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  markdown: {
    // Keep straight quotes and hyphens exactly as written in the case studies.
    processor: satteri({ features: { smartPunctuation: false } }),
  },
});
