# v2-v5 Connector Roadmap

## Purpose

Pablo Cockpit moves from mocked v1 snapshots to live personal sync only after authentication, owner allowlisting, RLS, audit events, and server-side connector gates are in place. Each phase must preserve the current public/private split: private cockpit routes can use approved personal data; public routes can show only portfolio-safe proof.

## v2: Auth, Vault, And Sync Gate

Goal: make the private cockpit safe before any live connector data enters the app.

- Add Supabase Auth Google OAuth login for private routes.
- Require the owner allowlist in `cockpit_profiles`.
- Store private cockpit state in Supabase `cockpit_items` behind RLS.
- Treat local browser storage as a cache after vault sync is active.
- Record vault load/save activity in sync audit events.
- Keep connector tokens, refresh tokens, service-role keys, and provider secrets out of browser JavaScript.
- Use `/sync-settings`, `/api/connector-status`, and `/api/sync-gate` as the visible readiness layer before live sync.

Exit criteria:

- Production has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Private routes remain locked for unauthenticated or non-allowlisted users.
- Supabase migration is applied and verified against the live project.
- `/api/sync-gate` remains blocked for live providers until OAuth, token storage, scopes, filters, and audit behavior are implemented server-side.

## v3: Notion And Calendar

Goal: add the first low-risk live context sources for planning and daily operations.

- Notion sync starts with metadata and selected BuildOS/project records, not full private workspace mirroring.
- Calendar sync starts with schedule blocks, availability, and daily planning context.
- `/sync-settings` must show connection state, last sync time, allowed data classes, and server readiness before sync runs.
- Sync writes must be scoped, auditable, and reversible.
- Private views may summarize planning context; public routes must not expose private event names, attendees, addresses, or Notion content.

Preferred order:

1. Calendar read-only daily context.
2. Notion read-only project/status context.
3. Explicit writeback only after review and consent controls exist.

## v4: Drive And Make

Goal: connect work proof and automation delivery without leaking private files.

- Drive sync is limited to selected folders, file metadata, and approved artifacts.
- Private cockpit views may show working files, proof checklists, and project evidence.
- Public portfolio pages may use only approved screenshots, demo videos, sanitized titles, and case-study summaries.
- Make.com sync can track scenario inventory, run status, delivery proof, and client-safe automation categories.
- Make.com credentials and webhook secrets stay server-side.

Public promotion rule:

- No Drive file, Make scenario, or automation proof appears on public pages until it has been explicitly marked portfolio-safe.

## v5: Gmail, Money, And Health Boundaries

Goal: define strict limits for the most sensitive domains before considering any implementation.

- Gmail remains metadata-first: labels, sender domain/category, timestamps, counts, and action queues before any message-body handling.
- Email bodies, attachments, personal addresses, phone numbers, and raw conversation content are excluded from public pages.
- Money connectors are excluded by default; if introduced later, use category-level summaries only, never exact private balances, account numbers, transactions, or credentials.
- Health connectors are excluded by default; if introduced later, use owner-only high-level habit or readiness summaries, never raw health logs or medical details.
- Family data remains private and must not be synced, summarized publicly, or used for portfolio proof.

v5 requires a separate privacy review before implementation. The default answer for Gmail body sync, exact money sync, and raw health sync is no.

## Always-On Rules

- Auth and owner allowlisting come before live connector data.
- Server-side connector gates come before provider OAuth.
- Consent, scopes, filters, and audit events come before scheduled sync.
- Public pages can show capability and proof shape, not private content.
- When in doubt, keep data private and document the decision before building.
