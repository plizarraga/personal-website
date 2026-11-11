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
    // Shiki with a light and a dark theme, switched by `prefers-color-scheme` like the rest of the site (see `.post pre`
    // in global.css). `defaultColor: false` emits only CSS variables, so the block keeps the site's background. The
    // themes are picked for contrast on that background: comments in `github-dark` and `github-light-default` fail it.
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-default' },
      defaultColor: false,
    },
  },
});
