/**
 * Case studies, one page each at `/work/<slug>`. Like `cv.ts`, every fact here comes from the
 * CV Master or from answers the user gave in an interview and confirmed. Never add a number
 * the user has not confirmed, and never name a client the user keeps private.
 */
import type { PartialDate } from './cv';

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
  end: PartialDate | null;
  /** Qualifier shown after the dates, such as "in development". */
  status?: string;
  /** Short line under the title, such as "Client not named". */
  note?: string;
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
    slug: 'ai-appointment-agent',
    title: 'AI Appointment Agent',
    summary:
      'A WhatsApp agent for a dental clinic that answers patient questions and books, moves, and cancels appointments, with a panel where the clinic team takes over what the agent cannot resolve.',
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
];
