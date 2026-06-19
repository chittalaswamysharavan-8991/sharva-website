# Connector Setup Guide

This guide covers the next live pieces for Pablo Cockpit:

- Supabase Google sign-in for the private cockpit.
- Google Calendar API for read-only planning context.
- Notion public connection for BuildOS and project metadata.
- The app API routes that still need to exist for live connector sync.

## What APIs You Need

### Third-party APIs

- Supabase Auth Google provider for sign-in.
- Google Calendar API for calendar context.
- Notion API public connection for BuildOS pages and project notes.

### App APIs now in use

- `POST /api/google-calendar/oauth/start`
- `GET /api/google-calendar/oauth/callback`
- `POST /api/notion/oauth/start`
- `GET /api/notion/oauth/callback`
- `POST /api/google-calendar/sync`
- `POST /api/notion/sync`

These app routes now exist and use the signed-in owner session to start OAuth, store tokens, and run the first sync pass.

## Supabase Google Sign-In

Use this when you want the private cockpit to unlock for the allowlisted owner.

1. Open the Supabase Dashboard.
2. Open your Pablo Cockpit project.
3. Go to `Authentication`.
4. Open `Providers`.
5. Select `Google`.
6. Turn Google auth on.
7. Copy the Google Client ID and Client Secret from Google Cloud.
8. Paste them into the Google provider fields.
9. Save the provider settings.
10. Copy the Supabase callback URL from the Google provider page and use that as the Google redirect URI.
11. Open `Settings` > `API Keys` in the Supabase Dashboard.
12. Add a random `CONNECTOR_STATE_SECRET` value for signing OAuth state and the short-lived connector session cookie.

## Google Calendar API

Use this when you want read-only daily context such as free/busy, calendar blocks, and planning snapshots.

1. Open the Google Cloud Console.
2. Select or create the project you want to use.
3. Open `Google Auth platform`.
4. Open `Clients`.
5. Click `Create Client`.
6. Choose `Web application`.
7. Give the credential a name.
8. Add authorized JavaScript origins:
   - `https://pablo-cockpit.vercel.app`
   - `http://127.0.0.1:5173` for local dev
9. Add `https://pablo-cockpit.vercel.app/api/google-calendar/oauth/callback` as the authorized redirect URI.
10. Click `Create`.
11. Copy the Client ID and Client Secret.
12. Open `APIs & Services` > `Library`.
13. Search for `Google Calendar API`.
14. Click `Enable`.
15. Keep the Google client secret server-side only.

## Notion Public Connection

Use this when you want BuildOS pages or project metadata to move through a public Notion connection.

1. Open the Notion Developer portal.
2. Go to `Build`.
3. Open `Public connections`.
4. Click `Create new connection`.
5. Give the connection a name.
6. Choose the installation scope.
   - `Any workspace`
   - `Selected workspaces only`
7. Add `https://pablo-cockpit.vercel.app/api/notion/oauth/callback` in the OAuth configuration section.
8. Save the connection.
9. Open the connection `Configuration` tab.
10. Copy the Client ID and Client Secret.
11. Keep the secrets server-side only.
12. Add `CONNECTOR_STATE_SECRET` to the server environment.

## Vercel Environment Variables

Add these in the Vercel project settings and in your local `.env` file:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NOTION_CLIENT_ID`
- `NOTION_CLIENT_SECRET`
- `CONNECTOR_STATE_SECRET`

Keep these server-only for the connector work:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NOTION_CLIENT_ID`
- `NOTION_CLIENT_SECRET`
- `CONNECTOR_STATE_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MAKE_API_TOKEN`

## LibraryOS Sync

The Notion connector now refreshes the `LibraryOS` database in SharvaOS as part
of its sync pass.

- The library index stores source timestamps separately from the row's own
  Notion timestamps.
- The `Recents` view should sort by source last edited time.
- Vercel Cron can hit `/api/notion/library-sync` on an hourly schedule for an
  automated refresh loop.

## Tap-by-Tap Order

If you want the shortest safe path, do it in this order:

1. Confirm Supabase Google auth is enabled.
2. Create the Google Calendar OAuth client.
3. Enable the Google Calendar API.
4. Create the Notion public connection.
5. Add `CONNECTOR_STATE_SECRET` to Vercel.
6. Add the Google and Notion client secrets to Vercel.
7. Redeploy Pablo Cockpit.
8. Use the new Connect buttons in `/sync-settings` to start OAuth.

## What Should Stay Off Public Pages

- Raw calendar event names that are private.
- Notion content that has not been approved for public use.
- API secrets, refresh tokens, and provider secrets.
- Gmail bodies, money, and health data until later privacy review.
