import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { caseStudies } from '../../data/case-studies';
import { caseStudyMarkdown } from '../../lib/markdown';

export const getStaticPaths = (() =>
  caseStudies.map((study) => ({ params: { slug: study.slug }, props: { study } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { study } = props as InferGetStaticPropsType<typeof getStaticPaths>;
  return new Response(caseStudyMarkdown(study));
};
