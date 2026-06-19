# PRODUCT_BASELINE

## Task ID

`task-006-product-baseline-map`

## Product Summary

Pablo Cockpit appears to be a private, owner-only LifeOS-style operating cockpit for Sharavan, paired with a public-facing AI automation portfolio doorway.

The main user-facing purpose in the current codebase is split into two surfaces:

* A public website that introduces Sharavan's AI automation work and links to work, portfolio, and contact pages.
* A private authenticated cockpit that tracks daily work, captures, memory, body signals, money reminders, build workflow progress, and connector readiness.

## Tech Stack

* Frontend framework: React
* Build tool: Vite
* Styling approach if visible: plain CSS with `styles.css` plus design tokens in `design-tokens.css`
* Backend/API approach: Vercel serverless API routes under `api/`
* Auth/data/storage services: Supabase Auth and Supabase database via `@supabase/supabase-js`
* Deployment-related config: Vercel via `vercel.json`, plus GitHub Actions in `.github/workflows/check.yml`

## Current App Structure

* `src/`: React app entrypoint, route logic, hooks, private/public screens, and UI components.
* `src/screens/`: top-level page/screen components for private and public routes.
* `src/components/`: shell UI, auth gate, rails, panels, metrics, and supporting UI pieces.
* `src/hooks/`: custom app state, auth, route, readiness, connector, and planning hooks.
* `src/dataVault.js`: Supabase-backed read/write helpers for cockpit state and sync events.
* `src/supabaseClient.js`: browser Supabase client bootstrap and profile lookup.
* `api/`: serverless API routes for readiness, planning feed, sync gate, Notion, and Google Calendar.
* `api/_lib/connector-auth.js`: shared server-side auth, token, OAuth, sync, and connector utility layer.
* `supabase/migrations/`: visible SQL migration for the v2 auth and privacy vault schema.
* `tests/`: Playwright end-to-end QA coverage.
* `public/`: PWA manifest, service worker, icons, and screen assets.
* `docs/`: project notes, connector plans, workflow docs, and implementation guidance.
* `reports/`: per-task role-specific reports.
* `.github/workflows/`: CI workflow running the readiness check.

## Pages / Routes

| Route / page | Source file/component | Purpose | Auth required? | Notes |
| --- | --- | --- | --- | --- |
| `/` | `src/screens/PublicDoorway.jsx` | Public landing page for AI automation work | no | Main public doorway |
| `/work` | `src/screens/WorkScreen.jsx` | Public work/projects overview | no | Uses `projects` from shared state |
| `/make-portfolio` | `src/screens/MakePortfolioScreen.jsx` | Public Make.com portfolio/case-study view | no | Public portfolio proof page |
| `/contact` | `src/screens/ContactScreen.jsx` | Public contact page | no | Privacy-first contact framing |
| `/home` | `src/screens/HomeScreen.jsx` | Private cockpit dashboard/home | yes | Auto-landing target after auth |
| `/today` | `src/screens/TodayScreen.jsx` | Private daily planning and focus view | yes | Reads planning snapshot feed |
| `/capture` | `src/screens/CaptureScreen.jsx` | Private inbox/capture entry and routing | yes | Local and Supabase-backed state |
| `/pablo` | `src/screens/PabloScreen.jsx` | Private Pablo behavior/command contract screen | yes | Static guidance-style content |
| `/memory` | `src/screens/MemoryScreen.jsx` | Private memory shelf | yes | Shows routed memory items |
| `/body` | `src/screens/BodyScreen.jsx` | Private body signal logging | yes | Uses mock/default state |
| `/money` | `src/screens/MoneyScreen.jsx` | Private invoice/payment reminder shelf | yes | Uses simulated invoice data |
| `/build-lab` | `src/screens/BuildLabScreen.jsx` | Private build sprint/project inspector | yes | Case-study export framing |
| `/sync-settings` | `src/screens/SyncSettingsScreen.jsx` | Private connector/auth/readiness screen | yes | Main connector rollout and OAuth entry UI |
| `/night-close` | `src/screens/NightCloseScreen.jsx` | Private end-of-day checklist | yes | Uses persisted checklist state |
| unknown route while unlocked | `src/screens/NotFoundScreen.jsx` | Private not-found screen | yes | Only renders when authenticated |
| unknown route while locked | `src/components/AuthGate.jsx` | Locked private-route gate | yes | Unknown public routes do not have a visible custom 404 path in `main.jsx`; pending verification |

