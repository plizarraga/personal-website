import type { APIRoute } from 'astro';
import { experienceMarkdown } from '@/lib/cv/markdown';

export const GET: APIRoute = () => new Response(experienceMarkdown());
