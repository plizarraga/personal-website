import type { APIRoute } from 'astro';
import { caseStudies } from '@/data/case-studies';
import { profile } from '@/data/cv';
import { caseStudyMarkdownPath } from '@/lib/case-study/paths';
import { CV_PDF_PATH, EXPERIENCE_MARKDOWN_PATH, absoluteUrl } from '@/lib/site';

/** The `/llms.txt` index, following the llmstxt.org proposal. */
function llmsTxt(): string {
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

export const GET: APIRoute = () => new Response(llmsTxt());
