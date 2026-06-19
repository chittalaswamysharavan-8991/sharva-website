# v2 Auth And Sync Foundation

## What v2 Adds

- Supabase Auth Google OAuth login.
- Private route lock for `/home`, `/today`, `/capture`, `/pablo`, `/memory`, `/body`, `/money`, `/build-lab`, `/sync-settings`, and `/night-close`.
- Public routes stay open: `/`, `/work`, `/make-portfolio`, `/contact`.
- Owner allowlist through `cockpit_profiles`.
- RLS-ready tables for private cockpit state, connector accounts, sync events, and public-approved portfolio records.
- Supabase vault adapter for loading and saving private cockpit state after the owner is authenticated.
- Sync audit events for vault load/save.
- Connector consent records and recent sync-event reads.
- Server-side API boundaries for connector status and sync gating.
- Connector rollout screen before live sync.

## Required Setup

1. Create or choose a Supabase project.
2. Apply `supabase/migrations/001_v2_auth_vault.sql`.
3. Add these Vercel environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `CONNECTOR_STATE_SECRET`
4. Sign in once through the app's Google OAuth flow.
5. Insert your `auth.users.id` into `cockpit_profiles` with `is_enabled = true`.

## Current Blocker

- None for the v2 auth/vault foundation.
- Vercel production now has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- The live owner session and vault write-back path were verified against the production site and live Supabase project.

## Security Rules

- Never expose a Supabase service role key in Vite.
- Connector tokens must stay server-side or in a token vault, never browser local state.
- Public pages can read only approved portfolio records.
- Gmail remains metadata-first in v5.
- Money and health real connectors are excluded for now.

## Vault Behavior

- If Supabase is not configured, private routes stay locked.
- If Supabase is configured and the user is not signed in, private routes show Google login.
- If the user is signed in but not allowlisted, private routes stay locked.
- If the user is signed in and allowlisted, the app loads `cockpit_items` through RLS and saves cockpit state back with deterministic `external_id` upserts.
- Local browser storage remains a convenience cache, not the source of truth after vault sync is active.
- The verified owner path now loads private state from Supabase and writes task changes back to the live vault.

## Connector Boundary

- `/api/connector-status` reports whether Supabase public client variables and server-side connector environment variables are present.
- `/api/sync-gate` intentionally returns `501 not_implemented` for live connector sync until OAuth, token storage, provider scopes, and privacy filters are implemented server-side.
- Browser JavaScript must never receive connector client secrets, API tokens, refresh tokens, or service-role keys.
