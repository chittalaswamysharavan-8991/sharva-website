# BuildOS Project: Pablo Cockpit

## Goal

Design, finish, document, and deploy a complete working Pablo Cockpit website for daily use, with a stable iPhone-ready URL and a public AI Automation Builder doorway.

## Current State

- Live site: https://pablo-cockpit.vercel.app
- Daily iPhone route: https://pablo-cockpit.vercel.app/home
- BuildOS page: https://app.notion.com/p/3825ca758dc2819698aded5c6e373dcf
- Local route: `http://127.0.0.1:5173/home`
- Figma direction: `Pablo Cockpit - Private Website v1`
- App type: React + Vite
- Data policy: v1 mocked snapshots; v2 adds Supabase Auth/RLS foundation before live connector sync
- Deployment target: Vercel production
- Production auth status: Vercel is linked and now has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Live owner sign-in opened `/home` and `/today` in production using the Supabase Google OAuth session.
- Authenticated task changes saved back to the Supabase vault and wrote sync events.
- `/sync-settings` now shows the v2 to v5 connector phase map inside the app.
- `/sync-settings` now also shows a v3 readiness panel plus per-connector state cards for Google Calendar and Notion before live sync is fully verified.
- The v3 state cards show connection status, allowed data classes, last sync time, and server readiness without exposing raw connector content.
- Connector account rows now exist for `supabase_vault`, `notion`, and `google_calendar`, and the live OAuth routes now use an owner-scoped connector session plus RLS-backed token writes.
- The HTML shell and current app build redirect the legacy `lifeos-dashboard-ecru-five.vercel.app` host to the canonical `pablo-cockpit.vercel.app` host.
- `/today` now also shows the live planning snapshot for today's Calendar focus block and the next BuildOS handoff.
- `api/v3-feed.js` serves the read-only v3 planning feed used by Today.
- The Today feed now shows source-backed Calendar and BuildOS chips so the daily plan is easier to scan.
- The legacy `lifeos-dashboard-ecru-five.vercel.app` host now aliases to the live production deployment.
- Signed-in owners on the canonical host now auto-land in `/home` instead of staying on the public doorway.
- Local project path: `C:\Website`
- Public Portfolio v1.1 is live on the public routes with real website screenshots, demo placeholders, and a walkthrough video.
- The public contact page remains placeholder-only until an approved contact destination is published.

## Route Inventory

- Private: `/home`, `/today`, `/capture`, `/pablo`, `/memory`, `/body`, `/money`, `/build-lab`, `/night-close`
- Public: `/`, `/work`, `/make-portfolio`, `/contact`

## Roadmap

1. Finish daily-use v1 with persistence, PWA install behavior, and public/private route separation.
2. Deploy to a stable URL and install on iPhone from Safari.
3. Add v2 authentication, owner allowlist, privacy classes, sync audit tables, and protected private routes.
4. Add approved live connector sync later, starting with Notion or Calendar before Gmail.
5. Promote Make.com proof into public case studies with honest proof labels.
6. Fill the next proof gap with a real Make.com scenario screenshot, a real Google Sheet output screenshot, and a real activity log capture.

## Privacy Rules

- No raw family details.
- No exact private money amounts.
- No health logs.
- No email content.
- No addresses, tokens, phone numbers, or private connector content.
- Public pages can show capability, proof shape, project category, and demo-ready case studies only.
- Public pages may show real website screenshots, demo placeholders, and walkthrough media only when they are clearly labeled.

## QA Checklist

- All private and public routes load. Done.
- Mobile and desktop layouts do not overlap or clip. Done.
- Capture state persists after reload. Done.
- Production build passes. Done.
- Vercel URL opens at `/home`. Done.
- Home-screen launch displays as `Pablo Cockpit`. Ready for iPhone user check.
- v2 private routes lock when Supabase is not configured. Verified against production environment.
- v2 Supabase migration is applied to the live Supabase project with RLS policies.
- v2 vault adapter exists for Supabase load/save and sync audit events. Live signed-in vault persistence is verified.
- `/api/connector-status` includes the Supabase vault readiness check plus future connector server-env checks.
