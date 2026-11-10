/**
 * Every fact on the site comes from this file, and every fact in this file comes from the
 * CV Master (`master/CV_MASTER.md` in the private career repo). Add nothing that the CV Master
 * does not state; when the CV Master changes, update this file by hand.
 */

/** A date as `YYYY` or `YYYY-MM`. */
export type PartialDate = string;

export interface Link {
  label: string;
  url: string;
}

export interface Project {
  name: string;
  /** Qualifier shown next to the name, such as "in development". */
  status?: string;
  start: PartialDate;
  /** `null` means the project is ongoing; omit it for a single date. */
  end?: PartialDate | null;
  url?: string;
  /** Slug of the case study that tells this project in full, if there is one. */
  caseStudySlug?: string;
  bullets: string[];
  environment?: string[];
}

export interface Role {
  title: string;
  company: string;
  location: string;
  start: PartialDate;
  /** `null` means the role is current. */
  end: PartialDate | null;
  bullets: string[];
  projects: Project[];
  environment?: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date?: PartialDate;
}

/** Date the CV Master was last rebuilt; shown as the site's last update. */
export const lastUpdated = '2026-11-10';

export const profile = {
  name: 'Pedro Lizárraga',
  givenName: 'Pedro',
  familyName: 'Lizárraga',
  alternateNames: ['Pedro Lizárraga Brambila', 'Pedro Lizarraga'],
  headline: 'Senior Software Engineer | Full-Stack',
  jobTitle: 'Senior Software Engineer',
  location: 'Mexicali, Baja California, Mexico',
  workMode: 'Remote',
  email: 'hello@pedrolizarraga.com',
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/pedro-lizarraga-brambila' },
  github: { label: 'GitHub', url: 'https://github.com/plizarraga' },
  /** One sentence for meta descriptions, Open Graph, and structured data. */
  shortBio:
    'Senior Full-Stack Software Engineer with 15+ years building web applications with TypeScript, Node.js, React, Angular, and GraphQL.',
  /** The two Differentiators, phrased for the home page hero. */
  differentiators:
    'Most recently, I built GraphQL and Node.js services over Epic FHIR for a healthcare platform, and I am building AI agents with the Vercel AI SDK.',
  /** Third-person summary for machine readers, such as `/llms.txt`. */
  thirdPersonBio:
    'Pedro Lizárraga is a Senior Software Engineer based in Mexicali, Baja California, Mexico, working remotely, with 15+ years of experience building web applications with TypeScript, Node.js, React, Angular, and GraphQL. Most recently he built GraphQL and Node.js services over Epic FHIR for a healthcare platform, and he is building AI agents with the Vercel AI SDK.',
} as const;

export const summary: string[] = [
  "I'm Pedro Lizárraga, a Senior Software Engineer with 15+ years of experience building scalable, reliable web applications across healthcare, e-commerce, finance, transportation, and government. I specialize in TypeScript, Node.js, NestJS, React, Angular, GraphQL, AWS, Azure, and Epic FHIR integrations, and I hold the Apollo Graph Developer – Associate certification.",
  'I also build AI agents with the Vercel AI SDK as a freelancer, and I conduct code reviews and mentor engineers in cross-functional Agile teams.',
];

export const skills: SkillGroup[] = [
  {
    label: 'Languages & Frameworks',
    items: ['TypeScript', 'JavaScript', 'Node.js', 'NestJS', 'Express.js', 'React', 'Next.js', 'Angular', 'Hono', 'Python', 'Ruby on Rails', 'C#', 'ASP.NET/.NET'],
  },
  {
    label: 'APIs & Architecture',
    items: ['GraphQL', 'Apollo Server', 'Apollo Federation', 'REST', 'system design', 'software architecture', 'design patterns'],
  },
  {
    label: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle', 'Cloudflare D1', 'Prisma', 'Drizzle'],
  },
  {
    label: 'Cloud',
    items: ['AWS Lambda', 'Amazon S3', 'Microsoft Azure (Azure AI Search, Azure Blob Storage)', 'Cloudflare Workers'],
  },
  {
    label: 'AI Engineering',
    items: ['AI agents', 'LLM applications', 'OpenAI APIs', 'Vercel AI SDK', 'tool calling', 'RAG', 'workflow automation'],
  },
  {
    label: 'Testing & Delivery',
    items: ['Jest', 'Vitest', 'Playwright', 'Testcontainers', 'Docker', 'GitHub Actions', 'Bitrise', 'Azure DevOps', 'Git', 'CI/CD', 'Agile', 'Scrum', 'Kanban', 'Jira'],
  },
  {
    label: 'Healthcare',
    items: ['HL7 FHIR', 'Epic FHIR', 'healthcare data transformation, mapping, and normalization'],
  },
];

