# Deployment

## Release prerequisites

Complete `docs/content-review.md`. Real email delivery requires owner-provided SMTP credentials. No credentials are included. Configure a shared Redis REST endpoint (Upstash-compatible) for production rate limiting; the contact endpoint returns 503 when the shared store is unavailable. Public pages remain available. Do not launch a public legal document while it contains unresolved draft details.

Use Node.js 24 LTS and npm. The lockfile selects reproducible dependency versions. Latest stable Next.js available from the registry at implementation time was 16.4.2.

## Environment

Copy `.env.example` to `.env` (Docker) or `.env.local` (local Node). Keep secrets out of Git and image build arguments. Restrict the file to the service user.

| Variable                    | Purpose                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| NEXT_PUBLIC_SITE_URL        | Absolute canonical origin, e.g. https://zasstech.com. Set at build and runtime; it also controls form origin validation. |
| SMTP_HOST, SMTP_PORT        | Provider host and port; usually 587 for STARTTLS or 465 for implicit TLS.                                                |
| SMTP_SECURE                 | `true` for 465; `false` for STARTTLS, which is required rather than opportunistic.                                       |
| SMTP_USER, SMTP_PASSWORD    | Provider-issued credentials, server only.                                                                                |
| CONTACT_TO_EMAIL            | Approved recipient mailbox.                                                                                              |
| CONTACT_FROM_EMAIL          | Verified sender mailbox on your sending domain. Visitor email is reply-to only.                                          |
| RATE_LIMIT_REDIS_REST_URL   | HTTPS Redis REST endpoint, server only.                                                                                  |
| RATE_LIMIT_REDIS_REST_TOKEN | Scoped Redis REST credential, server only.                                                                               |
| SITE_INDEXABLE              | `false` for preview; `true` after content/legal approval. Requires rebuild.                                              |

Use SPF, DKIM and DMARC as instructed by the SMTP provider. Permit outbound access only to required SMTP/HTTPS destinations. Verify receipt in a controlled owner test before launch. Configuration alone does not establish successful delivery or inbox placement.

## Docker on a VPS

Install Docker Engine and Compose, then from the repository:

```sh
cp .env.example .env
# Edit .env with approved production values.
docker compose up -d --build
docker compose logs --tail=100 web
```

Only loopback port 3000 is exposed. The container runs as a non-root user, drops capabilities, has a health check, and includes Next.js standalone output. Never pass SMTP secrets as build arguments. Rebuild when changing the public origin, indexing flag or public content.

## Node.js without Docker

```sh
npm ci
npm run build
npm run start
```

Provide environment through a systemd EnvironmentFile or a protected `.env.production.local`. Keep the service running under a dedicated unprivileged user, with `Restart=on-failure`, `WorkingDirectory` set to this checkout, and `ExecStart=/usr/bin/node scripts/start.mjs`. The start helper copies public/static assets into the standalone bundle and binds to loopback by default. Set BIND_HOST only when an explicitly different interface is needed. The direct Node deployment retains the checkout; Docker copies the same standalone bundle and assets at build time.

## Nginx, DNS and HTTPS

Point the domain's A/AAAA records to the VPS. Install Nginx and start from `docs/nginx.conf`; replace the hostname when deploying elsewhere. Enable the configuration, run `nginx -t`, then reload Nginx. Install Certbot and run `certbot --nginx -d zasstech.com -d www.zasstech.com`; choose HTTPS redirection and verify automated renewal. Add `Strict-Transport-Security: max-age=31536000` only after HTTPS works reliably. Enable `includeSubDomains` only if every subdomain supports HTTPS. Redirect the secondary hostname to the canonical origin after certificates cover both.

The Node port must never be accessible from the public network. Nginx must overwrite `X-Real-IP`, as the supplied config does. The rate limiter uses that trusted value, hashes it and atomically allows five requests per ten minutes across application instances. If another CDN/proxy sits in front of Nginx, configure real-IP restoration with only that provider's trusted CIDRs before launch; otherwise users may share a limit. Do not trust arbitrary incoming forwarded headers.

Monitor health, aggregate 5xx counts and SMTP delivery without recording request bodies or secrets. Set infrastructure log retention and access controls consistent with the approved privacy notice. No client telemetry is installed. The CSP allows inline scripts for Next.js hydration; stronger nonce-based CSP can be introduced with request-time rendering if required.

## Release verification and rollback

Run typecheck, lint, unit tests, build and Playwright before replacing the running image. Check six routes, canonical origin, robots/sitemap, logo, keyboard navigation and a controlled SMTP delivery. Retain the previous container image and environment. Roll back by deploying the previous image/tag and matching environment. Docker/HTTPS/live SMTP were not verified until explicitly tested in the target infrastructure.
