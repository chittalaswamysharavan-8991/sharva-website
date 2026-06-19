# LIVE_VS_MOCK_STATE_MAP

## Task ID

`task-007-live-vs-mock-state-map`

## Classification Legend

* LIVE: backed by real data/service/API/auth/storage in current code.
* MOCK: static, placeholder, hardcoded, simulated, or demo-only.
* HYBRID: partly live and partly static/mock.
* UNKNOWN: cannot be confirmed from repository inspection alone.

## Executive Summary

The app is a mixed system rather than a fully live product. The public website and several cockpit screens are mostly static or local-state driven, while Supabase auth/storage and the connector framework are real code paths. The biggest truth gaps are the planning feed, connector-token persistence, and the difference between “live” claims in docs/UI versus what the current API handlers actually return.

Roughly:

* Public marketing pages are mostly MOCK or HYBRID.
* Private cockpit pages are mostly HYBRID.
* Supabase auth/storage is LIVE in browser and server code, but a key token table is missing from visible migrations.
* Connector/OAuth plumbing is HYBRID: the code exists, but full end-to-end live verification is not proven in the repo.
* Today/planning is HYBRID at the UI level and mostly MOCK in the backend data source.

Highest-risk unknowns:

* whether the connector token schema is complete
* whether Google Calendar and Notion flows actually work end to end in production
* whether the “live” planning snapshot is really live or just a static feed with live labels
* whether the public/private route behavior in deployed environments matches the repo claims

## Surface Map

