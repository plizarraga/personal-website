/** Site-relative path of the blog index. */
export const BLOG_PATH = '/blog';

/** Site-relative path of a blog post. */
export function postPath(slug: string): string {
  return `${BLOG_PATH}/${slug}`;
}

/** Site-relative path of the Markdown copy of a blog post. */
export function postMarkdownPath(slug: string): string {
  return `${postPath(slug)}.md`;
}