export const roles: Role[] = [
  {
    title: 'Freelance Software Engineer',
    company: 'Independent',
    location: 'Remote, Mexicali, Baja California, Mexico',
    start: '2022-05',
    end: null,
    bullets: [],
    projects: [
      {
        name: 'AI Appointment Agent for a Dental Clinic',
        status: 'in development',
        start: '2026-10',
        end: null,
        bullets: [
          'Developing an AI agent that books, cancels, and reschedules appointments for a dental clinic through Telegram.',
          'Implemented tool calling and structured output with the Vercel AI SDK and OpenAI models, validated by an automated evals suite.',
          'Built the backend on Cloudflare Workers, D1, and Hono, with Vitest tests and a GitHub Actions CI pipeline.',
          'Designed the solution as a reusable template (WhatsApp Business API variant included) to adapt it to other business niches.',
        ],
        environment: ['TypeScript', 'Vercel AI SDK', 'OpenAI APIs', 'Cloudflare Workers', 'D1', 'Drizzle', 'Hono', 'Telegram Bot API', 'WhatsApp Business API', 'Vitest', 'GitHub Actions'],
      },
    ],
  },
  {
    title: 'Senior Software Engineer',
    company: 'Publicis Sapient',
    location: 'Remote, Mexicali, Baja California, Mexico',
    start: '2022-05',
    end: '2026-08',
    bullets: ['Conducted code reviews and mentored and onboarded engineers joining the projects.'],
    projects: [
      {
        name: 'Healthcare Platform',
        start: '2024-03',
        end: '2026-08',
        caseStudySlug: 'healthcare-platform',
        bullets: [
          'Built GraphQL and Node.js services in TypeScript for a patient-facing healthcare web and mobile app (doctor search, appointments, lab results, notifications, dependents), owning the doctor search and details subgraph, system notifications, and caching in an Apollo Federation graph.',
          'Integrated Epic FHIR APIs (Practitioner, Patient, Appointment, DiagnosticReport, Observation, plus lab tests and medications), parsing source payloads into normalized domain models and joining Epic data with other subgraphs.',
          'Designed PostgreSQL models for notifications, preferences, and a cache of Epic practitioner data that avoids unnecessary Epic calls, plus GraphQL schemas and resolver patterns.',
          'Strengthened delivery quality through Jest and Vitest test suites and cross-functional collaboration with frontend, mobile, QA, product, and engineering teams.',
          'Helped the React Native mobile team migrate Android and iOS build and deployment pipelines from GitHub Actions to Bitrise.',
        ],
        environment: ['TypeScript', 'Node.js', 'Apollo Server', 'Apollo Federation', 'GraphQL', 'PostgreSQL', 'Epic FHIR', 'Jest', 'Vitest', 'GitHub Actions', 'Bitrise'],
      },
      {
        name: 'Document Search API',
        start: '2023-09',
        end: '2024-02',
        bullets: [
          'Built a REST API with NestJS that enables search over proprietary documents using Azure AI Search semantic search and Azure Blob Storage.',
        ],
        environment: ['NestJS', 'REST', 'Azure AI Search', 'Azure Blob Storage'],
      },
      {
        name: 'AngularJS Migration',
        start: '2022-09',
        end: '2023-08',
        bullets: ['Migrated an AngularJS (Angular 1) application to Angular 2+.'],
        environment: ['AngularJS', 'Angular'],
      },
      {
        name: 'HR Reporting Tool',
        start: '2022-05',
        end: '2022-08',
        bullets: ['Built a human-resources reporting tool with React and Vite.'],
        environment: ['React', 'Vite'],
      },
    ],
  },
  {
    title: 'Senior Frontend Developer',
    company: 'Fender Musical Instruments Corporation',
    location: 'Remote, Ensenada, Baja California, Mexico',
    start: '2016-10',
    end: '2022-05',
    bullets: [
      "Built core experiences for Fender's dealer-facing B2B commerce platform, including product discovery, catalog, cart, ordering, and order-tracking workflows.",
      'Designed scalable Angular application structures and improved responsive behavior and navigation across key journeys.',
      'Connected frontend capabilities through GraphQL integrations and serverless Node.js services running on AWS Lambda.',
      'Collaborated with product, backend, and QA functions in Agile teams to plan, implement, test, and release customer-facing capabilities.',
      'Conducted code reviews and mentored and onboarded engineers on the team.',
    ],
    projects: [],
    environment: ['Angular', 'TypeScript', 'GraphQL', 'Node.js', 'Express.js', 'AWS Lambda', 'Amazon S3', 'Agile'],
  },
  {
    title: 'Senior Full-Stack Developer',
    company: 'docDigitales',
    location: 'Mexicali, Baja California, Mexico',
    start: '2014-08',
    end: '2016-10',
    bullets: [
      'Built an electronic-invoicing web platform covering invoicing, cost control, payroll, customer, and supplier workflows.',
      'Implemented full-stack functionality with Ruby on Rails, Python, JavaScript, Bootstrap, and MySQL, balancing usability with dependable business processing.',
    ],
    projects: [],
    environment: ['Ruby on Rails', 'Python', 'JavaScript', 'Bootstrap', 'MySQL'],
  },
  {
    title: 'Full-Stack Developer',
    company: 'Secretaría de Seguridad Pública',
    location: 'Mexicali, Baja California, Mexico',
    start: '2012-04',
    end: '2014-07',
    bullets: [
      'Led development of SAFyS, a web application used to administer and track public-security funds and subsidies.',
      'Automated monthly accounting and reporting activities using C#, ASP.NET/.NET, JavaScript, SQL Server, and Oracle.',
    ],
    projects: [],
    environment: ['C#', 'ASP.NET/.NET', 'JavaScript', 'SQL Server', 'Oracle'],
  },
  {
    title: 'Software Developer',
    company: 'Grupo GM Transport',
    location: 'Mexicali, Baja California, Mexico',
    start: '2011-09',
    end: '2012-03',
    bullets: ['Developed C# and ASP.NET administrative systems supporting transportation operations and back-office processes.'],
    projects: [],
    environment: ['C#', 'ASP.NET'],
  },
  {
    title: 'Software Developer',
    company: 'Seres Soluciones en Software',
    location: 'Mexicali, Baja California, Mexico',
    start: '2010-03',
    end: '2011-08',
    bullets: ['Developed client-server business applications with WinDev, WebDev, MySQL, and HyperFile Classic.'],
    projects: [],
    environment: ['WinDev', 'WebDev', 'MySQL', 'HyperFile Classic'],
  },
];

