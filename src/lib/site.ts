import { site } from 'astro:config/server';

if (!site) throw new Error('Set `site` in astro.config.mjs: canonical URLs and JSON-LD need it.');

/** Production origin, read from `site` in `astro.config.mjs`, its single source. */
const SITE_URL = site;

export const CV_PDF_PATH = '/pedro-lizarraga-cv.pdf';
export const EXPERIENCE_MARKDOWN_PATH = '/experience.md';

export const OG_IMAGE = {
  path: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Photo of Pedro Lizárraga beside the name and Headline: Senior Software Engineer | Full-Stack',
} as const;

/** Turns a site-relative path into an absolute URL on the production domain. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}
