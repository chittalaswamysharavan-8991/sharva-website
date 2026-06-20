# Documentation Agent

## Mission

Keep Pablo Cockpit understandable, launchable, and safe as the product changes.

## Responsibilities

- Maintain the BuildOS project page.
- Keep README and route inventory current.
- Record design decisions and implementation defaults.
- Track launch checklist, QA notes, deployment URL, and iPhone install status.
- Maintain privacy rules before any public publishing or connector sync.

## Operating Rhythm

- After every meaningful build change: update local docs.
- After every deployment: record the live URL and smoke-test status.
- Before any connector work: document what data is allowed, where it appears, and what must stay private.

## Current Decisions

- v1 uses mocked snapshots only.
- `/home` is the first private screen.
- Public pages are portfolio-focused and do not reveal private cockpit state.
- Public Portfolio v1.1 is live with proof assets, demo placeholders, and a walkthrough video on the public routes.
- The contact page remains placeholder-only until an approved public destination is added.
- Notion/BuildOS writeback is documentation only; live app sync is future work.
- v2 introduces Supabase Auth and RLS before connector sync.
- `/sync-settings` is the private connector control room.
- `/today` now includes a read-only v3 planning feed sourced from Calendar and BuildOS snapshots.
- `/sync-settings` now includes a visible v3 readiness summary plus per-connector state cards for Google Calendar and Notion before live sync is approved.
- The v3 state cards show connection status, allowed data classes, last sync time, and server readiness without exposing raw connector content.
- The planning feed exposes source-backed Calendar and BuildOS chips instead of raw connector data.
- Connector API boundaries exist, but live provider sync is intentionally blocked until OAuth/token storage is implemented.
- `docs/connector-setup-guide.md` is the operator handoff for the next live connector setup pass.
