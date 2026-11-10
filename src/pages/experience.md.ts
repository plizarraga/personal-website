import type { APIRoute } from 'astro';
import { experienceMarkdown } from '../lib/markdown';

export const GET: APIRoute = () => new Response(experienceMarkdown());
