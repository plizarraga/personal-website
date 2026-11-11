import { certifications, education, knowsAbout, profile } from '../data/cv';
import { lastUpdated } from './last-updated';
import type { CaseStudy } from '../data/case-studies';
import { SITE_URL, absoluteUrl, caseStudyPath } from './site';
import { techNames } from './stack';

type JsonLd = Record<string, unknown>;

const PERSON_ID = `${SITE_URL}/#person`;

/** The schema.org `Person` that every page is about. */
export function personSchema(): JsonLd {
  const apollo = certifications.find((c) => c.issuer === 'Apollo GraphQL');

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    alternateName: profile.alternateNames,
    givenName: profile.givenName,
    familyName: profile.familyName,
    jobTitle: profile.jobTitle,
    description: profile.shortBio,
    url: absoluteUrl('/'),
    email: `mailto:${profile.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mexicali',
      addressRegion: 'Baja California',
      addressCountry: 'MX',
    },
    sameAs: [profile.linkedin.url, profile.github.url],
    knowsAbout,
    alumniOf: { '@type': 'CollegeOrUniversity', name: education.institution },
    ...(apollo && {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: apollo.name,
        recognizedBy: { '@type': 'Organization', name: apollo.issuer },
      },
    }),
  };
}

/** `ProfilePage` for the home page, following Google's profile page guidelines. */
export function profilePageSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl('/'),
    dateModified: lastUpdated,
    mainEntity: personSchema(),
  };
}

/** `WebPage` about Pedro, for pages other than the home page. */
export function webPageSchema(path: string, name: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: absoluteUrl(path),
    name,
    dateModified: lastUpdated,
    about: personSchema(),
  };
}

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

/** Serializes JSON-LD for a `<script>` tag, escaping `<` so the content cannot close the tag. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
