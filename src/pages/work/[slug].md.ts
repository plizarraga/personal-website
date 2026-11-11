import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCaseStudies } from '@/lib/case-study/collection';
import { caseStudyMarkdown } from '@/lib/case-study/markdown';

export const getStaticPaths = (async () =>
  (await getCaseStudies()).map((study) => ({ params: { slug: study.id }, props: { study } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { study } = props as InferGetStaticPropsType<typeof getStaticPaths>;
  return new Response(caseStudyMarkdown(study));
};
