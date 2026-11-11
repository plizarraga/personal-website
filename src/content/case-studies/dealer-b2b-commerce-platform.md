---
order: 2
title: Dealer B2B Commerce Platform
summary: Fender's dealer-facing B2B commerce platform, where I built core Angular experiences for product discovery, catalog, cart, ordering, and order tracking.
role: Senior Frontend Developer
organization: Fender Musical Instruments Corporation
start: '2016-10'
end: '2022-05'
stack:
  - Angular
  - TypeScript
  - Node.js
  - Express.js
  - AWS Lambda
  - Amazon S3
---

## Context

Fender's dealers used a business-to-business commerce platform to find products, browse the catalog, fill a cart, place orders, and follow them after they were placed.

I worked on this one platform for the whole time I was at Fender, from October 2016 to May 2022.

## My role

I was a Senior Frontend Developer. My main work was the Angular frontend. I also worked on parts of the endpoints it used, which were serverless Node.js services running on AWS Lambda.

- I worked with product, backend, and QA in Agile teams to plan, implement, test, and release features for dealers.
- I did code reviews and mentored and onboarded engineers on the team.

## What I built

- Core experiences of the platform: product discovery, catalog, cart, ordering, and order tracking.
- Improved responsive behavior and navigation across the key journeys.
- The connection between those screens and the serverless Node.js services on AWS Lambda.

## How I structured the Angular app

I designed the Angular application so that related code stays together and shared code stays small. These were the rules:

- Business domain first, technical type second. Code was grouped by the business area that owns it, and each screen had its own folder, instead of global folders such as components or services.
- Three top-level areas. The core folder held application-wide infrastructure, the features folder had one folder per business domain, and the shared folder held only code that was reusable across domains and did not depend on any of them.
- Responsibility folders only when needed. A ui folder held presentational components, a data-access folder held API services and state, and a utils folder held pure helpers. I did not create empty folders ahead of time.
- Code lived in the smallest scope that contained all of its users. It moved up to the parent domain, and later to the shared folder, only when real reuse appeared. Sibling screens never depended on each other.

## Result

I have no measurements I can stand behind, so I describe the result without numbers. Dealers could find products, fill a cart, place orders, and follow them on one platform, and the key journeys had better responsive behavior and navigation.
