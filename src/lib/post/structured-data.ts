import { personSchema } from '@/lib/cv/structured-data';
import type { JsonLd } from '@/lib/json-ld';
import { publicationDateTime, type Post } from '@/lib/post/collection';
import { BLOG_PATH, postPath } from '@/lib/post/paths';
import { absoluteUrl } from '@/lib/site';

/** `BlogPosting` for a blog post, written by Pedro. */
export function postSchema(post: Post): JsonLd {
  const { data } = post;
  const url = absoluteUrl(postPath(post.id));

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.summary,
    url,
    mainEntityOfPage: url,
    datePublished: publicationDateTime(data.published),
    dateModified: publicationDateTime(data.updated ?? data.published),
    inLanguage: 'en',
    keywords: data.tags,
    author: personSchema(),
  };
}

/** `Blog` for the blog index, listing every post. */
export function blogSchema(posts: Post[], name: string): JsonLd {
  const url = absoluteUrl(BLOG_PATH);

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url,
    mainEntityOfPage: url,
    name,
    inLanguage: 'en',
    author: personSchema(),
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.data.title,
      url: absoluteUrl(postPath(post.id)),
      datePublished: publicationDateTime(post.data.published),
    })),
  };
}
