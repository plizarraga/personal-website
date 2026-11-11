---
order: 5
title: NestJS Starter Template
summary: A production-ready NestJS 12 starter with Better Auth, role-based access, PostgreSQL, and tests against real databases, for a secure baseline on new backends.
role: Author
organization: Open source (MIT license)
start: '2026-08'
repository:
  label: github.com/plizarraga/starter-template-nestjs
  url: https://github.com/plizarraga/starter-template-nestjs
stack:
  - TypeScript
  - NestJS 12
  - Better Auth
  - PostgreSQL
  - Prisma
  - Pino
  - Swagger
  - Vitest
  - Testcontainers
  - Docker
  - GitHub Actions
  - pnpm
---

## The problem

Every new backend project spends its first weeks rebuilding the same things: identity, authorization, validation, logging, and persistence. I built this starter so that domain work can begin from a secure, documented baseline instead.

## What it includes

- Email and password sign-up, sign-in, and sign-out with Better Auth, using HTTP-only cookie sessions that last seven days of inactivity and renew at most once per day.
- Two roles, USER and ADMIN. Public sign-up only creates a USER. Administrators can list, search, sort, read, and update users; the last administrator cannot be removed, and an administrator cannot remove their own role.
- An idempotent command that creates or promotes the first administrator.
- PostgreSQL with Prisma for identity, sessions, rate-limit counters, and application data.
- Request validation, request IDs, structured Pino logs that redact sensitive data, Swagger docs outside production, liveness and readiness probes, and a graceful shutdown.

## Design decisions

- Every route is protected by default. A route opts out with @Public() or narrows access with @Roles(), and a new feature module needs no auth imports. A global guard chain runs in a fixed order: rate limit, session, roles, origin.
- The core never depends on features. Nothing under the core or shared folders may import from a feature, a script checks it, and CI runs that check on its own. A feature that must join the request pipeline implements an HttpExtension port.
- A modular monolith with clear layers: controllers translate HTTP input, services own the authorization rules, and repositories own the database access.
- Cookie sessions for a browser app, written up as a decision record. The browser holds the credential, so there is no token to store and no refresh rotation to build. The cost is that a native mobile client needs a bearer-token scheme, and the record names the single place to plug it in.
- Two rate-limit layers, because two routers serve the API. The throttler covers the starter routes in memory, and Better Auth keeps sign-in and sign-up counters in PostgreSQL, so brute-force limits hold across replicas. The README says plainly that the first limit is per process and shows where to plug in shared storage.
- A bad combination of deployment settings fails at boot, instead of issuing a cookie the browser would reject. Migrations never run when the API starts.
- Dependency updates are a recorded decision. NestJS 12 runs on CommonJS, and TypeScript and Prisma are held back on purpose, because the lint tooling did not yet support TypeScript 7 and Prisma 8 was still a release candidate.

## How I test it

- Unit tests, integration tests against PostgreSQL, and HTTP end-to-end tests, all with Vitest. The integration and end-to-end suites start isolated PostgreSQL containers with Testcontainers.
- CI runs lint, the core-versus-features check, type checking, all three test suites, and the build. It also checks that the generated Prisma client is committed and up to date, then boots the Docker Compose stack from a clean state and waits for the readiness probe.
