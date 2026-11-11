import type { APIRoute } from 'astro';
import { profile } from '@/data/cv';
import { getCaseStudies } from '@/lib/case-study/collection';
import { caseStudyMarkdownPath } from '@/lib/case-study/paths';
import { CV_PDF_PATH, EXPERIENCE_MARKDOWN_PATH, absoluteUrl } from '@/lib/site';

/** The `/llms.txt` index, following the llmstxt.org proposal. */
async function llmsTxt(): Promise<string> {
  const caseStudies = await getCaseStudies();
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
      (study) => `- [${study.data.title}](${absoluteUrl(caseStudyMarkdownPath(study.id))}): ${study.data.summary}`,
    ),
    '',
    '## Profiles',
    '',
    `- [LinkedIn](${profile.linkedin.url})`,
    `- [GitHub](${profile.github.url})`,
    '',
  ].join('\n');
}

export const GET: APIRoute = async () => new Response(await llmsTxt());
