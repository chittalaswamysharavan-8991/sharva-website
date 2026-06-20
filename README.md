# Pablo Cockpit

Private LifeOS-style cockpit for Sharavan, with a public AI Automation Builder doorway.

Live site: https://pablo-cockpit.vercel.app

## Use

- Local app: `npm run dev`
- Production build: `npm run build`
- iPhone daily route: `https://pablo-cockpit.vercel.app/home`
- First private route: `/home`
- Public doorway: `/`

## Public Portfolio v1.1

- Public Portfolio v1.1 is live at `https://pablo-cockpit.vercel.app`.
- Public routes now include proof assets on `/`, `/work`, `/make-portfolio`, and `/contact`.
- Proof assets include real website screenshots, demo placeholders, and a walkthrough video.
- The contact page stays placeholder-only unless an approved public contact destination is added.
- Public privacy rules remain active, so the site does not expose private cockpit, connector, or personal data.

## What Works In v1

- Private cockpit routes for Home, Today, Capture, Pablo, Memory, Body, Money, Build Lab, and Night Close.
- Public routes for Public, Work, Make Portfolio, and Contact.
- Persistent local state for captures, Today tasks, proof checklist, and Night Close.
- iPhone-ready PWA metadata with manifest, app icons, service worker, safe-area layout, and home-screen title.
- Mocked connector snapshots only. No live Gmail, Calendar, Drive, Notion, money, health, or family data is synced.
- The public portfolio now shows honest proof labels for live screenshots, demo placeholders, and walkthrough video without implying private workflow access.

## v2 Security Foundation

- Private routes now require Supabase configuration and an allowlisted signed-in owner.
- Public routes remain open.
- `.env.example` documents required public Supabase client variables.
- `supabase/migrations/001_v2_auth_vault.sql` defines owner profiles, cockpit items, connector accounts, sync events, portfolio records, and RLS policies.
- `/sync-settings` shows connector rollout status, server readiness, and privacy rules before live sync is enabled.
- Authenticated and allowlisted users load/save private cockpit state through Supabase `cockpit_items`; local storage becomes a cache.
- `api/connector-status.js` and `api/sync-gate.js` establish server-only connector boundaries before live Notion, Calendar, Drive, Make, or Gmail sync.
- `/sync-settings` shows the v2 to v5 connector phase map and the privacy boundaries for each rollout.
- `/sync-settings` now also shows a v3 readiness panel plus per-connector state cards for Google Calendar and Notion before live sync is fully verified.
- Those v3 cards surface connection state, server readiness, allowed data classes, and last sync time without exposing raw source content.
- Connector account rows now exist for `supabase_vault`, `notion`, and `google_calendar`, and the live OAuth routes now use an owner-scoped connector session plus RLS-backed token writes.
- `docs/connector-setup-guide.md` contains the tap-by-tap setup path for Supabase, Google Calendar, Notion, and the missing app routes.
- The HTML shell and app both redirect the legacy `lifeos-dashboard-ecru-five.vercel.app` host to the canonical `pablo-cockpit.vercel.app` host.
- `/today` now shows a live planning snapshot for the current Calendar focus block and BuildOS handoff.
- `api/v3-feed.js` exposes the read-only v3 planning feed used by the Today screen.
- The Today feed now shows source-backed Calendar and BuildOS chips so the daily plan is easier to scan.
- The legacy `lifeos-dashboard-ecru-five.vercel.app` host now aliases to the live Vercel deployment.
- Signed-in owners land on `/home` automatically on the canonical host after Google OAuth completes.

## Current Setup Evidence

- Vercel project is linked to `chittalaswamysharavan-7613s-projects/pablo-cockpit`.
- Production now has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Supabase v2 migration `v2_auth_vault` is applied to the live project.
- The owner allowlist row exists for the current Sharavan auth user.
- A live Google OAuth session now opens the private routes and persists task changes back to the Supabase vault.
- Supabase CLI on this machine still needs `supabase login` or `SUPABASE_ACCESS_TOKEN` before project details can be read locally.

## Privacy Rules

Public pages must never expose raw family details, exact money amounts, health logs, email content, addresses, tokens, phone numbers, or private connector data.

## Documentation Agent

The Documentation Agent owns:

- Route inventory and current behavior.
- BuildOS project summary and links.
- Launch checklist and QA evidence.
- Privacy rule updates.
- Future connector backlog.

See `docs/documentation-agent.md`.

## Planning Docs

- `docs/v2-auth-sync-plan.md`
- `docs/v2-v5-connector-roadmap.md`
- `docs/agent-orchestrator.md`
- `docs/buildos-pablo-cockpit.md`
