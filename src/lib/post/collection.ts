import { getCollection, type CollectionEntry } from 'astro:content';
import { HIDE_SCHEDULED } from 'astro:env/server';
import { getCaseStudy } from '@/lib/case-study/collection';

export type Post = CollectionEntry<'posts'>;

/** The owner's time zone. A Publication date is a day there, not in UTC, where the build runs. */
const PUBLICATION_TIME_ZONE = 'America/Los_Angeles';

/** Today as `YYYY-MM-DD` in the owner's time zone (`en-CA` formats dates that way). */
function today(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PUBLICATION_TIME_ZONE }).format(new Date());
}

/**
 * Midnight of a Publication date in the owner's time zone, as ISO 8601 with its offset (`2026-11-11T00:00:00-08:00`),
 * for JSON-LD: Google flags a bare date as invalid. 08:00 UTC is midnight PST and 01:00 PDT, both still on that day
 * and before any daylight-saving switch, so its offset is the one at midnight.
 */
export function publicationDateTime(day: string): string {
  const offset = new Intl.DateTimeFormat('en-US', { timeZone: PUBLICATION_TIME_ZONE, timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${day}T08:00:00Z`))
    .find((part) => part.type === 'timeZoneName')
    ?.value.replace('GMT', '');
  return `${day}T00:00:00${offset || 'Z'}`;
}

/**
 * Every blog post, newest first. Throws when a post names a case study that does not exist, so a typo in
 * `caseStudy` fails the build.
 *
 * A Scheduled post (its `published` date is after today) is left out only when `HIDE_SCHEDULED` is set, which
 * `pnpm run deploy` does. Dev and CI show it, so CI checks it before it goes live.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  await Promise.all(posts.flatMap((post) => (post.data.caseStudy ? [getCaseStudy(post.data.caseStudy)] : [])));
  const visible = HIDE_SCHEDULED ? posts.filter((post) => post.data.published <= today()) : posts;
  return visible.sort((a, b) => b.data.published.localeCompare(a.data.published));
}

/** The posts about one case study, newest first. */
export async function getPostsAbout(caseStudySlug: string): Promise<Post[]> {
  return (await getPosts()).filter((post) => post.data.caseStudy === caseStudySlug);
}
