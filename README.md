# pedrolizarraga.com

Pedro Lizárraga's personal-brand website: who he is, what he has built, and how to reach him, readable at a glance by people, search crawlers, and LLMs. Live at [pedrolizarraga.com](https://pedrolizarraga.com).

[Features](#features) · [Quick Start](#quick-start) · [Usage](#usage) · [Content rules](#content-rules) · [Configuration](#configuration) · [Deployment](#deployment) · [Contributing](#contributing)

<!-- TODO: add a screenshot of the home page at docs/images/home.png -->

## Features

- **Static HTML, no JavaScript of its own**: every page is plain HTML and CSS. The only scripts are the ones Cloudflare injects when it serves each page: the Web Analytics beacon and the Bot Fight Mode JavaScript Detections. See [Deployment](#deployment).
- **Built for search crawlers**: canonical URLs, a generated sitemap, an open `robots.txt`, and JSON-LD (`Person`, `ProfilePage`, `Article`, `Blog`, `BlogPosting`).
- **Built for LLMs**: a [`/llms.txt`](https://pedrolizarraga.com/llms.txt) index and a Markdown copy of every page, such as [`/experience.md`](https://pedrolizarraga.com/experience.md).
- **One source of truth**: every fact comes from the owner's CV Master. See [Content rules](#content-rules).
- **Checked for accessibility on every build**: each page passes axe-core's WCAG 2.2 A and AA rules, including color contrast, in light and dark mode at desktop and phone widths.
- **Document-style design**: one column, system fonts, one accent color, and automatic dark mode.

## Tech stack

| Role | Tool |
| --- | --- |
| Framework | [Astro](https://astro.build) 7, static output |
| Language | TypeScript 6 |
| Sitemap | `@astrojs/sitemap` |
| Hosting | Cloudflare Workers static assets, deployed with Wrangler 4 |
| Open Graph image | `sharp`, run by [`scripts/og-image.mjs`](scripts/og-image.mjs) |
| Accessibility check | `axe-core` in headless Chromium through Playwright, run by [`scripts/check-a11y.mjs`](scripts/check-a11y.mjs) |

## Quick Start

### Prerequisites

- Node.js 22.23.4 or later (the `engines` field in [`package.json`](package.json))
- pnpm 11.25.0, the version pinned in `packageManager` in [`package.json`](package.json); CI installs the same one

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/plizarraga/personal-website.git
   cd personal-website
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

   Then install the headless Chromium that `pnpm build` uses for the accessibility check (once per machine):

   ```bash
   pnpm exec playwright install --only-shell chromium
   ```

3. Start the dev server:

   ```bash
   pnpm dev
   ```

   Open http://localhost:4321. If that port is busy, Astro picks the next free one and prints it.

## Usage

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with hot reload |
| `pnpm check` | Type-checks `.astro` and `.ts` files |
| `pnpm build` | Runs `astro check` and `check:posts`, builds the site into `dist/`, then runs `check:dist` and `check:a11y` |
| `pnpm check:posts` | Checks the Markdown source of every post against [Post format](#post-format) |
| `pnpm check:dist` | Checks the built site in `dist/`: one `<h1>`, titles and descriptions within length, the Headline verbatim in the home `<title>` and every `og:image:alt`, canonicals, JSON-LD (dates with time and offset), sitemap, Markdown copies, internal links, `<link>` files, `favicon.ico` and `apple-touch-icon.png` |
| `pnpm check:a11y` | Runs axe-core on every page in `dist/`, in light and dark mode at desktop and phone widths, and fails on any WCAG 2.2 A or AA violation, including color contrast, and on links that touch on the same line |
| `pnpm screenshot <route> [--phone] [--dark] [--full] [--selector <css>] [--out <file>]` | Builds, then saves a PNG of one page as a visitor sees it, in `.screenshots/` by default. Use it to check a visual change. To shoot a server that is already running, such as `pnpm dev` for a prototype, run `node scripts/screenshot.mjs "<route>?<query>" --origin http://localhost:4321` |
| `pnpm preview` | Builds and serves `dist/` with `wrangler dev`, the local Workers runtime |
| `pnpm run deploy` | Builds and deploys to production, then submits the sitemap URLs to IndexNow (see [Deployment](#deployment)) |
| `pnpm indexnow` | Submits the URLs in `dist/sitemap-0.xml` to IndexNow without deploying |
| `pnpm og-image` | Regenerates `public/og.png` after a change to the name, Headline, or photo (`scripts/og-photo.jpg`) |
| `pnpm icons` | Regenerates `public/favicon.ico` and `public/apple-touch-icon.png` from `public/favicon.svg` |

`pnpm build` writes one HTML page per route plus the files for crawlers and LLMs:

```text
dist/
├── index.html, experience.html, 404.html
├── work/<slug>.html          # one case study per slug
├── blog.html, blog/<slug>.html  # the blog index and one page per post
├── experience.md, work/<slug>.md, blog/<slug>.md
├── llms.txt, robots.txt
├── sitemap-index.xml, sitemap-0.xml
└── _headers, og.png, favicon.svg, favicon.ico, apple-touch-icon.png, pedro-lizarraga-cv.pdf, <IndexNow key>.txt
```

## Content rules

Every change to the site's text follows these rules. Terms in bold are defined in [`GLOSSARY.md`](GLOSSARY.md).

- **The CV Master is the only source of the CV and the case studies.** That content lives in [`src/data/cv.ts`](src/data/cv.ts) and in one Markdown file per case study in [`src/content/case-studies/`](src/content/case-studies), whose frontmatter fields are defined in [`src/content.config.ts`](src/content.config.ts). Every fact comes from the **CV Master**, a file in a separate private repo, or from interview answers the owner confirmed. When the CV Master changes, these files are updated by hand: see [Syncing the CV Master](#syncing-the-cv-master).
- **Posts cite their project.** A **Post** in [`src/content/posts/`](src/content/posts) is the owner's own writing. Its facts and numbers come from the project's repository (decision records, commits, issues, measurements), and the post says what was measured and how. Code from a private repository is quoted only from generic modules, translated, never from client data. A post never contradicts its case study: fix the case study in the same change.
- **No invented numbers or names.** Add no metric the owner has not confirmed, and never name a client the owner keeps private. No client data (prices, addresses, staff names) and no real conversations, even anonymized.
- **The AI agent stays "in development"** until it is actually in production.
- **English only** for now.
- **Name in the first sentence.** Each page opens by naming the person and what he does ("I'm Pedro Lizárraga, a Senior Software Engineer…"), so the sentence still makes sense when an LLM quotes it out of context.
- **Full technology names**, spelled as in the CV Master: "TypeScript", not "TS".
- **No phone number** on the site or in the CV PDF. The PDF is the CV Master's "website" variant, built in the private repo and copied to [`public/pedro-lizarraga-cv.pdf`](public/pedro-lizarraga-cv.pdf).
- **The same identity everywhere.** The **Canonical name** and **Headline** are worded the same on the site, the CV, LinkedIn, and GitHub.
- **Nothing that adds weight or tracking**: no client-side JavaScript, cookies, animations, carousels, or modals.

### Publishing a post

The repo is public, so anything on `main` can be read on GitHub, whether or not the site shows it.

1. **Draft**: write the post on its own branch, `feat/post-<slug>`, in `src/content/posts/<slug>.md`. Do not merge it to `main` while it is being written.
2. **Review**: open a PR. Set `published` to the **Publication date**, the day the post should appear, in Pacific time (`America/Los_Angeles`). CI builds every post, including future ones, so `check:dist` and `check:a11y` check it now. Commit as `feat(blog): add post "<title>"`.
3. **Scheduled post**: merge the PR. While `published` is after today, `pnpm run deploy` leaves the post out of every page, the sitemap, `llms.txt`, and the JSON-LD (`HIDE_SCHEDULED=true`, read in [`src/lib/post/collection.ts`](src/lib/post/collection.ts)). `pnpm dev` and `pnpm build` show it.
4. **Published**: the post appears on the first deploy on or after its Publication date. Deploys are manual for now (see [Deployment](#deployment)), so run `pnpm run deploy` that day.

### Post format

Every post looks and reads the same. To change a rule, change this list and the file named next to it in the same PR, so the docs and the build never disagree. The build fails on every rule marked *checked*.

| Rule | Where it lives |
| --- | --- |
| Frontmatter: `title`, `summary`, `published`, `tags`, and optionally `updated` and `caseStudy` | Schema in [`src/content.config.ts`](src/content.config.ts) (*checked*) |
| `title` fits a search result: the page title is at most 60 characters, with " · Pedro Lizárraga" dropped when it does not fit | [`src/pages/blog/[slug].astro`](src/pages/blog/[slug].astro), `MAX_TITLE` in [`scripts/check-dist.mjs`](scripts/check-dist.mjs) (*checked*) |
| `summary` is one or two sentences, at most 160 characters. It is the meta description, the lede under the title, and the text in the blog list | Schema (*checked*) |
| The body starts with a short introduction, then `##` sections. No `#` heading: the title comes from the frontmatter | [`scripts/check-posts.mjs`](scripts/check-posts.mjs) (*checked*) |
| A post with 3 or more `##` sections gets a table of contents, built from those headings, between the lede and the body | `MIN_TOC_SECTIONS` in [`src/lib/post/toc.ts`](src/lib/post/toc.ts); every link must reach its section (`check:dist`, *checked*) |
| Every code block names its language (` ```ts `, ` ```bash `, ` ```text ` for output) | [`scripts/check-posts.mjs`](scripts/check-posts.mjs) (*checked*) |
| Code lines are at most 80 characters, so a desktop page needs no sideways scroll. Wrap comments and long strings by hand | `MAX_CODE_LINE` in [`scripts/check-posts.mjs`](scripts/check-posts.mjs) (*checked*) |
| Code colors come from Shiki themes chosen for contrast on the site background, light and dark | `markdown.shikiConfig` in [`astro.config.mjs`](astro.config.mjs); contrast by `check:a11y` (*checked*) |
| Tables for comparisons and measurements, with units in the header (`p50 latency (ms)`) | Review |
| The post ends with a link to its case study, when it has one, then "All posts" and the Markdown copy | [`src/pages/blog/[slug].astro`](src/pages/blog/[slug].astro) |

### Blog list

`/blog` lists every published post, newest first by `published`, each with its title, Publication date, and `summary`. Scheduled posts are left out of production (see [Publishing a post](#publishing-a-post)). The list is [`src/pages/blog/index.astro`](src/pages/blog/index.astro); its order and filter are `getPosts()` in [`src/lib/post/collection.ts`](src/lib/post/collection.ts), which every page, `llms.txt`, and the JSON-LD share.

### Syncing the CV Master

The **CV Master** is `master/CV_MASTER.md` in the private career repo, expected at `../career` next to this one. Edit the master first, never `src/data/cv.ts` alone: `pnpm run check:cv-master` fails when a bullet in `cv.ts` is not word for word in the master. `pnpm run deploy` runs it (skipped when `../career` is absent, as in CI).

1. In `../career`, change `master/CV_MASTER.md`, then the same lines in `applications/*-website/CV.md` and `applications/*-general-purpose/CV.md`, and rebuild their DOCX and PDF (see that repo's `CLAUDE.md`). Open a PR there.
2. Here, change `src/data/cv.ts` and the case studies in `src/content/case-studies/` to match.
3. Copy `../career/applications/*-website/Pedro_Lizarraga_CV.pdf` to `public/pedro-lizarraga-cv.pdf`.
4. Open a PR, merge it, then deploy (see [Deployment](#deployment)).

## Repository structure

```text
personal-website/
├── public/                # Copied to dist/ as is: _headers, favicons, og.png, CV PDF
├── scripts/               # og-image.mjs and og-photo.jpg (public/og.png), icons.mjs (favicon.ico, apple-touch-icon.png), check-deploy-branch.mjs (deploys only from main), check-cv-master.mjs (checks cv.ts against the CV Master before each deploy), check-posts.mjs (checks post sources before each build), check-dist.mjs and check-a11y.mjs (check dist/ after each build), screenshot.mjs and lib/serve-dist.mjs (serve dist/ in Chromium), indexnow.mjs (after each deploy)
├── src/
│   ├── pages/             # Routes only, plus robots.txt, llms.txt, and the .md copies
│   ├── layouts/           # BaseLayout (meta tags, canonical URL, JSON-LD), SiteHeader, SiteFooter
│   ├── components/
│   │   ├── cv/            # RoleEntry, ProjectEntry
│   │   ├── case-study/    # CaseStudyLink
│   │   └── DateRange.astro
│   ├── content/           # case-studies/*.md and posts/*.md: one file per case study or post
│   ├── data/              # cv.ts (all CV content), navigation.ts
│   ├── lib/
│   │   ├── cv/            # Markdown copy and JSON-LD of the CV
│   │   ├── case-study/    # Paths, Markdown copy, JSON-LD, stack names
│   │   ├── post/          # Paths, Markdown copy, JSON-LD, and table of contents of the blog
│   │   └── *.ts           # Generic: site URLs, dates, JSON-LD serializer, last updated date
│   ├── styles/            # global.css
│   └── content.config.ts  # Case study and post frontmatter schemas
├── astro.config.mjs       # Site URL, sitemap, URL format
├── wrangler.jsonc         # Worker name, assets, custom domain
└── GLOSSARY.md            # Terms used in code and content
```

## Configuration

The site has no environment variables. These files hold the settings you may change:

| File | Settings |
| --- | --- |
| [`astro.config.mjs`](astro.config.mjs) | `site` (production URL), `trailingSlash: 'never'`, and `build.format: 'file'`, which serve pages at `/experience` with no trailing slash |
| [`src/lib/site.ts`](src/lib/site.ts) | The CV PDF path and the Open Graph image. It reads the production URL from `site` in `astro.config.mjs` |
| [`wrangler.jsonc`](wrangler.jsonc) | Worker name, the `dist` assets folder, the 404 page, and the custom domain |
| [`public/_headers`](public/_headers) | Security headers, and the canonical `Link` header of each Markdown copy |

> [!IMPORTANT]
> A new page with a Markdown copy needs its own rule in `public/_headers`, so the copy points to the HTML page as canonical. `check:dist` fails the build when the rule is missing.

## Deployment

Deploys are manual: CI (`.github/workflows/ci.yml`) runs `pnpm build` on every pull request but does not deploy. `pnpm run deploy` runs `check:dist` and `check:a11y` before it ships, and needs a Wrangler session (`wrangler login`) with access to the owner's Cloudflare account. It deploys only from `main`, clean and up to date with `origin/main` (`scripts/check-deploy-branch.mjs`), so production is always what is merged: merge the PR, then `git checkout main && git pull`. Use `pnpm run deploy`, not `pnpm deploy`: `pnpm deploy` is a different, built-in pnpm command.

Everything outside the code lives in Cloudflare and the search consoles:

| Component | Platform | Notes |
| --- | --- | --- |
| Site | Cloudflare Workers, Worker `personal-website` | `pedrolizarraga.com` is a custom domain. Because `wrangler.jsonc` has `routes`, Wrangler turns off the `workers.dev` URL on every deploy |
| Domain | Cloudflare Registrar | Renews automatically every November |
| `www` redirect | Cloudflare Redirect Rule "Redirect www to root" | 301 to `https://pedrolizarraga.com`, keeping the path and query string |
| HTTPS | Cloudflare "Always Use HTTPS" | 301 from `http://` to `https://`, keeping the path and query string |
| Email | Cloudflare Email Routing | `hello@pedrolizarraga.com` forwards to the owner's inbox. Receive only; the catch-all is off |
| Analytics | Cloudflare Web Analytics | Beacon injected automatically, no cookies. No click events or UTM tracking |
| Bots | Cloudflare Bot Fight Mode, with JavaScript Detections | Challenges known bad bots; verified crawlers such as Googlebot and Bingbot pass. Bot Fight Mode requires JavaScript Detections. AI crawlers are allowed: "Block AI bots" and the Cloudflare-managed `robots.txt` are off |
| Speed | Cloudflare Speed Brain and 0-RTT | Speed Brain prefetches the likely next page through a `Speculation-Rules` header; 0-RTT resumes TLS connections for returning visitors |
| Search | Google Search Console (domain property), Bing Webmaster Tools, and IndexNow | `sitemap-index.xml` submitted to both consoles. Every deploy submits the sitemap URLs to IndexNow (`scripts/indexnow.mjs`), which Bing, and through it DuckDuckGo, picks up. The key file is `public/<key>.txt`; renaming or deleting it breaks the submission |

> [!WARNING]
> The Web Analytics beacon and the JavaScript Detections script reach the page only because Cloudflare can inject them into the HTML. A `Content-Security-Policy` in `public/_headers` must allow the beacon from `static.cloudflareinsights.com` and the inline JavaScript Detections script, which loads more from `/cdn-cgi/challenge-platform/`. HTML responses must not send `Cache-Control: no-transform`, or both scripts stop without any error.

> [!WARNING]
> Keep these DNS records: the `google-site-verification` TXT record on the apex, the Bing `<id>.pedrolizarraga.com` CNAME to `verify.bing.com`, and the Email Routing MX, SPF, and DKIM records. Deleting a verification record un-verifies the site in that console. Each verification record has a comment in Cloudflare that says what it is for.

## Contributing

This is a personal site maintained by its owner. Changes go through a pull request:

- Branch names follow `type/description`, such as `feat/new-case-study`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org).
- Run `pnpm build` before opening a PR; it runs `astro check` and `check:posts` first and `check:dist` and `check:a11y` last. CI runs the same command.