| Surface / page / panel / endpoint | Source file(s) | Classification | Evidence | Risk | Verification needed | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- |
| `/` public doorway | `src/screens/PublicDoorway.jsx`, `src/main.jsx` | HYBRID | Static marketing copy, but project cards come from shared state and route navigation is real | Public proof claims may outpace actual backing data | Verify whether project cards ever pull live records in production | Audit public proof sources and mark live vs simulated content |
| `/work` | `src/screens/WorkScreen.jsx`, `src/main.jsx` | HYBRID | Reads `projects` from shared state, but content is currently local/default data | Public case-study claims can look more real than they are | Verify whether projects persist from Supabase when unlocked | Map which project fields are safe to publish |
| `/make-portfolio` | `src/screens/MakePortfolioScreen.jsx`, `src/main.jsx` | HYBRID | Uses shared `projects`, plus a static screenshot asset | Could imply portfolio evidence that is not dynamically sourced | Verify whether portfolio assets are generated from current proof or just static media | Separate static showcase assets from live proof data |
| `/contact` | `src/screens/ContactScreen.jsx`, `src/main.jsx` | MOCK | Pure static copy and placeholders | Very low; mostly informational | Confirm final public links before publishing | Finalize public contact destinations |
| Public nav shell | `src/components/PublicBar.jsx` | MOCK | Static nav buttons, no data source | Minimal | None beyond UI behavior | Leave as shell-only unless public IA changes |
| Private nav rail | `src/components/PrivateRail.jsx` | MOCK | Static route list, no external data | Minimal | None beyond route coverage | Leave as shell-only unless routes change |
| Command bar | `src/components/CommandBar.jsx` | HYBRID | Shows auth state and can create a new local capture | Could look like command execution without real backend work | Verify whether command input is only a capture shortcut | Clarify UI label if necessary |
| Auth gate | `src/components/AuthGate.jsx`, `src/components/ReadinessPanel.jsx` | LIVE | Reads configured Supabase state and readiness endpoint data | If envs are missing, it falls back to setup messaging | Verify in a configured environment and unconfigured environment | Keep as the main auth boundary |
| `/home` dashboard | `src/screens/HomeScreen.jsx` | HYBRID | Uses local/Supabase-backed state plus planning snapshot feed | “Live” dashboard can still be partly cached/static | Verify whether the source strip is showing fresh or cached data | Split visible indicators into live vs cached more clearly |
| `/today` planning view | `src/screens/TodayScreen.jsx`, `src/hooks/usePlanningSnapshot.js`, `api/v3-feed.js` | HYBRID | Hook fetches `/api/v3-feed` but falls back to hardcoded planning snapshot | Biggest truth gap in the app | Verify if the feed is truly live or static by source | Audit and simplify the planning feed contract |
| Source strip | `src/components/SourceStrip.jsx` | HYBRID | Explicitly shows “Live snapshot” or “Cached snapshot” and connector readiness | Can overstate freshness if upstream data is static | Verify actual freshness of `planning.generatedAt` and feed contents | Tie labels to factual source state |
| Capture screen | `src/screens/CaptureScreen.jsx`, `src/dataVault.js` | HYBRID | Local capture state can be persisted to Supabase when unlocked | Could be mistaken for a real inbox system when it is mostly local state | Verify Supabase write/read path in auth-enabled mode | Document capture as local-first with optional sync |
| Memory screen | `src/screens/MemoryScreen.jsx`, `src/dataVault.js` | HYBRID | Shows routed memory items from cockpit state | Mostly mock unless synced by authenticated storage | Verify persistent storage behavior | Mark memory as user-state shelf, not a live knowledge base |
| Body screen | `src/screens/BodyScreen.jsx`, `src/dataVault.js` | HYBRID | Interactive logger updates cockpit state, but there is no external health integration | Easy to misread as a health integration | Verify whether state persists via Supabase when unlocked | State clearly that health is local summary only |
| Money screen | `src/screens/MoneyScreen.jsx`, `src/dataVault.js` | MOCK | Simulated invoice amounts and follow-up text; no live accounting API | High if someone assumes real billing data | Verify if any future finance API exists | Label as simulated reminders only |
| Build Lab | `src/screens/BuildLabScreen.jsx`, `src/dataVault.js` | MOCK | Kanban and export flow are local/demo-style case-study tooling | High if taken as real project tracking | Verify whether any of this reflects external task systems | Keep framed as portfolio proof tooling |
| Night Close | `src/screens/NightCloseScreen.jsx`, `src/dataVault.js` | HYBRID | Uses mutable cockpit state, which can persist through Supabase when unlocked | Could appear more operationally real than it is | Verify persistence in authenticated mode | Document as private operating checklist |
| Pablo screen | `src/screens/PabloScreen.jsx` | MOCK | Static internal persona and policy content | Low | None | Treat as internal guidance page |
| Not found screen | `src/screens/NotFoundScreen.jsx` | MOCK | Pure fallback screen | Low | None | Leave as simple route fallback |
| Supabase auth client | `src/supabaseClient.js`, `src/hooks/useAuthSession.js` | LIVE | Uses real Supabase client auth session and allowlist lookup | Production depends on correct envs and allowlist row | Verify in a configured environment | Keep as live auth foundation |
| Cockpit state persistence | `src/dataVault.js`, `src/hooks/useCockpitState.js` | HYBRID | Writes to Supabase tables when unlocked, otherwise caches in localStorage | Could silently degrade to local-only behavior | Verify authenticated load/save against Supabase | Add explicit live/cache indicators if needed |
| Connector readiness | `src/hooks/useConnectorReadiness.js`, `api/connector-status.js` | HYBRID | Server reads env vars, client falls back to local snapshot | Readiness can say “ready” without end-to-end proof | Verify env checks in deployed runtime | Separate “configured” from “live verified” |
| Connector control | `src/hooks/useConnectorControl.js`, `src/dataVault.js` | HYBRID | Updates connector accounts and sync events in Supabase-backed tables | Depends on schema completeness | Verify write/read path and schema support | Audit table coverage next |
| `/sync-settings` connector room | `src/screens/SyncSettingsScreen.jsx` | HYBRID | Mixes auth status, readiness, connector state, and OAuth start actions | Strong claim surface for live connector work | Verify with real OAuth starts and callback completion | Treat as live-readiness, not live-proof |
| API readiness endpoint | `api/connector-status.js` | HYBRID | Real env inspection, but no actual provider auth or sync calls | Can be mistaken for live connector health | Verify deployed envs and missing secrets | Keep as readiness-only endpoint |
| Sync gate endpoint | `api/sync-gate.js` | MOCK | Explicitly returns 501 for unsupported live sync | Safe, but not a live connector feature | None beyond intent | Keep as guardrail |
| Planning feed endpoint | `api/v3-feed.js` | MOCK | Returns hardcoded planning data with env-based connector readiness | Biggest mismatch between “live” naming and static implementation | Verify source of today/planning data | Either connect to live source or rename as snapshot |
| Alternate planning endpoint | `api/planning-snapshot.js` | MOCK | Hardcoded planning snapshot, no visible consumer in current UI | Redundant endpoint risk | Verify whether it is still used anywhere | Retire or unify with `/api/v3-feed` |
| Google Calendar OAuth start/callback/sync | `api/google-calendar/oauth/start.js`, `api/google-calendar/oauth/callback.js`, `api/google-calendar/sync.js`, `api/_lib/connector-auth.js` | HYBRID | Real OAuth URLs, token exchange, and Google API fetches exist | Depends on secrets, browser session, and missing token-table schema | Verify end-to-end in a live configured environment | Audit schema and live OAuth flow next |
| Notion OAuth start/callback/sync | `api/notion/oauth/start.js`, `api/notion/oauth/callback.js`, `api/notion/sync.js`, `api/notion/library-sync.js`, `api/_lib/connector-auth.js` | HYBRID | Real OAuth URLs, token exchange, page sync, and library sync exist | Depends on secrets, browser session, cron, and missing token-table schema | Verify end-to-end in a live configured environment | Audit schema and live sync completion next |
| Notion library sync cron path | `api/notion/library-sync.js`, `vercel.json` | HYBRID | Vercel cron points to the endpoint; code can also run manually | Stronger runtime dependency than the repo can prove | Verify cron execution and schema | Confirm scheduled sync in deployment |
| Service worker | `public/sw.js` | HYBRID | Real offline/cache logic, but caches source-file URLs rather than only build outputs | Could behave differently in production build output | Verify production cache behavior | Audit runtime asset caching |
| GitHub Actions check | `.github/workflows/check.yml` | LIVE | Real CI workflow runs `npm ci`, installs Playwright Chromium, and runs `npm run check` | Only proves current repo checks, not live product behavior | Verify on current PR head | Keep as repository readiness gate |
| Public route tests | `tests/qa.spec.js` | LIVE | Tests really run against the dev app for public page rendering | Coverage is shallow and mostly render-level | Verify live browser behavior beyond the happy path | Add deeper assertions only if useful |
| Private route lock tests | `tests/qa.spec.js` | LIVE | Confirms locked-state UI for private routes when signed out | Still doesn’t prove authenticated unlock behavior | Verify signed-in route access separately | Add auth-mode coverage later |
| API smoke tests | `tests/qa.spec.js` | HYBRID | Logs status for `/api/connector-status` and `/api/sync-gate` but does not assert deeper behavior | Can pass while functionality is incomplete | Verify actual status semantics | Tighten assertions only where stable |

