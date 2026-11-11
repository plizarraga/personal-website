// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  site: 'https://pedrolizarraga.com',
  // Pages build to `experience.html` and are served at `/experience`, without a trailing slash.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  env: {
    schema: {
      // Set by `pnpm run deploy`: leave Scheduled posts (published after today) out of the production build.
      HIDE_SCHEDULED: envField.boolean({ context: 'server', access: 'public', default: false }),
    },
  },
  markdown: {
    // Keep straight quotes and hyphens exactly as written in the case studies.
    processor: satteri({ features: { smartPunctuation: false } }),
    // Code blocks use the site's own colors (see `.post pre` in global.css). Shiki's themes add inline colors that
    // fail the contrast check and a dark block that ignores the light theme.
    syntaxHighlight: false,
  },
});
