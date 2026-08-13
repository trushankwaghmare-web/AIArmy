### Pull Request: feature/ai-army-dashboard → main

This PR adds the AI Army Dashboard frontend scaffolded with Vite, React, TypeScript, Tailwind CSS, and Supabase helpers. It includes UI styles, a responsive dark theme (blue/teal palette), demo data and Supabase client wiring, and components for Agents, Sessions, Activity, Schedules and Tools. The application falls back to demo data if Supabase requests fail, enabling local previews without backend setup.

Changes include:
- Project setup: package.json (on main), vite.config.ts, tsconfig.json
- App entry: index.html, src/main.tsx
- Styling: src/index.css, src/App.css (design system: Inter font, 8px spacing, 6-color ramp)
- Supabase: src/lib/supabase.ts (typed client + fetch helpers)
- Demo data: src/lib/demoData.ts (agents, tasks, sessions, logs, schedules, tools)
- UI: src/App.tsx and components (Sidebar, StatCards, AgentCards, SessionList, ActivityFeed, ScheduleList, ToolRegistry)

Notes:
- The repository default branch (main) already has package.json committed in an earlier step; this PR targets merging the feature branch that contains the rest of the dashboard files.
- Supabase credentials are read from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY; when missing, the app uses demo data.
- Design rules followed: dark theme, blue/teal palette (no purple), Inter font, responsive layout, and live clock/system status indicator.

---

Please review and merge when ready.