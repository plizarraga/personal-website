---
order: 1
title: Healthcare Platform
summary: "The GraphQL backend of a patient-facing healthcare app: doctor search, appointments, and lab results from Epic FHIR, in an Apollo Federation graph."
role: Senior Software Engineer
organization: Publicis Sapient
start: '2024-03'
end: '2026-08'
note: I do not name the client.
stack:
  - TypeScript
  - Node.js
  - Apollo Server
  - Apollo Federation
  - GraphQL
  - PostgreSQL
  - Epic FHIR
  - Jest
  - Vitest
  - GitHub Actions
  - Bitrise
---

## Context

A patient-facing web and mobile app for people with a medical-expenses insurance plan. Patients search for doctors and schedule appointments, follow each appointment, read lab results and notifications, and add their children or dependents to see their profiles.

The backend was a GraphQL graph built with Apollo Federation and split into several subgraphs. All the clinical data (appointments, lab results, doctors) came from Epic through its FHIR APIs.

## My role

I worked on the backend as a Senior Software Engineer at Publicis Sapient. I owned these parts of the graph:

- The subgraph for doctor search and doctor details.
- System notifications.
- The cache of Epic data.
- The joins between Epic data and the other subgraphs.
- Parsing Epic data into normalized domain models.

## How a doctor lookup worked

Searching for doctors and opening their details meant many calls to Epic. This is how I kept them down:

1. Start from the patient's medical record.
2. Fetch the practitioner's details (the FHIR term for a doctor) from Epic.
3. Link the practitioner with the data in another subgraph.
4. Cache the result in PostgreSQL, so Epic is not called more than needed.

## Data and storage

- From Epic FHIR: Practitioner, Patient, Appointment, DiagnosticReport, and Observation resources, plus lab tests and medications.
- In PostgreSQL: notifications, preferences, and the cache of Epic practitioner data.

## Delivery

- I tested the services with Jest and Vitest and worked with the frontend, mobile, QA, product, and engineering teams.
- I helped the React Native mobile team move its Android and iOS build and deployment pipelines from GitHub Actions to Bitrise.

## Result

I have no measurements I can stand behind, so I describe the result without numbers. The backend served an app where patients could find doctors, follow their appointments, and read lab results and notifications, and the cache meant that repeated doctor searches and detail views did not each need a call to Epic.
