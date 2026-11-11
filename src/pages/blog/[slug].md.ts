import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getPosts } from '@/lib/post/collection';
import { postMarkdown } from '@/lib/post/markdown';

export const getStaticPaths = (async () =>
  (await getPosts()).map((post) => ({ params: { slug: post.id }, props: { post } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { post } = props as InferGetStaticPropsType<typeof getStaticPaths>;
  return new Response(postMarkdown(post));
};
