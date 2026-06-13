---
aliases: ["StrtDigital"]
project: strtdigital
family: scaffold
version: n/a
status: active
stack: [React, Vite, TypeScript, TailwindCSS, react-router, Recharts]
related: ["[[Websites Index]]", "[[README Conventions]]"]
tags: [website, scaffold, agency, dashboard]
---

# StrtDigital

> Marketing website + internal admin dashboard for StrtDigital ("For All Digital Solutions"), the vault owner's digital-agency brand. Designed Stitch-first, built as one React SPA, deployable to GitHub Pages.

## Stack

- **React 19 + TypeScript + Vite 6** — single SPA.
- **Tailwind CSS 3.4** — brand tokens in `tailwind.config.js`; JS mirror in `src/theme/tokens.ts`.
- **react-router-dom 7** with **`HashRouter`** — static-host friendly (no 404 on deep links).
- **Recharts** — dashboard charts (code-split; only loads in admin).
- **lucide-react** icons, **clsx + tailwind-merge** (`src/lib/cn.ts`).
- Design source: **Google Stitch MCP** project `1621002818835101507`, design system `assets/12515649607487512119` (Sora/Inter, navy/teal/cyan, ROUND_TWELVE).

## Structure

- `index.html` — entry; loads Sora + Inter from Google Fonts.
- `src/App.tsx` — `HashRouter`; public `/` vs lazy-loaded `/admin/*` route groups + auth gate.
- `src/main.tsx`, `src/index.css` — bootstrap + Tailwind layers.
- `src/theme/tokens.ts` — brand colors/gradient for charts & SVG.
- `src/types.ts` — domain types (snake_case → maps 1:1 to future Supabase tables).
- `src/data/content.ts` — static marketing content (services, case studies, testimonials, FAQ…).
- `src/data/seed.ts` — CRM seed (4 users, 12 leads, 14 expenses; some pre-linked).
- `src/store/repository.ts` — **persistence boundary** (localStorage now; Supabase later).
- `src/store/AppDataProvider.tsx` — CRM state, CRUD, **expense↔lead linking**, per-user KPI rollups.
- `src/store/AuthContext.tsx` — **Supabase Auth** gate (signIn/signOut, password reset, session restore).
- `src/lib/supabase.ts` — Supabase client (hardcoded URL + publishable key; remember-me storage adapter).
- `src/components/ui/*` — Button, Card, KPIStat, Table, Modal, Badge, ProgressRing, Logo.
- `src/components/charts/*` — Recharts wrappers (Trend/StageBar/SourceDonut).
- `src/components/marketing/*` — the 9 landing sections.
- `src/components/layout/*` — Navbar/Footer (public); SidebarNav/Topbar/AdminLayout (admin).
- `src/pages/marketing/Home.tsx`, `src/pages/admin/*` — Login, ForgotPassword, ResetPassword, Dashboard, Expenses, LeadsOverview, LeadForm, LeadDetail, UserKPIs.
- `src/components/admin/AuthShell.tsx` — shared light split-panel layout for the auth screens.
- `.github/workflows/deploy.yml`, `public/.nojekyll` — GitHub Pages deploy.

## Features

**Marketing (`/`):** sticky navbar + CTA, oversized hero, 6-card services grid, "Why us" value props, sliding "Growth Stories" case-study carousel, dark process timeline, testimonials, FAQ accordion, full-width gradient closing CTA + contact form, footer. Scroll-reveal + hover states; mobile-first responsive.

**Admin (`/admin`, behind mock login):**
- **Dashboard** — KPI cards (revenue, active leads, conversion, expenses) with trend arrows; revenue-vs-expenses area chart; leads-by-source donut; leads-by-stage bar; working date-range filter.
- **Leads Overview** — kanban board (drag to change stage) **and** table view toggle; quick-stats strip.
- **Lead form** — create/edit/assign (name, company, contact, source, value, stage, owner, notes).
- **Lead detail** — profile, stage workflow, activity timeline (add notes), stage history, and **linked expenses with a running "cost to acquire" total** + add-expense shortcut.
- **Expenses** — documented table (date, category, vendor, amount, receipt, linked lead) with filters, totals row, add/edit modal with **receipt upload**, and **inline expense→lead linking**.
- **Team KPIs** — per-user progress rings/bars vs target + leaderboard (4 sample users).

**Expense↔lead linking is bidirectional:** set from the expense row/modal *or* from a lead's detail; persists via localStorage.

## Data / Backend

- **Auth is live on Supabase** (`src/lib/supabase.ts` + `AuthContext`) — sign-in, sign-out, session restore, and password reset all run client-side (browser → Supabase), so they work on static GitHub Pages.
- CRM **data** (leads/expenses/KPIs) still seeds from `src/data/seed.ts` into **localStorage** via `src/store/repository.ts`. Migrating it to Supabase tables is the next step: all reads/writes go through `repository.ts` + `AppDataProvider`, so swapping in a `supabaseRepo` (tables `users`, `leads`, `expenses` with `expenses.lead_id` FK; Supabase Storage for receipts) is an isolated change — no component edits.
- Drop a `Main_Logo.png` into `public/` to replace the built-in SD-monogram SVG in the navbar/footer/login.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc + vite → dist/ (static)
npm run preview   # serve dist/ locally
```

Admin login at `/#/admin/login` — **real, invite-only Supabase Auth** (no demo creds).
Sign in with a user created/invited in the Supabase dashboard; public signup is disabled.
"Forgot password?" emails a reset link that lands on `/#/admin/reset-password`.

**Supabase dashboard setup (one-time):**
- **Auth → URL Configuration**: add the app's entry URLs to **Redirect URLs** (e.g.
  `http://localhost:5173/`, `https://<user>.github.io/StrtDigital/`, `https://strtdigital.site/`)
  and set **Site URL**. The reset link redirects here; PKCE `?code=` is exchanged on load.
- **Email/SMTP**: password-reset emails need email enabled (built-in sender works for
  low-volume testing; configure custom SMTP for production).
- **RLS**: enable row-level security on your tables before going live — the publishable
  key ships in the public bundle and is not a secret.

## Deploy (GitHub Pages)

- `vite.config.ts` sets `base: "./"` (works at a custom domain *or* `/<repo>/` subpath); `HashRouter` avoids 404s on refresh/deep links.
- Push to `main` → `.github/workflows/deploy.yml` builds and publishes `dist/` to Pages. Enable Pages → "GitHub Actions" in repo settings.

## Related

- [[Websites Index]] — vault map.
- [[README Conventions]] — how this note is structured.