## Components

Important components and likely purpose:

* `PrivateRail.jsx`: left-side private navigation rail for cockpit routes.
* `PublicBar.jsx`: top public navigation bar for `/`, `/work`, `/make-portfolio`, and `/contact`.
* `CommandBar.jsx`: private top bar showing auth/vault status and navigation actions.
* `AuthGate.jsx`: owner auth wall and Supabase readiness messaging for locked private routes.
* `ReadinessPanel.jsx`: renders connector/server readiness summary.
* `AtlasMap.jsx`: visual "life shelves" map on the home dashboard.
* `SourceStrip.jsx`: planning/source summary strip on private screens.
* `Panel.jsx`: shared panel wrapper used across screens.
* `Metric.jsx`: small dashboard metric display.
* `Toast.jsx`: transient notification display.
* `ConfirmDialog.jsx`: generic confirm modal pattern.
* `FocusTimer.jsx`: simple timer utility within the cockpit.
* `LoadingSkeleton.jsx`: loading placeholder for lazy screens.
* `InstallPanel.jsx`: install/PWA support UI.
* `EmptyState.jsx`: empty-state helper component.

## Auth Flow

The visible auth flow is:

* Browser boot loads `useAuthSession`, which checks whether `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present.
* If Supabase is not configured, private routes stay locked behind an "Supabase is not configured yet" auth gate.
* If Supabase is configured, the browser client calls `supabase.auth.getSession()` and subscribes to auth changes.
* Signed-in access is not enough by itself. The code also checks `cockpit_profiles` for an enabled owner row.
* `isUnlocked` becomes true only when there is a valid session and `profile.is_enabled` is true.
* Private routes are rendered only when `auth.isUnlocked` is true.
* When signed in from `/`, the app redirects to `/home`.
* Google sign-in is started with `supabase.auth.signInWithOAuth({ provider: "google" })`.
* The auth redirect target is hardcoded to `https://pablo-cockpit.vercel.app/home`.
* Sign-out uses `supabase.auth.signOut()`.

Protected routes / auth gates:

* `main.jsx` treats `/home`, `/today`, `/capture`, `/pablo`, `/memory`, `/body`, `/money`, `/build-lab`, `/sync-settings`, and `/night-close` as private.
* Locked private routes render the private layout plus `AuthGate`.
* Public routes `/`, `/work`, `/make-portfolio`, and `/contact` remain open.

Unknowns / pending verification:

* Whether auth redirects behave correctly on all local and preview environments. Pending verification.
* Whether Google OAuth provider setup is complete in every deployment environment. Pending verification.
* Whether any non-owner roles such as `agent` or `viewer` are actually used in the current product. Pending verification.

## Supabase Usage

Supabase client location:

* Browser client: `src/supabaseClient.js`
* Browser data helpers: `src/dataVault.js`
* Server-side connector utilities: `api/_lib/connector-auth.js`

Tables or migrations found in visible repo:

* `cockpit_profiles`
* `cockpit_items`
* `connector_accounts`
* `sync_events`
* `portfolio_records`

Environment variables referenced:

* Browser-visible:
  * `VITE_SUPABASE_URL`
  * `VITE_SUPABASE_ANON_KEY`
