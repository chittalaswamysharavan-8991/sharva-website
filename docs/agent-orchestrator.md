# Agent Orchestrator

## Purpose

The Pablo Cockpit agent system keeps work split by responsibility so product changes, connector work, documentation, and QA do not blur privacy boundaries. Agents may collaborate in the same project folder, but each agent must respect its ownership area and avoid reverting work it did not make.

## Roles

### Orchestrator

- Owns the phase plan, work sequencing, and cross-agent handoffs.
- Confirms which phase is active before assigning work.
- Keeps v2 security work ahead of v3-v5 connector implementation.
- Resolves conflicts between roadmap, privacy, product behavior, and deployment readiness.
- Stops work when a privacy gate or ownership boundary is unclear.

### Auth/Security Agent

- Owns Supabase Auth, owner allowlist, RLS, vault behavior, sync audit events, and server-side secret boundaries.
- Verifies private routes lock correctly when Supabase is missing, the user is signed out, or the user is not allowlisted.
- Ensures connector tokens, provider secrets, refresh tokens, service-role keys, and sensitive IDs never enter browser state.
- Reviews every live connector plan before implementation.

### Connector Agent

- Owns connector design and implementation after the Auth/Security Agent clears the gate.
- Starts with Notion and Calendar before Drive, Make, or Gmail.
- Documents provider scopes, allowed data classes, sync direction, audit events, and rollback behavior.
- Keeps live sync behind `/sync-settings`, `/api/connector-status`, and `/api/sync-gate` until ready.
- Requires v3 state cards to show connection status, allowed data classes, last sync time, and server readiness before any live sync branch is opened.
- Treats Gmail, money, and health as restricted domains requiring separate approval.

### Documentation Agent

- Owns project docs, roadmap docs, BuildOS summary docs, route inventory, privacy rules, launch notes, and QA evidence.
- Keeps docs aligned with `README.md`, `docs/v2-auth-sync-plan.md`, and `docs/buildos-pablo-cockpit.md`.
- Records what is shipped, what is blocked, and what remains mocked.
- Does not edit app source, API handlers, package files, migrations, or deployment config unless explicitly reassigned.

### QA Agent

- Owns verification of routes, responsive layout, auth locks, persistence, production build, and deployment smoke checks.
- Captures evidence for desktop, mobile, private routes, public routes, and `/sync-settings`.
- Confirms public pages do not expose private connector data.
- Reports blockers with route, environment, observed behavior, and reproduction steps.

## Handoff Rules

- Orchestrator defines the active phase and assigns one owner per workstream.
- Agents read current docs before changing their owned area.
- Agents report changed files, validation performed, and unresolved risks.
- Agents do not overwrite unrelated edits, even if those edits are incomplete.
- Connector work cannot start until Auth/Security confirms the relevant gate.
- Public portfolio promotion requires Documentation and QA review after private-data screening.

## Privacy Gates

1. Route gate: private data may appear only on authenticated, allowlisted private routes.
2. Secret gate: provider secrets and tokens stay server-side or in an approved vault.
3. Consent gate: each connector needs visible connection state and allowed data classes before sync.
4. Scope gate: sync reads only the minimum provider scopes needed for the current phase.
5. Audit gate: every live sync path records useful success/failure events.
6. Public gate: public routes can show only approved portfolio-safe proof.
7. Restricted-domain gate: Gmail body content, exact money data, raw health logs, and family data remain excluded unless a separate privacy review changes the boundary.

## Workstream Order

1. v2 Auth/Security: finish Supabase environment, migration, owner allowlist, vault verification, and locked-route QA.
2. v3 Connectors: add Calendar and Notion read-only context with visible consent and audit events.
3. v4 Proof: add Drive and Make evidence flows with portfolio-safe approval before public use.
4. v5 Restricted Domains: review Gmail metadata, money summaries, and health boundaries before any implementation.
