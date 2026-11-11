/**
 * Case studies, one page each at `/work/<slug>`. Like `cv.ts`, every fact here comes from the
 * CV Master or from answers the user gave in an interview and confirmed. Never add a number
 * the user has not confirmed, and never name a client the user keeps private.
 */
import type { Link, PartialDate } from './cv';

export interface CaseStudySection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Rendered as an ordered list, for a sequence of steps. */
  steps?: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** One sentence, used as the meta description, in the home page list, and in `/llms.txt`. */
  summary: string;
  role: string;
  organization: string;
  start: PartialDate;
  /** `null` means ongoing; omit it to show the start date alone. */
  end?: PartialDate | null;
  /** Qualifier shown after the dates, such as "in development". */
  status?: string;
  /** Short line under the title, such as "Client not named". */
  note?: string;
  /** Public source code, when the repository is public. */
  repository?: Link;
  /** Public site of the product, when it has one. */
  productSite?: Link;
  sections: CaseStudySection[];
  stack: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'healthcare-platform',
    title: 'Healthcare Platform',
    summary:
      'The GraphQL backend of a patient-facing healthcare app: doctor search, appointments, and lab results from Epic FHIR, in an Apollo Federation graph.',
    role: 'Senior Software Engineer',
    organization: 'Publicis Sapient',
    start: '2024-03',
    end: '2026-08',
    note: 'I do not name the client.',
    sections: [
      {
        heading: 'Context',
        paragraphs: [
          'A patient-facing web and mobile app for people with a medical-expenses insurance plan. Patients search for doctors and schedule appointments, follow each appointment, read lab results and notifications, and add their children or dependents to see their profiles.',
          'The backend was a GraphQL graph built with Apollo Federation and split into several subgraphs. All the clinical data (appointments, lab results, doctors) came from Epic through its FHIR APIs.',
        ],
      },
      {
        heading: 'My role',
        paragraphs: ['I worked on the backend as a Senior Software Engineer at Publicis Sapient. I owned these parts of the graph:'],
        bullets: [
          'The subgraph for doctor search and doctor details.',
          'System notifications.',
          'The cache of Epic data.',
          'The joins between Epic data and the other subgraphs.',
          'Parsing Epic data into normalized domain models.',
        ],
      },
      {
        heading: 'How a doctor lookup worked',
        paragraphs: ['Searching for doctors and opening their details meant many calls to Epic. This is how I kept them down:'],
        steps: [
          "Start from the patient's medical record.",
          "Fetch the practitioner's details (the FHIR term for a doctor) from Epic.",
          'Link the practitioner with the data in another subgraph.',
          'Cache the result in PostgreSQL, so Epic is not called more than needed.',
        ],
      },
      {
        heading: 'Data and storage',
        bullets: [
          'From Epic FHIR: Practitioner, Patient, Appointment, DiagnosticReport, and Observation resources, plus lab tests and medications.',
          'In PostgreSQL: notifications, preferences, and the cache of Epic practitioner data.',
        ],
      },
      {
        heading: 'Delivery',
        bullets: [
          'I tested the services with Jest and Vitest and worked with the frontend, mobile, QA, product, and engineering teams.',
          'I helped the React Native mobile team move its Android and iOS build and deployment pipelines from GitHub Actions to Bitrise.',
        ],
      },
      {
        heading: 'Result',
        paragraphs: [
          'I have no measurements I can stand behind, so I describe the result without numbers. The backend served an app where patients could find doctors, follow their appointments, and read lab results and notifications, and the cache meant that repeated doctor searches and detail views did not each need a call to Epic.',
        ],
      },
    ],
    stack: [
      'TypeScript',
      'Node.js',
      'Apollo Server',
      'Apollo Federation',
      'GraphQL',
      'PostgreSQL',
      'Epic FHIR',
      'Jest',
      'Vitest',
      'GitHub Actions',
      'Bitrise',
    ],
  },
  {
    slug: 'dealer-b2b-commerce-platform',
    title: 'Dealer B2B Commerce Platform',
    summary:
      "Fender's dealer-facing B2B commerce platform, where I built core Angular experiences for product discovery, catalog, cart, ordering, and order tracking.",
    role: 'Senior Frontend Developer',
    organization: 'Fender Musical Instruments Corporation',
    start: '2016-10',
    end: '2022-05',
    sections: [
      {
        heading: 'Context',
        paragraphs: [
          "Fender's dealers used a business-to-business commerce platform to find products, browse the catalog, fill a cart, place orders, and follow them after they were placed.",
          'I worked on this one platform for the whole time I was at Fender, from October 2016 to May 2022.',
        ],
      },
      {
        heading: 'My role',
        paragraphs: [
          'I was a Senior Frontend Developer. My main work was the Angular frontend. I also worked on parts of the endpoints it used, which were serverless Node.js services running on AWS Lambda.',
        ],
        bullets: [
          'I worked with product, backend, and QA in Agile teams to plan, implement, test, and release features for dealers.',
          'I did code reviews and mentored and onboarded engineers on the team.',
        ],
      },
      {
        heading: 'What I built',
        bullets: [
          'Core experiences of the platform: product discovery, catalog, cart, ordering, and order tracking.',
          'Improved responsive behavior and navigation across the key journeys.',
          'The connection between those screens and the serverless Node.js services on AWS Lambda.',
        ],
      },
      {
        heading: 'How I structured the Angular app',
        paragraphs: [
          'I designed the Angular application so that related code stays together and shared code stays small. These were the rules:',
        ],
        bullets: [
          'Business domain first, technical type second. Code was grouped by the business area that owns it, and each screen had its own folder, instead of global folders such as components or services.',
          'Three top-level areas. The core folder held application-wide infrastructure, the features folder had one folder per business domain, and the shared folder held only code that was reusable across domains and did not depend on any of them.',
          'Responsibility folders only when needed. A ui folder held presentational components, a data-access folder held API services and state, and a utils folder held pure helpers. I did not create empty folders ahead of time.',
          'Code lived in the smallest scope that contained all of its users. It moved up to the parent domain, and later to the shared folder, only when real reuse appeared. Sibling screens never depended on each other.',
        ],
      },
      {
        heading: 'Result',
        paragraphs: [
          'I have no measurements I can stand behind, so I describe the result without numbers. Dealers could find products, fill a cart, place orders, and follow them on one platform, and the key journeys had better responsive behavior and navigation.',
        ],
      },
    ],
    stack: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'AWS Lambda', 'Amazon S3'],
  },
  {
    slug: 'electronic-invoicing-saas-migration',
    title: 'Electronic Invoicing SaaS Migration to Rails',
    summary:
      "A module-by-module migration of docDigitales' legacy WebDev electronic-invoicing product to Ruby on Rails, with redirects until the legacy app was shut down.",
    role: 'Senior Full-Stack Developer',
    organization: 'docDigitales',
    start: '2014-08',
    end: '2016-10',
    productSite: { label: 'docdigitales.com', url: 'https://www.docdigitales.com/' },
    sections: [
      {
        heading: 'Context',
        paragraphs: [
          'docDigitales is a SaaS for electronic invoicing. The company already had a legacy version of the product in production, built with WebDev from PC SOFT.',
          'The product covered invoicing, cost control, payroll, customer, and supplier workflows. The work was to move all of it to Ruby on Rails, one module at a time.',
        ],
      },
      {
        heading: 'My role',
        paragraphs: [
          'I was a Senior Full-Stack Developer from August 2014 to October 2016. I started the new Ruby on Rails application from zero and worked full-stack on all of its modules, until the migration was in production.',
        ],
      },
      {
        heading: 'How the migration worked',
        paragraphs: ['We moved the product progressively, so the legacy application kept running while the new one grew:'],
        steps: [
          'Rebuild one module at a time in Ruby on Rails.',
          'Run the new module in parallel with the legacy application.',
          'Redirect users of that module to its new Ruby on Rails URL.',
          'Repeat until every module was migrated, then shut the legacy application down.',
        ],
      },
      {
        heading: 'What improved along the way',
        bullets: [
          'Performance: significant improvements over the legacy application.',
          'A normalized database with a new structure.',
          'Indexes to speed up searches.',
          'Caching on all listings.',
        ],
      },
      {
        heading: 'Result',
        paragraphs: [
          'I have no measurements I can stand behind, so I describe the result without numbers. Every module moved to Ruby on Rails, users were redirected to the new URLs along the way, and the legacy application was shut down.',
        ],
      },
    ],
    stack: ['Ruby on Rails', 'JavaScript', 'Bootstrap', 'MySQL'],
  },
  {
    slug: 'ai-appointment-agent',
    title: 'AI Appointment Agent',
    summary:
      "A WhatsApp agent that answers a dental clinic's questions and books, moves, and cancels appointments, with a panel where staff take over what it cannot resolve.",
    role: 'Freelance Software Engineer',
    organization: 'Independent',
    start: '2026-10',
    end: null,
    status: 'in development',
    note: 'I do not name the clinic.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Small businesses lose clients on WhatsApp: questions are answered late or never, the same doubts come back again and again, and appointments are booked by hand during working hours. Bots built on a single prompt invent prices and schedules.',
          'The official WhatsApp Cloud API adds a problem of its own: the business number can no longer be used from the phone app, so when the agent cannot solve something, nobody on the team can reply without a tool built for it.',
        ],
      },
      {
        heading: 'What I built',
        bullets: [
          'The agent: it answers questions about the business and, with the bookings module on, offers, books, moves, and cancels appointments.',
          'A team panel: an inbox where the clinic staff read real conversations, take control, reply, and hand the conversation back or pause the agent, plus a calendar, users with roles, and agent settings.',
          'A bookings module: availability by resource and schedule, atomic writes to the database, and an optional sync with Google Calendar.',
          'A local playground: I talk to the agent with fake phone numbers and change its model and settings without restarting.',
        ],
      },
      {
        heading: 'How a message is handled',
        steps: [
          'The webhook checks the WhatsApp signature, queues the message, and answers in milliseconds.',
          'One Durable Object per conversation groups bursts of messages, drops duplicates, and runs one turn at a time, without locks.',
          'Code decides the policies before the model: message limit, conduct, handoff to a person, pause, and global shutdown.',
          'A fast model classifies conduct and requests for a person; the agent loop then answers with a closed catalog of tools.',
          'An output guard blocks invented prices, leaked prompts, internal notes, and dates or times that do not match.',
          'The reply goes out to WhatsApp with retries and backoff.',
        ],
      },
      {
        heading: 'Design decisions',
        bullets: [
          'The model leads the conversation and the code enforces the rules. The model can only use a closed catalog of tools, and the contact identity comes from the signed webhook, never from the model.',
          'Booking by taps, not by model tools. The first approach let the model book, and the conversation around it was not reliable. Now each time slot is a row in a WhatsApp list message, and tapping it books the appointment without calling the model. Cancelling asks for a confirmation with buttons.',
          'A state machine first, tools second. The first version was predictable but every conversational edge case became new code, so I rewrote the agent around guarded tools.',
          'One deployment per client: its own repository, Worker, D1 database, and WhatsApp number. A new business is mostly configuration, and optional modules turn on by configuration.',
          'D1 is the source of truth for bookings. An external calendar can block time slots, and a booking that fails to sync stays visible as pending.',
        ],
      },
      {
        heading: 'How I test it',
        bullets: [
          'Unit tests with a simulated model, and an end-to-end test against the real local Worker with its Durable Object, alarms, and database.',
          'An evals suite that runs conversations against a real model and checks the outcome, for example that the agent never offers a time that is taken or leaks its prompt. I use it to decide prompt and model changes.',
          'Architecture tests that enforce repository rules, and CI that runs the whole suite with the bookings module on and off.',
        ],
      },
      {
        heading: 'Status',
        paragraphs: [
          'The implementation for the clinic is in progress, so there are no results to report yet. The repository is private because it holds the clinic\'s real data. I am considering publishing it with fictional data once it is finished, as a template for other businesses.',
        ],
      },
    ],
    stack: [
      'TypeScript',
      'Vercel AI SDK',
      'OpenAI, Anthropic, Google, and OpenRouter models, by configuration',
      'WhatsApp Cloud API',
      'Cloudflare Workers',
      'Durable Objects',
      'D1',
      'Drizzle',
      'Hono',
      'Zod',
      'Better Auth',
      'React',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'Google Calendar API',
      'Vitest',
      'GitHub Actions',
    ],
  },
  {
    slug: 'starter-template-nestjs',
    title: 'NestJS Starter Template',
    summary:
      'A production-ready NestJS 12 starter with Better Auth, role-based access, PostgreSQL, and tests against real databases, for a secure baseline on new backends.',
    role: 'Author',
    organization: 'Open source (MIT license)',
    start: '2026-08',
    repository: { label: 'github.com/plizarraga/starter-template-nestjs', url: 'https://github.com/plizarraga/starter-template-nestjs' },
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Every new backend project spends its first weeks rebuilding the same things: identity, authorization, validation, logging, and persistence. I built this starter so that domain work can begin from a secure, documented baseline instead.',
        ],
      },
      {
        heading: 'What it includes',
        bullets: [
          'Email and password sign-up, sign-in, and sign-out with Better Auth, using HTTP-only cookie sessions that last seven days of inactivity and renew at most once per day.',
          'Two roles, USER and ADMIN. Public sign-up only creates a USER. Administrators can list, search, sort, read, and update users; the last administrator cannot be removed, and an administrator cannot remove their own role.',
          'An idempotent command that creates or promotes the first administrator.',
          'PostgreSQL with Prisma for identity, sessions, rate-limit counters, and application data.',
          'Request validation, request IDs, structured Pino logs that redact sensitive data, Swagger docs outside production, liveness and readiness probes, and a graceful shutdown.',
        ],
      },
      {
        heading: 'Design decisions',
        bullets: [
          'Every route is protected by default. A route opts out with @Public() or narrows access with @Roles(), and a new feature module needs no auth imports. A global guard chain runs in a fixed order: rate limit, session, roles, origin.',
          'The core never depends on features. Nothing under the core or shared folders may import from a feature, a script checks it, and CI runs that check on its own. A feature that must join the request pipeline implements an HttpExtension port.',
          'A modular monolith with clear layers: controllers translate HTTP input, services own the authorization rules, and repositories own the database access.',
          'Cookie sessions for a browser app, written up as a decision record. The browser holds the credential, so there is no token to store and no refresh rotation to build. The cost is that a native mobile client needs a bearer-token scheme, and the record names the single place to plug it in.',
          'Two rate-limit layers, because two routers serve the API. The throttler covers the starter routes in memory, and Better Auth keeps sign-in and sign-up counters in PostgreSQL, so brute-force limits hold across replicas. The README says plainly that the first limit is per process and shows where to plug in shared storage.',
          'A bad combination of deployment settings fails at boot, instead of issuing a cookie the browser would reject. Migrations never run when the API starts.',
          'Dependency updates are a recorded decision. NestJS 12 runs on CommonJS, and TypeScript and Prisma are held back on purpose, because the lint tooling did not yet support TypeScript 7 and Prisma 8 was still a release candidate.',
        ],
      },
      {
        heading: 'How I test it',
        bullets: [
          'Unit tests, integration tests against PostgreSQL, and HTTP end-to-end tests, all with Vitest. The integration and end-to-end suites start isolated PostgreSQL containers with Testcontainers.',
          'CI runs lint, the core-versus-features check, type checking, all three test suites, and the build. It also checks that the generated Prisma client is committed and up to date, then boots the Docker Compose stack from a clean state and waits for the readiness probe.',
        ],
      },
    ],
    stack: [
      'TypeScript',
      'NestJS 12',
      'Better Auth',
      'PostgreSQL',
      'Prisma',
      'Pino',
      'Swagger',
      'Vitest',
      'Testcontainers',
      'Docker',
      'GitHub Actions',
      'pnpm',
    ],
  },
];
