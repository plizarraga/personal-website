import { getCollection, type CollectionEntry } from 'astro:content';
import { getCaseStudy } from '@/lib/case-study/collection';

export type Post = CollectionEntry<'posts'>;

/**
 * Every blog post, newest first. Throws when a post names a case study that does not exist, so a typo in
 * `caseStudy` fails the build.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  await Promise.all(posts.flatMap((post) => (post.data.caseStudy ? [getCaseStudy(post.data.caseStudy)] : [])));
  return posts.sort((a, b) => b.data.published.localeCompare(a.data.published));
}

/** The posts about one case study, newest first. */
export async function getPostsAbout(caseStudySlug: string): Promise<Post[]> {
  return (await getPosts()).filter((post) => post.data.caseStudy === caseStudySlug);
}
