---
order: 3
title: Electronic Invoicing SaaS Migration to Rails
summary: A module-by-module migration of docDigitales' legacy WebDev electronic-invoicing product to Ruby on Rails, with redirects until the legacy app was shut down.
role: Senior Full-Stack Developer
organization: docDigitales
start: '2014-08'
end: '2016-10'
productSite:
  label: docdigitales.com
  url: https://www.docdigitales.com/
stack:
  - Ruby on Rails
  - JavaScript
  - Bootstrap
  - MySQL
---

## Context

docDigitales is a SaaS for electronic invoicing. The company already had a legacy version of the product in production, built with WebDev from PC SOFT.

The product covered invoicing, cost control, payroll, customer, and supplier workflows. The work was to move all of it to Ruby on Rails, one module at a time.

## My role

I was a Senior Full-Stack Developer from August 2014 to October 2016. I started the new Ruby on Rails application from zero and worked full-stack on all of its modules, until the migration was in production.

## How the migration worked

We moved the product progressively, so the legacy application kept running while the new one grew:

1. Rebuild one module at a time in Ruby on Rails.
2. Run the new module in parallel with the legacy application.
3. Redirect users of that module to its new Ruby on Rails URL.
4. Repeat until every module was migrated, then shut the legacy application down.

## What improved along the way

- Performance: significant improvements over the legacy application.
- A normalized database with a new structure.
- Indexes to speed up searches.
- Caching on all listings.

## Result

I have no measurements I can stand behind, so I describe the result without numbers. Every module moved to Ruby on Rails, users were redirected to the new URLs along the way, and the legacy application was shut down.
