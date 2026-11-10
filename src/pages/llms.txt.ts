import type { APIRoute } from 'astro';
import { llmsTxt } from '../lib/markdown';

export const GET: APIRoute = () => new Response(llmsTxt());