* Server-only:
  * `SUPABASE_SERVICE_ROLE_KEY`
  * `CONNECTOR_STATE_SECRET`
  * `NOTION_CLIENT_ID`
  * `NOTION_CLIENT_SECRET`
  * `GOOGLE_CLIENT_ID`
  * `GOOGLE_CLIENT_SECRET`
  * `MAKE_API_TOKEN`

Service role usage if present:

* Present in server code. `api/_lib/connector-auth.js` creates an admin client using `SUPABASE_SERVICE_ROLE_KEY`.
* `api/notion/library-sync.js` uses the admin client for automated cron-style sync work.

Browser/client-side usage vs server/API usage:

* Browser side:
  * Supabase auth session check
  * Google OAuth start through Supabase Auth
  * Profile allowlist lookup from `cockpit_profiles`
  * Private state persistence through `cockpit_items`
  * Connector account and sync-event reads/writes through `connector_accounts` and `sync_events`
* Server side:
  * Owner verification using Supabase access token
  * OAuth state/session signing for Notion and Google Calendar
  * Connector token storage and refresh
  * Connector account updates
  * Sync-event writes
  * Automated Notion library sync

Important gap:

* Server code reads and writes a `connector_tokens` table, but no visible migration for `connector_tokens` was found in `supabase/migrations/`. This is a current schema/documentation gap and may indicate a missing migration in the repository.

## API Endpoints

| Endpoint/file | Method if visible | Purpose | Auth/security notes | Pending verification |
| --- | --- | --- | --- | --- |
| `/api/connector-status` via `api/connector-status.js` | `GET` | Returns connector readiness and missing env state | Server-side env inspection only; no secrets returned | Whether all deployment envs match local expectations |
| `/api/sync-gate` via `api/sync-gate.js` | `POST` | Explicitly blocks unsupported live connector sync | Returns `501` for staged connectors; acts as a guardrail | Whether any clients still rely on this legacy gate |
| `/api/v3-feed` via `api/v3-feed.js` | `GET` | Returns planning snapshot data for Today screen | No auth; returns static-looking planning payload | Whether this is truly live-fed or intentionally mocked |
| `/api/planning-snapshot` via `api/planning-snapshot.js` | `GET` | Alternate planning snapshot endpoint with similar payload | No visible frontend consumer found in inspected code | Whether still used anywhere |
| `/api/google-calendar/oauth/start` via `api/google-calendar/oauth/start.js` | `POST` | Starts Google Calendar OAuth flow | Requires signed-in owner access token and connector session cookie setup | End-to-end local and production verification pending |
| `/api/google-calendar/oauth/callback` via `api/google-calendar/oauth/callback.js` | `GET` | Finishes Google OAuth, stores token, triggers initial sync, redirects back to app | Verifies signed state and connector session cookie; uses token storage and sync writes | Full OAuth callback behavior pending verification |
| `/api/google-calendar/sync` via `api/google-calendar/sync.js` | `POST` | Runs signed-in owner's Google Calendar sync | Requires verified owner access token | Live provider behavior pending verification |
| `/api/notion/oauth/start` via `api/notion/oauth/start.js` | `POST` | Starts Notion OAuth flow | Requires signed-in owner access token and connector session cookie setup | End-to-end local and production verification pending |
| `/api/notion/oauth/callback` via `api/notion/oauth/callback.js` | `GET` | Finishes Notion OAuth, stores token, triggers initial sync, redirects back to app | Verifies signed state and connector session cookie; writes connector account and sync events | Full OAuth callback behavior pending verification |
| `/api/notion/sync` via `api/notion/sync.js` | `POST` | Runs signed-in owner's Notion sync | Requires verified owner access token | Live provider behavior pending verification |
| `/api/notion/library-sync` via `api/notion/library-sync.js` | `GET`, `POST` | Manual or automated LibraryOS sync | Can run through signed owner flow or service-role admin flow | Cron execution and required schema coverage pending verification |

## Tests / QA Coverage

Current test files:

* `tests/qa.spec.js`

What they cover:

