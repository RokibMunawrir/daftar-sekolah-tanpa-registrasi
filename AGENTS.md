# AGENTS.md

## Project

`ppdb-online` — PPDB (student registration) site built with **Astro 7** (server output), **React 19**, **TailwindCSS v4**, **Drizzle ORM + MySQL**, and **better-auth** for authentication.

## Key Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run astro -- --help` | Astro CLI help |

No test, lint, or typecheck scripts are defined in `package.json`.

## Architecture

- **Framework**: Astro 7 with `output: 'server'` + `@astrojs/node` standalone adapter
- **UI**: Astro components + React components (`src/components/react/`)
- **Pages**: `src/pages/` — Astro page directories: `admin/`, `daftar/`, `login/`, `pengumuman/`, `api/`
- **Middleware**: `src/middleware.ts` — attaches `locals.user`/`locals.session` via better-auth; redirects unauthenticated users away from `/admin`
- **Auth**: `better-auth` with Drizzle MySQL adapter; roles: `Super Admin`, `Panitia PPDB`, `Tata Usaha`
- **Database**: MySQL via Drizzle ORM; schema at `src/db/schema.ts`; migrations at `src/db/migrations/`
- **Styles**: `src/styles/global.css` imports `tailwindcss` directly (Tailwind v4, no config file)

## Environment

- Run `npm install` first; requires **Node >= 22.12.0** (per `engines`)
- The `.env` file (gitignored) contains `DATABASE_URL`, `BETTER_AUTH_SECRET`, `SITE` — it points to a real remote MySQL DB; do not commit it
- `env.d.ts` extends `.astro/types.d.ts` and declares `App.Locals` for `user`/`session` from better-auth

## CI / Deploy

- `.github/workflows/mail.yml`: on push to `main`, runs `npm install` → `npm run build` → uploads `dist/` artifact
- Build adapter is `node` standalone (`dist` is a self-contained Node server)

## Notable Quirks

- TailwindCSS v4 uses `@tailwindcss/vite` plugin in `astro.config.mjs` — no `tailwind.config.*` file exists
- `astro.config.mjs` has a `@ts-ignore` for the TailwindCSS vite plugin type mismatch
- The `site` config in `astro.config.mjs` reads from `process.env.SITE`, falling back to the production domain `https://www.psb.smpitdarussalam.web.id`
- There is no project-level linter, formatter, or typechecker configured beyond Astro's own strict TS setup