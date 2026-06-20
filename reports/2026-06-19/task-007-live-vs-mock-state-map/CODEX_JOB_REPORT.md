# CODEX_JOB_REPORT

## Task ID

`task-007-live-vs-mock-state-map`

## Platform used

Codex

## Goal

Create a clear live-vs-mock state map for the current website/app.

## Required tools / skills used

* Codex for repository inspection, documentation updates, branch creation, check execution, report creation, and draft PR publishing
* GitHub publish workflow skill for push and PR creation

## Recommended model / credit budget followed

* Low / standard / mini-level approach used
* Cheapest capable path followed

## Forbidden tools respected

* Did not edit app source code
* Did not redesign UI
* Did not refactor
* Did not edit tests
* Did not touch `.env`, secrets, API keys, tokens, credentials, OAuth settings, or deployment settings
* Did not add deployment steps
* Did not create `PABLO_REVIEW_REPORT.md`

## Files changed

* `docs/product/LIVE_VS_MOCK_STATE_MAP.md`
* `reports/2026-06-19/task-007-live-vs-mock-state-map/CODEX_JOB_REPORT.md`

## Areas inspected

* `src/`
* `api/`
* `supabase/`
* `tests/`
* `public/`
* `vercel.json`
* `package.json`
* existing docs and reports

## Commands run

* `gh auth status`
* `gh --version`
* `git fetch origin`
* `git checkout main`
* `git pull origin main`
* `git checkout -b task-007-live-vs-mock-state-map`
* `npm run check`
* `npm.cmd run check`

## Check result

* `npm run check` failed in PowerShell because `npm.ps1` execution is disabled on this system.
* `npm.cmd run check` passed.
* Existing lint warnings remain, but no new errors were introduced by this documentation-only task.

## Live-vs-mock summary

The app is a mixed live/mock system:

* Public marketing pages are mostly MOCK or HYBRID.
* Private cockpit pages are mostly HYBRID.
* Supabase auth/storage is LIVE in the code.
* Connector and OAuth flows are HYBRID because the code is real, but end-to-end proof and schema completeness are not fully verified.
* The Today/planning feed is HYBRID at the UI level but backed by static data in the current handler.
* The strongest unresolved truth gap is the missing visible migration for `connector_tokens`.

## Problems found

* The planning feed looks live in the UI but is backed by hardcoded data in `api/v3-feed.js`.
* `api/planning-snapshot.js` is redundant and also hardcoded.
* `connector_tokens` is referenced in server code but not present in the visible migration set.
* Several public pages present portfolio material sourced from shared app state rather than a live CMS.
* Current tests mostly verify rendering and signed-out locks, not authenticated or connector behavior.

## Pending verification

* Live auth in a configured environment
* Google Calendar OAuth and sync end to end
* Notion OAuth and sync end to end
* connector token persistence schema completeness
* real planning-feed freshness
* production service-worker behavior
* runtime behavior of unknown routes

## Final status

Documentation map completed successfully and ready for review.

## Next recommended action

Create the PR review handoff for Pablo after Codex publishes the draft PR, then prioritize a planning-feed truth audit and Supabase schema audit.
