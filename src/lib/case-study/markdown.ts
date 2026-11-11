import { profile } from '@/data/cv';
import type { CaseStudy } from '@/lib/case-study/collection';
import { caseStudyPath } from '@/lib/case-study/paths';
import { formatDateRange } from '@/lib/dates';
import { EXPERIENCE_MARKDOWN_PATH, absoluteUrl } from '@/lib/site';

/** A case study as Markdown, served at `/work/<slug>.md` for LLMs and agents: a header from the frontmatter, then the file's body. */
export function caseStudyMarkdown(study: CaseStudy): string {
  const { data } = study;
  const status = data.status ? ` (${data.status})` : '';
  const lines = [
    `# ${data.title}: case study`,
    '',
    `${data.role}, ${data.organization} · ${formatDateRange(data.start, data.end)}${status}${data.note ? ` · ${data.note}` : ''}`,
    '',
    `By ${profile.name} · HTML version: ${absoluteUrl(caseStudyPath(study.id))} · All experience: ${absoluteUrl(EXPERIENCE_MARKDOWN_PATH)}`,
    '',
    data.summary,
    '',
    ...(data.repository ? [`Source code: ${data.repository.url}`, ''] : []),
    ...(data.productSite ? [`Product site: ${data.productSite.url}`, ''] : []),
    (study.body ?? '').trim(),
    '',
    '## Stack',
    '',
    data.stack.join(', '),
    '',
  ];

  return lines.join('\n');
}
