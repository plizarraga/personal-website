export const SITE_URL = 'https://pedrolizarraga.com';

export const CV_PDF_PATH = '/pedro-lizarraga-cv.pdf';
export const EXPERIENCE_MARKDOWN_PATH = '/experience.md';

export const OG_IMAGE = {
  path: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Pedro Lizárraga, Senior Software Engineer | Full-Stack',
} as const;

/** Site-relative path of a case study page. */
export function caseStudyPath(slug: string): string {
  return `/work/${slug}`;
}

/** Site-relative path of the Markdown copy of a case study. */
export function caseStudyMarkdownPath(slug: string): string {
  return `${caseStudyPath(slug)}.md`;
}

/** Turns a site-relative path into an absolute URL on the production domain. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}
