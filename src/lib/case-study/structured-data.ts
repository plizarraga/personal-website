import type { CaseStudy } from '@/data/case-studies';
import { caseStudyPath } from '@/lib/case-study/paths';
import { techNames } from '@/lib/case-study/stack';
import { personSchema } from '@/lib/cv/structured-data';
import type { JsonLd } from '@/lib/json-ld';
import { lastUpdated } from '@/lib/last-updated';
import { absoluteUrl } from '@/lib/site';

/** `Article` for a case study, written by Pedro. */
export function caseStudySchema(study: CaseStudy): JsonLd {
  const url = absoluteUrl(caseStudyPath(study.slug));

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${study.title}: case study`,
    description: study.summary,
    url,
    mainEntityOfPage: url,
    dateModified: lastUpdated,
    inLanguage: 'en',
    keywords: techNames(study.stack),
    author: personSchema(),
  };
}
