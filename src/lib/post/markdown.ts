import { profile } from '@/data/cv';
import { caseStudyPath } from '@/lib/case-study/paths';
import { formatDay } from '@/lib/dates';
import type { Post } from '@/lib/post/collection';
import { BLOG_PATH, postPath } from '@/lib/post/paths';
import { absoluteUrl } from '@/lib/site';

/** A blog post as Markdown, served at `/blog/<slug>.md` for LLMs and agents: a header from the frontmatter, then the file's body. */
export function postMarkdown(post: Post): string {
  const { data } = post;
  const updated = data.updated ? ` · Updated ${formatDay(data.updated)}` : '';
  const lines = [
    `# ${data.title}`,
    '',
    `By ${profile.name} · ${formatDay(data.published)}${updated}`,
    '',
    `HTML version: ${absoluteUrl(postPath(post.id))} · All posts: ${absoluteUrl(BLOG_PATH)}`,
    '',
    data.summary,
    '',
    ...(data.caseStudy ? [`Case study: ${absoluteUrl(caseStudyPath(data.caseStudy))}`, ''] : []),
    (post.body ?? '').trim(),
    '',
  ];

  return lines.join('\n');
}
