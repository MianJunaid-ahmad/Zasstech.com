# ZassTech Website

Server-rendered Next.js App Router website based on the company's public homepage, product sections, contact details, logo and legal pages. Six required routes are implemented. Public content is prerendered with revalidation where appropriate; `/contact-us` renders per request and `/api/contact` runs on Node.js. Client code is limited to navigation and the form.

The source legal documents contain unresolved legal-entity/jurisdiction instructions. They are visibly labeled for review, and indexing is disabled by default. This is a working implementation with documented launch dependencies; no SMTP credentials or invented company facts are included.

## Local development

Prerequisites: Node.js 24 LTS (minimum 22), npm and optional Docker. On PowerShell systems that block npm.ps1, use `npm.cmd` instead of `npm`.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Add SMTP values to enable real development delivery. The local rate limiter works in development; production requires the shared Redis REST variables. Without SMTP configuration the form displays an honest unavailable message and retains the enquiry.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run format:check
```

Playwright starts the production server automatically after a build. It checks all pages, six responsive widths, mobile navigation, internal links, 404s, metadata, JSON-LD, server HTML and form UI with an intercepted delivery response. Unit tests exercise the real contact handler with a mocked email module and the Nodemailer transport with a mock. Automated tests do not send email. Actual delivery, Docker, Nginx, TLS and Lighthouse scores require separate infrastructure verification.

## Content and architecture

- `src/data/company.ts`: verified contact and company configuration.
- `src/data/products.ts`: typed, source-attributed catalogue of three products.
- `src/data/navigation.ts`: shared navigation data.
- `src/data/privacy.json` and `terms.json`: text extracted from existing public documents.
- `src/components`: shared layout, shadcn/ui button pattern, server sections and interactive contact form.
- `src/lib`: SEO, Zod validation, TLS SMTP and shared rate limiting.
- `docs/reference/`: public reference source snapshots, excluded from Docker.

No database, CMS, analytics, fabricated testimonials, prices, or product detail pages are added. The reference has product anchors with contact CTAs; the implementation mirrors that behavior. Gradient product illustrations use Lucide rather than unverified photography. Inter is self-hosted through next/font/local. Motion is used only for form status transitions and honors reduced motion.

See [reference audit](docs/reference-audit.md), [implementation plan](docs/implementation-plan.md), [content review](docs/content-review.md), and [deployment guide](docs/deployment.md). For Docker deployment, configure `.env`, then run `docker compose up -d --build` behind the provided Nginx configuration.