## Public Website / Portfolio Surfaces

* `/`, `/work`, and `/make-portfolio` are HYBRID because they present public portfolio content but derive projects from shared app state rather than a live external CMS.
* `/contact` is MOCK because it is purely static copy with placeholder contact links.
* `PublicBar` is MOCK as a navigation shell.
* The public proof wall on `/` is HYBRID because it is built from project state, not a live portfolio database.

## Private Cockpit / Auth-Gated Surfaces

* The overall private cockpit shell is HYBRID because it combines real auth gating, local state, and optional Supabase persistence.
* `HomeScreen` is HYBRID because it mixes local cockpit state with the planning feed.
* `TodayScreen` is HYBRID but leans mock because the backend planning endpoint is currently hardcoded.
* `CaptureScreen`, `MemoryScreen`, `BodyScreen`, `NightCloseScreen`, and `BuildLabScreen` are HYBRID or MOCK depending on whether the current state has been persisted to Supabase.
* `MoneyScreen` is MOCK because the invoice data is simulated.
* `PabloScreen` is MOCK because it is static guidance copy.
* `SyncSettingsScreen` is HYBRID because the readiness/auth flow is real, but the connector integrations are only partially proven.
* `AuthGate` and `ReadinessPanel` are LIVE for auth/readiness signaling, but they still describe a system that is not fully proven live.