export const selectedProjects: Project[] = [
  {
    name: 'starter-template-nestjs',
    start: '2026',
    url: 'https://github.com/plizarraga/starter-template-nestjs',
    bullets: [
      'Created a production-ready NestJS 12 starter with Better Auth, PostgreSQL-backed sessions, RBAC, user administration, Prisma, Pino, and Vitest with Testcontainers, to bootstrap new backend projects with consistent best practices.',
    ],
  },
  {
    name: 'finance-tracker',
    start: '2026-01',
    url: 'https://github.com/plizarraga/finance-tracker',
    bullets: [
      'Built a mobile-first personal finance tracker with Next.js (App Router), Prisma, PostgreSQL, Better Auth, and automated tests with Vitest and Playwright.',
    ],
  },
  {
    name: 'RAG Chat over PDFs',
    status: 'personal MVP',
    start: '2024-07',
    bullets: [
      'Built an MVP that answers questions over uploaded PDFs using NestJS, PostgreSQL, OpenAI embeddings and chat completions, and ChromaDB.',
    ],
  },
];

export const certifications: Certification[] = [
  { name: 'Apollo Graph Developer – Associate', issuer: 'Apollo GraphQL', date: '2024-06' },
  { name: 'Modern GraphQL with Node – Complete Developers Guide', issuer: 'Udemy', date: '2024-07' },
  { name: 'TypeScript: Your Complete Guide and Handbook', issuer: 'Udemy' },
  { name: 'Design Patterns in JavaScript and TypeScript', issuer: 'Udemy' },
  { name: 'Clean Code and SOLID Principles', issuer: 'Udemy' },
];

export const education = {
  degree: 'Bachelor of Engineering, Computer Systems Engineering',
  institution: 'Instituto Tecnológico de Mexicali',
  location: 'Mexicali, Mexico',
  start: '2005',
  end: '2009',
};

export const spokenLanguages = ['Spanish', 'English (B2+)'];

/** Topics for the `knowsAbout` property of the Person structured data. */
export const knowsAbout = [
  'TypeScript',
  'Node.js',
  'NestJS',
  'React',
  'Next.js',
  'Angular',
  'GraphQL',
  'Apollo Server',
  'Apollo Federation',
  'PostgreSQL',
  'AWS Lambda',
  'Microsoft Azure',
  'Cloudflare Workers',
  'FHIR',
  'AI agents',
  'Vercel AI SDK',
  'RAG',
];
