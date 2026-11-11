import type { CaseStudy } from '@/lib/case-study/collection';
import { caseStudyPath } from '@/lib/case-study/paths';
import { techNames } from '@/lib/case-study/stack';
import { personSchema } from '@/lib/cv/structured-data';
import type { JsonLd } from '@/lib/json-ld';
import { lastUpdated } from '@/lib/last-updated';
import { absoluteUrl } from '@/lib/site';

/** `Article` for a case study, written by Pedro. */
export function caseStudySchema(study: CaseStudy): JsonLd {
  const { data } = study;
  const url = absoluteUrl(caseStudyPath(study.id));

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${data.title}: case study`,
    description: data.summary,
    url,
    mainEntityOfPage: url,
    dateModified: lastUpdated,
    inLanguage: 'en',
    keywords: techNames(data.stack),
    author: personSchema(),
  };
}
