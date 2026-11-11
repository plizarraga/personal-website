import {
  certifications,
  education,
  profile,
  roles,
  selectedProjects,
  skills,
  spokenLanguages,
  summary,
  type Project,
} from '@/data/cv';
import { caseStudyMarkdownPath } from '@/lib/case-study/paths';
import { formatDateRange, formatPartialDate } from '@/lib/dates';
import { bulletList } from '@/lib/markdown';
import { CV_PDF_PATH, absoluteUrl } from '@/lib/site';

function projectBlock(project: Project, heading: string): string[] {
  const name = project.url ? `[${project.name}](${project.url})` : project.name;
  const status = project.status ? ` (${project.status})` : '';

  return [
    `${heading} ${name}${status}`,
    '',
    formatDateRange(project.start, project.end),
    '',
    ...bulletList(project.bullets),
    ...(project.environment ? ['', `Stack: ${project.environment.join(', ')}`] : []),
    ...(project.caseStudySlug
      ? ['', `Case study: ${absoluteUrl(caseStudyMarkdownPath(project.caseStudySlug))}`]
      : []),
    '',
  ];
}

/** The full CV as Markdown, served at `/experience.md` for LLMs and agents. */
export function experienceMarkdown(): string {
  const lines = [
    `# ${profile.name}: Experience`,
    '',
    `${profile.headline} · ${profile.location} · ${profile.workMode}`,
    '',
    `Email: ${profile.email} · LinkedIn: ${profile.linkedin.url} · GitHub: ${profile.github.url}`,
    '',
    `HTML version: ${absoluteUrl('/experience')} · PDF: ${absoluteUrl(CV_PDF_PATH)}`,
    '',
    '## Summary',
    '',
    ...summary.flatMap((paragraph) => [paragraph, '']),
    '## Skills',
    '',
    ...skills.map((group) => `- **${group.label}:** ${group.items.join(', ')}`),
    '',
    '## Experience',
    '',
    ...roles.flatMap((role) => [
      `### ${role.title} · ${role.company}`,
      '',
      `${formatDateRange(role.start, role.end)} · ${role.location}`,
      '',
      ...role.projects.flatMap((project) => projectBlock(project, '####')),
      ...(role.bullets.length > 0 ? [...bulletList(role.bullets), ''] : []),
      ...(role.environment ? [`Stack: ${role.environment.join(', ')}`, ''] : []),
      ...(role.caseStudySlug
        ? [`Case study: ${absoluteUrl(caseStudyMarkdownPath(role.caseStudySlug))}`, '']
        : []),
    ]),
    '## Selected projects',
    '',
    ...selectedProjects.flatMap((project) => projectBlock(project, '###')),
    '## Certifications',
    '',
    ...bulletList(
      certifications.map((c) => `${c.name} · ${c.issuer}${c.date ? ` · ${formatPartialDate(c.date)}` : ''}`),
    ),
    '',
    '## Education',
    '',
    `${education.degree} · ${education.institution} · ${education.location} · ${education.start}–${education.end}`,
    '',
    '## Languages',
    '',
    spokenLanguages.join(', '),
    '',
  ];

  return lines.join('\n');
}