## Today / Planning Feed State

The Today/planning feed is best classified as HYBRID.

* The UI fetches `/api/v3-feed` through `usePlanningSnapshot`.
* If that fetch fails, the UI falls back to a hardcoded `planningSnapshot`.
* The `/api/v3-feed` handler itself returns hardcoded planning data, not a live upstream source.
* `SourceStrip` explicitly supports either a “Live snapshot” or “Cached snapshot” presentation.

Conclusion:

* The view is HYBRID.
* The backend data source is effectively MOCK.
* The “live” wording in docs and UI is ahead of the actual live data proof.

## Supabase-Backed State

Supabase client usage:

* Browser client: `src/supabaseClient.js`
* Browser state helpers: `src/dataVault.js`
* Server-side connector utilities: `api/_lib/connector-auth.js`

Auth usage:

* `useAuthSession` calls `supabase.auth.getSession()`
* It subscribes to auth changes
* It runs a profile allowlist lookup against `cockpit_profiles`
* Google OAuth in the browser uses `supabase.auth.signInWithOAuth`

Tables / migrations found:

* `cockpit_profiles`
* `cockpit_items`
* `connector_accounts`
* `sync_events`
* `portfolio_records`

Browser-side vs server-side usage:

* Browser-side live usage:
  * session lookup
  * profile allowlist check
  * private-state persistence via `cockpit_items`
  * connector account and sync-event reads/writes
* Server-side live usage:
  * Supabase access-token verification
  * OAuth state/session signing
  * connector token storage and refresh
  * connector account updates
  * sync-event writes
  * cron/manual Notion library sync

Visible table gap:

* `connector_tokens` is referenced in server code but does not appear in the visible migration file.

## API Endpoint State

| API file / endpoint | Purpose | Data source | Classification | Auth/security notes | Missing assertions or verification |
| --- | --- | --- | --- | --- | --- |
| `api/connector-status.js` | connector readiness and env inspection | process env only | HYBRID | no secrets returned, but uses env presence as readiness proxy | verify deployed envs and actual provider auth |
| `api/sync-gate.js` | block unsupported live sync | static guardrail | MOCK | deliberately returns 501 | verify if still needed |
| `api/v3-feed.js` | planning feed for Today | hardcoded data plus env checks | MOCK | no auth, no live upstream source | verify live source or rename as snapshot |
| `api/planning-snapshot.js` | alternate planning snapshot | hardcoded data | MOCK | no visible consumer | verify if still used |
| `api/google-calendar/oauth/start.js` | start Google OAuth | real OAuth state/session signing | HYBRID | requires access token and signed connector session | end-to-end callback proof missing |
| `api/google-calendar/oauth/callback.js` | finish Google OAuth | real Google token exchange and Supabase writes | HYBRID | state/session verification present | missing schema proof for token persistence |
| `api/google-calendar/sync.js` | sync Google Calendar | real Google APIs via access token | HYBRID | requires verified owner | end-to-end live sync unproven |
| `api/notion/oauth/start.js` | start Notion OAuth | real OAuth state/session signing | HYBRID | requires access token and signed connector session | end-to-end callback proof missing |
| `api/notion/oauth/callback.js` | finish Notion OAuth | real Notion token exchange and Supabase writes | HYBRID | state/session verification present | missing schema proof for token persistence |
| `api/notion/sync.js` | sync Notion | real Notion APIs via access token | HYBRID | requires verified owner | end-to-end live sync unproven |
| `api/notion/library-sync.js` | library sync / cron sync | real Notion API + Supabase admin client | HYBRID | service-role dependent, cron-enabled | runtime cron proof missing |

## Connector / External Service State

