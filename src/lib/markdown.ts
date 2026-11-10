import { caseStudies, type CaseStudy } from '../data/case-studies';
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
import { CV_PDF_PATH, EXPERIENCE_MARKDOWN_PATH, absoluteUrl, caseStudyMarkdownPath, caseStudyPath } from './site';

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
    '## Case studies',
    '',
    ...caseStudies.map(
      (study) => `- [${study.title}](${absoluteUrl(caseStudyMarkdownPath(study.slug))}): ${study.summary}`,
    ),
    '',
    '## Profiles',
    '',
    `- [LinkedIn](${profile.linkedin.url})`,
    `- [GitHub](${profile.github.url})`,
    '',
  ].join('\n');
}
