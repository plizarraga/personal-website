---
order: 4
title: AI Appointment Agent
summary: A WhatsApp agent that answers a dental clinic's questions and books, moves, and cancels appointments, with a panel where staff take over what it cannot resolve.
role: Freelance Software Engineer
organization: Independent
start: '2026-10'
end: null
status: in development
note: I do not name the clinic.
stack:
  - TypeScript
  - Vercel AI SDK
  - OpenAI, Anthropic, Google, and OpenRouter models, by configuration
  - WhatsApp Cloud API
  - Cloudflare Workers
  - Durable Objects
  - D1
  - Drizzle
  - Hono
  - Zod
  - Better Auth
  - React
  - Vite
  - Tailwind CSS
  - shadcn/ui
  - Google Calendar API
  - Vitest
  - GitHub Actions
---

## The problem

Small businesses lose clients on WhatsApp: questions are answered late or never, the same doubts come back again and again, and appointments are booked by hand during working hours. Bots built on a single prompt invent prices and schedules.

The official WhatsApp Cloud API adds a problem of its own: the business number can no longer be used from the phone app, so when the agent cannot solve something, nobody on the team can reply without a tool built for it.

## What I built

- The agent: it answers questions about the business and, with the bookings module on, offers, books, moves, and cancels appointments.
- A team panel: an inbox where the clinic staff read real conversations, take control, reply, and hand the conversation back or pause the agent, plus a calendar, users with roles, and agent settings.
- A bookings module: availability by resource and schedule, atomic writes to the database, and an optional sync with Google Calendar.
- A local playground: I talk to the agent with fake phone numbers and change its model and settings without restarting.

## How a message is handled

1. The webhook checks the WhatsApp signature, queues the message, and answers in milliseconds.
2. One Durable Object per conversation groups bursts of messages, drops duplicates, and runs one turn at a time, without locks.
3. Code decides the policies before the model: message limit, conduct, handoff to a person, pause, and global shutdown.
4. A fast model classifies conduct and requests for a person; the agent loop then answers with a closed catalog of tools.
5. An output guard blocks invented prices, leaked prompts, internal notes, and dates or times that do not match.
6. The reply goes out to WhatsApp with retries and backoff.

## Design decisions

- The model leads the conversation and the code enforces the rules. The model can only use a closed catalog of tools, and the contact identity comes from the signed webhook, never from the model.
- Booking by taps, not by model tools (planned, not built yet). Today the model books through guarded tools, and the conversation around them is not reliable. The plan is that each time slot becomes a row in a WhatsApp list message and tapping it books the appointment without calling the model, while cancelling asks for a confirmation with buttons.
- A state machine first, tools second. The first version was predictable but every conversational edge case became new code, so I rewrote the agent around guarded tools.
- One deployment per client: its own repository, Worker, D1 database, and WhatsApp number. A new business is mostly configuration, and optional modules turn on by configuration.
- D1 is the source of truth for bookings. An external calendar can block time slots, and a booking that fails to sync stays visible as pending.

## How I test it

- Unit tests with a simulated model, and an end-to-end test against the real local Worker with its Durable Object, alarms, and database.
- An evals suite that runs conversations against a real model and checks the outcome, for example that the agent never offers a time that is taken or leaks its prompt. I use it to decide prompt and model changes.
- Architecture tests that enforce repository rules, and CI that runs the whole suite with the bookings module on and off.

## Status

The implementation for the clinic is in progress, so there are no results to report yet. The repository is private because it holds the clinic's real data. I am considering publishing it with fictional data once it is finished, as a template for other businesses.
