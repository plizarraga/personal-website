/** Site-relative path of a case study page. */
export function caseStudyPath(slug: string): string {
  return `/work/${slug}`;
}

/** Site-relative path of the Markdown copy of a case study. */
export function caseStudyMarkdownPath(slug: string): string {
  return `${caseStudyPath(slug)}.md`;
}
