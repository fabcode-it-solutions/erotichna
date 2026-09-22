# Erotichna — Subscription Content Platform

A full-stack **Next.js** web application built by [The Fabcode](https://thefabcode.com) for a premium, subscription-based content platform. This repository is shared publicly as a **portfolio reference** so prospective clients can review the code quality, architecture, and feature scope of the work delivered.

> **Note:** This is a sanitized, view-only snapshot of the codebase. All backend API routes, server actions, database connections, and integration credentials have been removed before publishing. This repo is **not runnable as-is** and is not the live production source — it exists purely to demonstrate implementation quality. See [LICENSE](./LICENSE).

## What Was Built

- **Public marketing site** — landing pages, model profiles, search/discovery, and content browsing
- **Authentication & accounts** — sign up, login, OTP verification, password reset, Google OAuth
- **Subscriber dashboard** — subscription management, account settings, PIN/security controls
- **Admin dashboard** — content management editor, video/post publishing, analytics views
- **Video delivery** — HLS streaming integration with signed, time-limited playback URLs
- **Payments & subscriptions** — checkout flow, abandoned-checkout recovery, recurring subscription handling
- **Marketing integrations** — newsletter signup and CRM/email automation hooks
- **PWA support** — installable app manifest and icons

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 18 |
| Styling | Tailwind CSS |
| Auth | NextAuth, JWT (jose / jsonwebtoken), bcrypt |
| Data | MongoDB / Mongoose |
| Media | Mux, Bunny CDN, HLS.js |
| Rich content | Jodit / Quill editors |
| Other | Framer Motion, SortableJS, React Google Charts |

## About This Repo

The full application — including all API routes, server actions, database models, and third-party integration logic — lives in a private client repository. What remains here is the front-end architecture, UI components, and page structure, intended to give reviewers a sense of code organization and craftsmanship.

## Contact

Interested in similar work? Reach out via [Upwork](https://www.upwork.com) or [thefabcode.com](https://thefabcode.com).

---

© The Fabcode. All rights reserved. See [LICENSE](./LICENSE) for usage terms.
