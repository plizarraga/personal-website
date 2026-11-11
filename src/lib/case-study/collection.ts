import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type CaseStudy = CollectionEntry<'caseStudies'>;

/** Every case study, in the order the site lists them (`order` in the frontmatter). */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const studies = await getCollection('caseStudies');
  return studies.sort((a, b) => a.data.order - b.data.order);
}

/** The case study with this slug. Throws, so a `caseStudySlug` in `cv.ts` with no matching file fails the build. */
export async function getCaseStudy(slug: string): Promise<CaseStudy> {
  const study = await getEntry('caseStudies', slug);
  if (!study) throw new Error(`No case study with the slug "${slug}" in src/content/case-studies/`);
  return study;
}
