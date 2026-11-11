import type { MarkdownHeading } from 'astro';

/** A post gets a table of contents from this many `##` sections up. README "Post format" states the same number. */
export const MIN_TOC_SECTIONS = 3;

/** The `##` sections of a post for its table of contents, or none when the post is too short to need one. */
export function tocSections(headings: MarkdownHeading[]): MarkdownHeading[] {
  const sections = headings.filter((heading) => heading.depth === 2);
  return sections.length >= MIN_TOC_SECTIONS ? sections : [];
}
