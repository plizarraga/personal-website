// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pedrolizarraga.com',
  // Pages build to `experience.html` and are served at `/experience`, without a trailing slash.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
});
