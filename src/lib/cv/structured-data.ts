import { certifications, education, knowsAbout, profile } from '@/data/cv';
import type { JsonLd } from '@/lib/json-ld';
import { lastUpdated } from '@/lib/last-updated';
import { absoluteUrl } from '@/lib/site';

/** The schema.org `Person` that every page is about. */
export function personSchema(): JsonLd {
  const apollo = certifications.find((c) => c.issuer === 'Apollo GraphQL');

  return {
    '@type': 'Person',
    '@id': absoluteUrl('/#person'),
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