* Supabase auth is LIVE in browser code.
* Supabase storage for cockpit state is HYBRID because it can sync live when authenticated, but falls back to localStorage.
* The connector token flow is HYBRID because the OAuth and sync code is real, but the visible schema is incomplete.
* Google Calendar and Notion integrations are HYBRID, not fully LIVE, because their code exists and their env contracts are explicit, but live end-to-end proof is missing and the token schema gap remains.
* Google Drive, Make, and Gmail are currently planned or guarded rather than live.
* The roadmap/docs claim future live connector work, but the repo only fully proves the scaffolding and a subset of the flows.

Missing migrations / env checks:

* `connector_tokens` migration missing from visible `supabase/migrations/`
* production auth/provider setup is not visible in the repo
* live deployment configuration for the external providers is not verifiable from code alone

## Tests vs Reality

What the tests really verify:

* public page rendering
* private route lock behavior when signed out
* basic mobile layout visibility
* simple endpoint reachability/status logging

What the tests do not prove:

* signed-in route unlock behavior
* Supabase persistence
* OAuth start/callback correctness
* connector token refresh
* cron execution
* the actual freshness of the planning feed
* whether `connector_tokens` exists

Known limitations of current Playwright coverage:

* API checks log status instead of asserting meaningful semantics.
* Private route tests only cover the locked state.
* The suite does not exercise authenticated production-like flows.

## Product Risks

* The app’s strongest “live” claims are ahead of the strongest live proof in the repo.
* The planning feed appears live in the UI but is backed by static data in the current handler.
* Connector token storage may fail or be incomplete because the referenced table is not visible in migrations.
* The public website can be mistaken for a live CMS-driven portfolio when it is largely shared app state plus static content.
* A developer may assume Google Calendar/Notion are fully live when the repo only proves scaffolding plus partial flow implementation.
* The current tests can pass even if authenticated or connector-specific behavior is still broken.

## Recommended Next Tasks

* `task-008-planning-feed-truth-audit`
  * Goal: determine whether the Today feed should be live, cached, or deliberately static and remove the mismatch.
  * Why it matters: this is the biggest live-vs-mock truth gap.
  * Recommended worker: Codex
  * Recommended model / credit budget: low or standard / cheapest capable model
  * Human approval required: no

* `task-009-supabase-schema-completeness-audit`
  * Goal: reconcile server code with visible migrations, especially `connector_tokens`.
  * Why it matters: connector flows cannot be trusted until schema support is confirmed.
  * Recommended worker: Codex
  * Recommended model / credit budget: low / cheapest capable model
  * Human approval required: no

* `task-010-auth-and-oauth-verification-pass`
  * Goal: verify private unlock, allowlist behavior, Google OAuth, and Notion OAuth end to end.
  * Why it matters: auth and connectors are the main live claims.
  * Recommended worker: Antigravity
  * Recommended model / credit budget: standard visual/runtime QA budget
  * Human approval required: only if live credentials or paid/external actions are needed

* `task-011-live-vs-mock-copy-cleanup`
  * Goal: align UI copy and docs with the real live/mock state so claims do not outrun proof.
  * Why it matters: users and future developers need accurate expectations.
  * Recommended worker: Pablo
  * Recommended model / credit budget: low / cheapest capable model
  * Human approval required: no

* `task-012-public-proof-boundary-map`
  * Goal: mark every public-facing proof item as public-safe, private, or not yet publishable.
  * Why it matters: public pages currently sit close to private cockpit content.
  * Recommended worker: Codex
  * Recommended model / credit budget: low / cheapest capable model
  * Human approval required: no

* `task-013-qa-coverage-gap-analysis`
  * Goal: identify which live behaviors deserve automated tests versus manual proof only.
  * Why it matters: the current suite mostly proves rendering and signed-out locks.
  * Recommended worker: Codex
  * Recommended model / credit budget: low / cheapest capable model
  * Human approval required: no

* `task-014-connector-cron-proof`
  * Goal: confirm whether the Notion library sync cron path works in the deployment environment.
  * Why it matters: scheduled sync is part of the live connector story.
  * Recommended worker: Antigravity
  * Recommended model / credit budget: standard runtime QA budget
  * Human approval required: only if production access is needed