* Public route rendering for `/`, `/work`, `/make-portfolio`, and `/contact`
* Signed-out lock behavior for all private routes
* Basic mobile responsive checks for the public doorway and auth gate
* Basic request calls to `/api/connector-status` and `/api/sync-gate`

Gaps in coverage:

* No authenticated route tests
* No Supabase live session tests
* No OAuth start/callback tests for Notion or Google Calendar
* No assertions for `/api/v3-feed` or `/api/planning-snapshot`
* No direct coverage of `dataVault.js` persistence behavior
* No tests for service worker behavior or offline/PWA behavior
* No tests confirming connector account, sync-event, or token-table schema assumptions

## Build / CI Status

Current workflow:

* Local readiness command: `npm run check`
* CI workflow: `.github/workflows/check.yml`
* CI triggers: pull requests to `main` and pushes to `main`
* CI steps: `npm ci`, Playwright Chromium install, `npm run check`

Known lint warnings still present:

* `api/_lib/connector-auth.js`: unused functions/args warnings
* `scripts/take_screenshots.js`: unused `fs`
* `src/screens/BuildLabScreen.jsx`: unused imports
* `src/screens/SyncSettingsScreen.jsx`: unused import

## Product Gaps / Unknowns

* The product purpose is understandable at a high level, but end-user workflow definitions are still partly implied by UI copy rather than formal product documentation.
* The Today planning feed looks static in code even though docs describe it as live.
* `api/planning-snapshot.js` appears redundant next to `api/v3-feed.js`; active usage is unclear.
* Server code depends on `connector_tokens`, but no matching visible migration was found.
* The exact live deployment configuration and data readiness for Google Calendar and Notion cannot be verified from repo inspection alone.
* The public route behavior for unknown non-private paths is not explicitly handled in `main.jsx`; pending verification.
* The service worker caches source-file paths like `/src/main.jsx` and `/src/styles.css`, which may not reflect the final production asset model; runtime effect in production is pending verification.
* There is no visible README-level map of which screens are mock/simulated versus truly live-backed.
* No visible test coverage exists for authenticated state transitions, connector OAuth flows, or server-side token refresh behavior.

## Recommended Next Product Tasks

* `task-007-live-vs-mock-state-map`
  * Goal: document every screen, panel, and API surface as `mock`, `hybrid`, or `live`.
  * Why it matters: removes ambiguity around what is real versus staged before feature work starts.
  * Owner: Codex

* `task-008-route-and-product-copy-clarity`
  * Goal: align route labels, screen purpose, and product terminology into one clear information architecture doc.
  * Why it matters: several private shelves are understandable in code, but not yet explained as a coherent product system.
  * Owner: Codex

* `task-009-supabase-schema-completeness-audit`
  * Goal: reconcile server code against visible Supabase migrations, especially `connector_tokens`.
  * Why it matters: missing schema artifacts can break connector features and mislead future development.
  * Owner: Codex

* `task-010-auth-and-oauth-verification-pass`
  * Goal: verify private unlock flow, owner allowlist behavior, and both OAuth connector handshakes end to end.
  * Why it matters: auth and connector trust boundaries are central to the product.
  * Owner: Antigravity

* `task-011-planning-feed-truth-audit`
  * Goal: confirm whether Today data is static, partially live, or fully live, and simplify redundant feed endpoints if needed.
  * Why it matters: planning credibility is a core product promise.
  * Owner: Codex

* `task-012-public-portfolio-proof-baseline`
  * Goal: map public-facing proof assets, portfolio claims, and required supporting evidence for each showcased workflow.
  * Why it matters: the public doorway depends on trustworthy proof, not just descriptive copy.
  * Owner: Antigravity

* `task-013-private-qa-coverage-expansion`
  * Goal: add safe automated coverage for authenticated flows, key APIs, and route fallbacks without introducing fake tests.
  * Why it matters: current QA mostly confirms signed-out and public behavior.
  * Owner: Codex
