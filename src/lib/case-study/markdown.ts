import type { CaseStudy } from '@/data/case-studies';
import { profile } from '@/data/cv';
import { caseStudyPath } from '@/lib/case-study/paths';
import { formatDateRange } from '@/lib/dates';
import { bulletList } from '@/lib/markdown';
import { EXPERIENCE_MARKDOWN_PATH, absoluteUrl } from '@/lib/site';

/** A case study as Markdown, served at `/work/<slug>.md` for LLMs and agents. */
export function caseStudyMarkdown(study: CaseStudy): string {
  const status = study.status ? ` (${study.status})` : '';
  const lines = [
    `# ${study.title}: case study`,
    '',
    `${study.role}, ${study.organization} · ${formatDateRange(study.start, study.end)}${status}${study.note ? ` · ${study.note}` : ''}`,
    '',
    `By ${profile.name} · HTML version: ${absoluteUrl(caseStudyPath(study.slug))} · All experience: ${absoluteUrl(EXPERIENCE_MARKDOWN_PATH)}`,
    '',
    study.summary,
    '',
    ...(study.repository ? [`Source code: ${study.repository.url}`, ''] : []),
    ...(study.productSite ? [`Product site: ${study.productSite.url}`, ''] : []),
    ...study.sections.flatMap((section) => [
      `## ${section.heading}`,
      '',
      ...(section.paragraphs ?? []).flatMap((paragraph) => [paragraph, '']),
      ...(section.steps ? [...section.steps.map((step, i) => `${i + 1}. ${step}`), ''] : []),
      ...(section.bullets ? [...bulletList(section.bullets), ''] : []),
    ]),
    '## Stack',
    '',
    study.stack.join(', '),
    '',
  ];

  return lines.join('\n');
}
