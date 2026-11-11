import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** `YYYY` or `YYYY-MM`, like the dates in `src/data/cv.ts`. Quote it in YAML so `2026` stays a string. */
const partialDate = z.string().regex(/^\d{4}(-\d{2})?$/);
const link = z.object({ label: z.string(), url: z.url() });

/**
 * Case studies, one Markdown file each, published at `/work/<file name>`. Like `src/data/cv.ts`, every fact
 * comes from the CV Master or from answers the user gave in an interview and confirmed. Never add a number the
 * user has not confirmed, and never name a client the user keeps private.
 *
 * The body is plain Markdown: `##` sections with paragraphs, `-` bullets, and `1.` steps.
 */
const caseStudies = defineCollection({
  loader: glob({ base: './src/content/case-studies', pattern: '*.md' }),
  schema: z.object({
    /** Position in the home page list and in `/llms.txt`. */
    order: z.number().int().positive(),
    title: z.string(),
    /** One sentence, used as the meta description, in the home page list, and in `/llms.txt`. */
    summary: z.string(),
    role: z.string(),
    organization: z.string(),
    start: partialDate,
    /** `null` means ongoing; omit it to show the start date alone. */
    end: partialDate.nullable().optional(),
    /** Qualifier shown after the dates, such as "in development". */
    status: z.string().optional(),
    /** Short line under the title, such as "Client not named". */
    note: z.string().optional(),
    /** Public source code, when the repository is public. */
    repository: link.optional(),
    /** Public site of the product, when it has one. */
    productSite: link.optional(),
    stack: z.array(z.string()).min(1),
  }),
});

export const collections = { caseStudies };
