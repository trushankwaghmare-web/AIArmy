# AI Army Dashboard

This repository contains the AI Army Dashboard — a demo dashboard for managing AI agents, sessions, schedules, and tools.

## Environment variables
The app requires several environment variables to be configured in Vercel (Project Settings → Environment Variables) for production. Do NOT commit secrets to the repository.

Required (server-side)

- `GOOGLE_CLIENT_ID` — OAuth client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` — OAuth client secret (keep this secret)
- `AUTH_JWT_SECRET` — Strong random secret used to sign session JWTs (recommended 32+ random bytes)
- `GEMINI_API_KEY` — Google Gemini / Generative API key for server-side calls

Optional (local dev)

- `VITE_GEMINI_API_KEY` — local dev fallback for Gemini API (do not use for production)
- `BASE_URL` — optional, the app base URL used to build OAuth redirect URIs (e.g., https://ai-army-gamma.vercel.app)

## Local development

1. Copy `.env.example` to `.env` and fill values for local testing (do NOT commit `.env`).

2. Install dependencies:

```bash
npm install
```

3. Run dev server:

```bash
npm run dev
```

4. Build for production (also generates service worker):

```bash
npm run build
```

5. Preview the production build locally:

```bash
npm run preview
```

## Vercel
- Ensure you set the required environment variables in the Vercel dashboard and redeploy.
- The Vercel functions live in the `api/` directory and are configured to use Node 18 via `vercel.json`.

## Notes
- Keep secret API keys and client secrets out of the repository. Use Vercel environment variables for production.
- The app stores user settings in localStorage under the key `ai-army-dashboard:v1`.
- To enable PWA features, icons and manifest are in `public/`.

