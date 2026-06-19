# CODEX_JOB_REPORT

## Task ID

`task-006-product-baseline-map`

## Platform used

Codex

## Goal

Create a clear product baseline map of the current website before any feature development.

## Required tools / skills used

* Codex for repository inspection, documentation updates, `npm run check`, report creation, branch work, and draft PR flow
* GitHub publish workflow skill for branch push and draft PR handling
* Folder Auditor skill for structured repo scanning support

## Forbidden tools respected

* Did not edit app source code
* Did not redesign UI
* Did not refactor
* Did not edit tests
* Did not touch `.env`, secrets, API keys, tokens, or credentials
* Did not add deployment steps

## Files changed

* `docs/product/PRODUCT_BASELINE.md`
* `reports/2026-06-19/task-006-product-baseline-map/CODEX_JOB_REPORT.md`

## Areas inspected

* `package.json`
* `src/`
* `api/`
* `supabase/`
* `tests/`
* `public/`
* `vercel.json`
* existing docs and reports

## Commands run

* `gh auth status`
* `gh --version`
* `git fetch origin`
* `git checkout main`
* `git pull origin main`
* `git checkout -b task-006-product-baseline-map`
* `python .agents/skills/folder-auditor/scripts/audit.py scan --dir . --output .tmp-task-006-audit.md`
* `npm.cmd run check`

## Check result

`npm run check` passed when run through `npm.cmd`.

## Product baseline summary

The current product is a dual-surface app:

* a public AI automation portfolio doorway
* a private owner-only Pablo Cockpit

The frontend is a React + Vite single-page app with custom client-side routing, CSS styling, and lazy-loaded screen modules. Private routes are gated by Supabase auth plus an allowlisted owner profile check. Private state is persisted through Supabase tables when unlocked, with browser local storage used as a cache/fallback.

The backend uses Vercel API routes for readiness checks, planning feed data, Google Calendar OAuth/sync, Notion OAuth/sync, and a cron-addressable Notion library sync path. A visible product gap is that server code relies on a `connector_tokens` table, but no matching migration was found in the inspected `supabase/migrations/` directory.

## Problems found

* No visible migration was found for the server-side `connector_tokens` table used by connector OAuth/sync code.
* The Today planning feed appears static in code despite live-oriented documentation language.
* `api/planning-snapshot.js` and `api/v3-feed.js` overlap in purpose, and active usage is unclear.
* Existing lint warnings remain in the repository.

## Pending verification

* Full live auth verification. Pending verification.
* End-to-end Google Calendar OAuth flow verification. Pending verification.
* End-to-end Notion OAuth flow verification. Pending verification.
* Whether the planning feed is truly live in production. Pending verification.
* Whether unknown public routes fall back cleanly in production. Pending verification.
* Whether the current service worker asset list is fully production-safe. Pending verification.

## Final status

Documentation baseline completed successfully and ready for review.

## Next recommended action

Start with a live-vs-mock state audit and a Supabase schema completeness audit before any major feature development.
