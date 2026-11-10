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
} from '../data/cv';
import { formatDateRange, formatPartialDate } from './dates';
import { CV_PDF_PATH, EXPERIENCE_MARKDOWN_PATH, absoluteUrl } from './site';

function bulletList(items: string[]): string[] {
  return items.map((item) => `- ${item}`);
}

function projectBlock(project: Project, heading: string): string[] {
  const name = project.url ? `[${project.name}](${project.url})` : project.name;
  const status = project.status ? ` (${project.status})` : '';

  return [
    `${heading} ${name}${status}`,
    '',
    formatDateRange(project.start, project.end),
    '',
    ...bulletList(project.bullets),
    ...(project.environment ? ['', `Environment: ${project.environment.join(', ')}`] : []),
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
      ...(role.bullets.length > 0 ? [...bulletList(role.bullets), ''] : []),
      ...role.projects.flatMap((project) => projectBlock(project, '####')),
      ...(role.environment ? [`Environment: ${role.environment.join(', ')}`, ''] : []),
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

/** The `/llms.txt` index, following the llmstxt.org proposal. */
export function llmsTxt(): string {
  return [
    `# ${profile.name}`,
    '',
    `> ${profile.thirdPersonBio}`,
    '',
    `Contact: ${profile.email}`,
    '',
    '## Pages',
    '',
    `- [Experience](${absoluteUrl(EXPERIENCE_MARKDOWN_PATH)}): full CV in Markdown, with skills, roles, projects, certifications, and education`,
    `- [CV (PDF)](${absoluteUrl(CV_PDF_PATH)}): the same CV as a two-page PDF`,
    '',
    '## Profiles',
    '',
    `- [LinkedIn](${profile.linkedin.url})`,
    `- [GitHub](${profile.github.url})`,
    '',
  ].join('\n');
}
