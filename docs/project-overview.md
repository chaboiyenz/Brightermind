# BrighterMind v2 — Project Overview

Last verified: 2026-09-13, by direct inspection of the repository at `D:\Brightermind 2.0` (branch `yenz`, HEAD `e3a1144`). This document is a standalone snapshot of the current, actual state of the codebase — not a narrative of how it got here. Every claim below was checked against the file(s) named; where a prior doc's claim was cross-checked and found stale, that is flagged explicitly in Section 6.

---

## 1. Tech stack — verified, not assumed

### apps/web (`apps/web/package.json`)

- **Framework**: Next.js `15.1.6`, React `19.0.0` / React DOM `19.0.0`, TypeScript `5.7.3`
- **Styling**: Tailwind CSS `3.4.17`, PostCSS `8.5.28`, Autoprefixer `10.5.5`
- **Lint**: ESLint `9.18.0`, `eslint-config-next` `15.1.6`, `@eslint/eslintrc` `3.3.7`
- **Type defs**: `@types/node` `22.10.7`, `@types/react` `19.0.7`, `@types/react-dom` `19.0.3`

Runtime dependencies:

| Package | Version | Verified usage |
|---|---|---|
| `@radix-ui/react-collapsible` | ^1.1.20 | `components/ui/Disclosure.tsx` — used |
| `@radix-ui/react-dialog` | ^1.1.23 | `components/ui/Modal.tsx` — used |
| `@radix-ui/react-toast` | ^1.2.23 | `components/ui/Toast.tsx` — used |
| `@tanstack/react-query` | ^5.102.8 | 11 files, incl. real-auth login flow (`LoginForm.tsx`'s `useQueryClient`) — used |
| `class-variance-authority` | ^0.7.1 | `Button.tsx`, `Badge.tsx` variant styling — used |
| `clsx` | ^2.1.1 | consumed inside `lib/cn.ts` (the shared `cn()` helper) — used |
| `lucide-react` | ^1.41.0 | 13 files (icons across UI kit and pages) — used |
| `next` | 15.1.6 | app framework |
| `react` / `react-dom` | 19.0.0 | framework |
| `tailwind-merge` | ^3.6.0 | consumed inside `lib/cn.ts` alongside `clsx` — used |

No dead/unused dependency was found in `apps/web` — everything in `package.json` has at least one real import site.

### apps/api

Dependency files: `apps/api/requirements/base.txt`, `dev.txt`, `prod.txt` (no `pyproject.toml`-based dependency list — `pyproject.toml` only configures `ruff` and `pytest`).

**base.txt** (every environment):
```
Django==5.1.6
djangorestframework==3.15.2
django-cors-headers==4.9.0
django-environ==0.12.0
channels==4.2.0
psycopg[binary]==3.2.4
drf-spectacular==0.30.0
```
**dev.txt** (adds): `pytest==8.3.4`, `pytest-django==4.9.0`, `pytest-cov==7.1.0`, `ruff==0.9.4`, `django-stubs==6.1.0`
**prod.txt** (adds): `gunicorn==23.0.0`, `uvicorn[standard]==0.34.0`, `channels-redis==4.3.0`

Cross-checked against `apps/api/config/settings/base.py`:
- `INSTALLED_APPS` includes `channels`, and `ASGI_APPLICATION = "config.asgi.application"` is set, and `CHANNEL_LAYERS` is configured (in-memory in dev, `channels_redis` in prod).
- **However, Channels is installed and wired at the settings level but not actually used anywhere**: there is no `consumers.py` or `routing.py` anywhere in the codebase (`find . -iname consumers.py -o -iname routing.py` returns nothing outside `.venv`). No websocket routes exist. This mirrors the same "installed and fully unused" pattern the v1 audit (`docs/audit-findings.md`) flagged for Django Channels in the old codebase — it has recurred in v2.
- `INSTALLED_APPS`'s local apps: `apps.core`, `apps.accounts`, `apps.screening`, `apps.mood_tracker`, `apps.journal`, `apps.tasks`, `apps.content`, `apps.coping_techniques`, `apps.chat`, `apps.community`, `apps.hotlines`, `apps.feedback` — 12 local Django apps exist.
- **`apps/api/config/urls.py` only wires up 5 of those 12 apps' URLs**: `mood_tracker`, `accounts`, `journal`, `tasks`, `content` (all under `/api/v2/`), plus `/admin/`, `/api/health/`, `/api/schema/`, `/api/docs/`. **`screening`, `coping_techniques`, `chat`, `community`, `hotlines`, and `feedback` have Django app scaffolding (models, migrations) but no URL routing at all** — no real endpoints exist for any of these six domains yet. This directly explains why the corresponding web routes (Section 3) are mock-only with no real/mode-aware option.

### Database — verbatim config

`apps/api/config/settings/base.py`:
```python
DATABASES = {
    "default": env.db("DATABASE_URL"),
}
```
This is genuinely Postgres-capable in principle (`psycopg[binary]==3.2.4` is a real dependency, and `env.db()` parses whatever URL scheme is given), and `prod.py` adds `DATABASES["default"]["OPTIONS"] = {"sslmode": "require"}` — a Postgres-only option, confirming production is meant to run on RDS Postgres.

**But in practice, right now, both local dev and CI run on SQLite**, not Postgres:
- `apps/api/.env` (the actual local file) and `.env.example`: `DATABASE_URL=sqlite:///db.sqlite3`
- `.github/workflows/ci.yml`'s Python job: `DATABASE_URL: sqlite:///db.sqlite3`
- A `db.sqlite3` file (192KB) is present and actively used at `apps/api/db.sqlite3`.

So: **Postgres-configured for production by design, SQLite in actual day-to-day dev/CI use.** No Postgres instance is provisioned anywhere in this repo today (`infra/terraform/` is an empty scaffold — see Section 2).

### Versions / tooling requirements

- **pnpm**: pinned via root `package.json`'s `"packageManager": "pnpm@11.5.2"`; lockfile is `lockfileVersion: '9.0'` (`pnpm-lock.yaml`).
- **Node**: `.github/workflows/ci.yml` pins `node-version: 22` for the JS job (no `engines` field in either `package.json`).
- **Python**: `.github/workflows/ci.yml` pins `python-version: "3.12"`; `apps/api/pyproject.toml`'s `[tool.ruff] target-version = "py312"` confirms the same target.

---

## 2. Repository structure — as it exists on disk right now

```
D:\Brightermind 2.0/
├── .github/
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml
│       ├── dependabot-automerge.yml
│       ├── deploy-dev.yml
│       ├── deploy-prod.yml
│       └── deploy-stage.yml
├── .references/                      # design/audit reference material, not app code
│   ├── UI Library/brightermind-ui-lib/
│   ├── _asset-audit/ (REPORT.md, home-page-media/, icons/, logo/, other/)
│   ├── brightermind-missing-docs/
│   └── roadmap/roadmap.MD
├── apps/
│   ├── api/                          # Django 5.1 + DRF backend
│   │   ├── apps/                     # 12 local Django apps (see §1)
│   │   ├── config/                   # settings (base/dev/prod), urls.py, asgi.py, wsgi.py
│   │   ├── requirements/             # base.txt, dev.txt, prod.txt
│   │   ├── tests/
│   │   ├── db.sqlite3                # active local dev DB
│   │   ├── manage.py
│   │   └── pyproject.toml
│   ├── mobile/                       # EMPTY SCAFFOLD — no real code
│   │   ├── README.md
│   │   ├── assets/.gitkeep
│   │   └── src/{components,lib,screens}/.gitkeep
│   └── web/                          # Next.js 15 + React 19 frontend
│       ├── public/
│       └── src/
│           ├── app/                  # 23 routes — see §3
│           ├── components/
│           │   ├── ui/               # 14 design-system primitives — see §4
│           │   ├── MockRoleProvider.tsx, AuthRoleProvider.tsx, RestrictedPageNotice.tsx
│           │   └── home/ (SiteHeader, SiteFooter, CrisisBanner, FeatureGrid, hotlinesData.ts, etc.)
│           └── lib/
│               ├── api/              # real API client (client, auth, mood, journal, tasks, content, health)
│               ├── mock/             # 14 mock-data fixture files + mockMode.ts flag
│               └── cn.ts
├── docs/                             # see file list below
├── infra/
│   ├── README.md
│   └── terraform/.gitkeep            # EMPTY SCAFFOLD — no actual Terraform/CDK code
├── packages/
│   └── shared/
│       ├── README.md
│       └── src/.gitkeep              # EMPTY SCAFFOLD — no generated types yet
├── scripts/
│   ├── dev-api.mjs
│   └── setup-oidc.sh
├── package.json                      # root workspace scripts (pnpm workspaces)
├── pnpm-workspace.yaml               # packages: apps/*, packages/*
├── pnpm-lock.yaml
├── README.md
└── TDD.MD
```

**Confirmed by direct listing:**
- `apps/mobile` — still an empty scaffold: only a README and `.gitkeep` placeholders in `assets/`, `src/components/`, `src/lib/`, `src/screens/`. No Expo project, no `package.json`, no real screens.
- `packages/shared` — only `README.md` and `src/.gitkeep`. No generated types, no build pipeline. README itself says "scaffold only — generation pipeline not yet wired up."
- `infra/` — only `README.md` and `terraform/.gitkeep`. No Terraform or CDK files exist. README itself says "empty scaffold — infra decisions are not yet final."
- `docs/` contents (full listing): `CODEMAPS/` (empty except `.gitkeep`), `TDD.md`, `audit-findings.md`, `ci-cd/environment-setup.md`, `frontend-migration-plan.md`, `pre-migration-tickets.md`, `prototype-roadmap.md`, `roadmap.md`.
- `.github/` contents (full listing): `CODEOWNERS`, `dependabot.yml`, `ISSUE_TEMPLATE/bug_report.md`, `ISSUE_TEMPLATE/feature_request.md`, `pull_request_template.md`, `workflows/ci.yml`, `workflows/dependabot-automerge.yml`, `workflows/deploy-dev.yml`, `workflows/deploy-stage.yml`, `workflows/deploy-prod.yml`.

---

## 3. Routes — full current inventory

Every directory under `apps/web/src/app/` containing a `page.tsx`, classified by direct inspection of that page and its immediate child components for `isMockMode()`, `@/lib/api` / `fetch` usage, and `@/lib/mock/` usage.

| Route | Classification | Evidence |
|---|---|---|
| `/` | **Mode-aware** | `page.tsx` imports `fetchContentBlock` from `@/lib/api` and `isMockMode`; returns `HOME_FALLBACK` when mock mode is on or the real fetch fails |
| `/about` | **Mode-aware** | Same pattern — `fetchContentBlock` + `isMockMode()` + `ABOUT_FALLBACK` |
| `/login` | **Mode-aware** | `LoginForm.tsx` explicitly branches: `if (isMockMode()) return <MockLoginForm />; return <RealLoginForm />;` — mock form sets a role via `MockRoleProvider`; real form calls `login()` against `@/lib/api` |
| `/signup` | **Mode-aware** | `SignupForm.tsx`: `if (isMockMode()) return <MockSignupForm />;` else calls `registerStudent` from `@/lib/api` |
| `/signup/psychologist` | **Mode-aware** | `PsychologistSignupForm.tsx`: same pattern with `registerPsychologist` |
| `/journal` | **Mode-aware** | `page.tsx`/`JournalApp.tsx`: `isMockMode()` branches between `getMockJournalEntries()` and `fetchJournalEntries` from `@/lib/api` |
| `/mood` | **Mode-aware** | `page.tsx`/`MoodCalendar.tsx`: `isMockMode()` branches between `getMockMoodEntries()` and `fetchMoodEntries` |
| `/tools/todo` | **Mode-aware** | `page.tsx`/`TaskList.tsx`: `isMockMode()` branches between `getMockTasks()` and `fetchTasks` |
| `/screening/gad7` | **Static/mocked** | `Gad7Questionnaire.tsx` has no `@/lib/api` or `@/lib/mock` import at all — it's pure local `useState`; submission is explicitly commented "Mocked submission — no POST to apps/api under this prototype track" |
| `/resources/hotlines` | **Static/mocked** | Renders a hardcoded `HOTLINES` array from `@/components/home/hotlinesData.ts`; no API, no mock-lib import, no mock-mode branch — always the same data |
| `/coping/exercise` | **Static/mocked** | No `@/lib/api`/`@/lib/mock` import; static routine library data, `RoutineTimerModal` is a working client-only timer with no persistence |
| `/coping/yoga` | **Static/mocked** | Same pattern as `/coping/exercise` |
| `/coping/spirituality` | **Static/mocked** | Static content list; `BreathingTimer` is a working client-only timer |
| `/coping/aromatherapy` | **Static/mocked** | Same pattern |
| `/coping/[game]` | **Static/mocked** | `gameData.ts` defines 4 slugs (`defusion`, `distraction`, `mind-management`, `body-scan`); only `defusion` has real gameplay in `MiniGameCanvas.tsx`, the other 3 render a placeholder shell. Score submission is mocked. |
| `/profile` | **Static/mocked** | `page.tsx` calls `getMockProfile()` only — no `isMockMode()` check, no real fetch path exists at all (comment: "swapping `getMockProfile` for the real profile + scores fetch is the only change needed later") |
| `/psychologists` | **Static/mocked** | Calls `getMockPsychologists()` only, no real fetch path |
| `/dashboard` | **Static/mocked (with mode-aware role gating)** | Page content comes from `getMockInbox()` only (no real data path); the surrounding `RoleGate allow={["psychologist"]}` is fed by `MockRoleProvider` in mock mode and `AuthRoleProvider` in real mode (switched in `app/layout.tsx`), so *access control* is mode-aware even though the *data* is mock-only |
| `/admin/patients` | **Static/mocked (with mode-aware role gating)** | `getMockPatients()` only; `RoleGate allow={["admin"]}` — same nuance as `/dashboard` |
| `/admin/analytics` | **Static/mocked (with mode-aware role gating)** | `getMockAnalytics()` only; same `RoleGate` nuance |
| `/admin/psychologists` | **Static/mocked (with mode-aware role gating)** | `getMockPendingPsychologists()` only; `ApprovalRow.tsx`'s `handleDecide("approved"/"rejected")` only mutates local component state — no API call exists to make it real (confirmed no approve/reject endpoint anywhere in `apps/api`) |
| `/community` | **Static/mocked** | `getMockPosts()`/`getMockComments()` only; vote button is "optimistic UI only, no real dedupe/persistence" per its own comment |
| `/messages/[partnerId]` | **Static/mocked** | Imports only from `@/lib/mock/conversations`; `MessageStatusControls.tsx` uses `RoleGate allow={["psychologist"]}` for UI-only gating of controls, but there is no real messaging backend at all |
| `/call/[sessionId]` | **Static/mocked** | `getMockCallSession()` only — a static call-UI shell, no real video integration |

**No inconsistencies found** between what each page's own comments claim and what it actually does — every mock-only page's code comments openly describe it as static/prototype (e.g. `/profile`, `/community`, `/dashboard`), rather than falsely claiming mock-mode support it doesn't have. The one genuine nuance worth calling out for anyone relying on this table: the four admin/dashboard pages and `/messages/[partnerId]` are **mode-aware only for role-gating** (real auth checks the real role in real mode, `MockRoleProvider` fakes it in mock mode) **but mock-only for their actual data** — there is no real backend endpoint behind any of them yet (confirmed: `screening`, `coping_techniques`, `chat`, `community`, `hotlines`, `feedback` Django apps have no URL routing in `config/urls.py`, and no approve/reject endpoint exists for psychologists).

---

## 4. Design system — as actually implemented

### `apps/web/tailwind.config.ts` — full theme

**Color palette** (all defined under `theme.extend.colors`):

| Family | Shades |
|---|---|
| `brand` (primary interactive — deep pine teal) | 50 `#EEF4F2`, 100 `#D3E4DF`, 200 `#A8C9C0`, 300 `#7CAE9F`, 400 `#549384`, 500 `#3A7A6B`, 600 `#2F6F62` (primary), 700 `#255950`, 800 `#1C433C`, 900 `#132C27` |
| `stone` (background/text neutrals — warm off-white) | 25 `#FDFCFA`, 50 `#FAF9F6`, 100 `#F2F0EB`, 200 `#E4E1D9`, 300 `#CBC6B9`, 600 `#6B6659`, 700 `#4A463C`, 800 `#332F28`, 900 `#2B2A28` (primary text) |
| `clay` (sparing warm accent — desaturated clay) | 50 `#FBF3EE`, 100 `#F3DECF`, 400 `#D2A183`, 500 `#C08B6B`, 600 `#A66F51` |
| `sage` (positive/success — muted sage) | 50 `#F1F5EE`, 100 `#DCE7D3`, 500 `#7FA37A`, 600 `#658362` |
| `brick` (errors/severity — muted brick, deliberately not alarm-red) | 50 `#FBF0EE`, 100 `#F0D3CC`, 500 `#B65C4B`, 600 `#98483A` |

**Font family**: `sans: ["var(--font-inter)", "system-ui", "sans-serif"]` — references the CSS variable set by `next/font/google` in the root layout, not a bare `"Inter"` string.

**Border-radius scale**: `sm: "4px"` (inputs, badges), `md: "8px"` (buttons), `lg: "14px"` (cards, modals).

**Other theme extensions**: `keyframes` (`in`/`out` — opacity + `translateY(-4px)` fade) and `animation` (`in: "in 220ms ease-out"`, `out: "out 160ms ease-in"`), backing the `animate-in`/`animate-out` utility classes used by `Disclosure` and `Toast` on Radix `data-[state]` attributes. No plugins are registered (`plugins: []`).

### `apps/web/src/components/ui/` — every component, verified by reading

| File | What it does |
|---|---|
| `Avatar.tsx` | Circular avatar: renders a `next/image` if `imageUrl` given, otherwise falls back to initials computed from `name`; `sm`/`md`/`lg` sizes map to 28/40/56px |
| `Badge.tsx` | Small pill label built with `cva`; `tone` variants (`neutral`/`brand`/`success`/`warning`/`danger`) map onto the stone/brand/sage/clay/brick palette; also exports `severityToTone`/`severityToLabel` helpers used for screening severity display |
| `Button.tsx` | Primary button primitive built with `cva`; `variant` (`primary`/`secondary`/`outline`/`ghost`/`danger`), supports `isLoading`/`disabled` states, uses `forwardRef` |
| `Card.tsx` | Simple bordered/rounded/shadowed container (`Card`) plus `CardHeader`/`CardTitle`/`CardContent` layout sub-parts |
| `ConfirmDialog.tsx` | A `Modal` preset for confirm/cancel destructive-or-not actions, with `isConfirming` loading state |
| `Disclosure.tsx` | Collapsible/accordion built on `@radix-ui/react-collapsible`, chevron icon rotates via `lucide-react`'s `ChevronDown`, uses the `in`/`out` Tailwind animation keyframes |
| `EmptyState.tsx` | Generic empty/failed-state placeholder — title, optional description, optional icon, optional action button; explicitly reused for both genuinely-empty lists and failed-fetch states |
| `Input.tsx` | Text `Input`, `Textarea`, and a `FormField` wrapper (label + control + error text), all sharing one base Tailwind class string, built with `forwardRef` |
| `Modal.tsx` | Dialog built on `@radix-ui/react-dialog`, with an `X` (lucide) close button, title/description slots |
| `RoleGate.tsx` | `RoleContext`/`RoleProvider`/`useRole` context plus a `RoleGate allow={[...]}` component that renders children only if the current role is in the allow-list (else a `fallback`); its own docblock notes it currently has no real backend to call and is UX-only, not real enforcement |
| `ScoreRing.tsx` | SVG circular progress ring (0–100 value + label), deliberately brand-teal colored rather than a game-leaderboard palette, reused by both the Profile page and the mini-games module |
| `Skeleton.tsx` | Base pulsing loading placeholder block (`Skeleton`) plus composed `SkeletonText`/`SkeletonCard` shapes |
| `Table.tsx` | Table primitives (`Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`) wrapped in a horizontally-scrollable bordered container |
| `Toast.tsx` | Toast notification system built on `@radix-ui/react-toast`, with a `ToastProvider`/`useToast()` hook and `neutral`/`success`/`error` tones |
| `index.ts` | Barrel file re-exporting all of the above plus the shared `cn()` class-merge helper from `lib/cn.ts` |

---

## 5. Real vs. mocked table

| Feature area | Status | Notes |
|---|---|---|
| Home / About (`/`, `/about`) | Mode-aware | Real content-block fetch with static fallback |
| Auth — login/signup/psychologist signup | Mode-aware | Real `TokenAuthentication`-backed endpoints exist and are wired; mock mode swaps in a role-picker stand-in |
| Mood Tracker (`/mood`) | Mode-aware | Real `mood_tracker` API wired |
| Journal (`/journal`) | Mode-aware | Real `journal` API wired |
| To-do (`/tools/todo`) | Mode-aware | Real `tasks` API wired |
| GAD-7 screening (`/screening/gad7`) | Not built (real) / Static prototype | No `screening` API routes wired; scoring is purely client-side and explicitly commented as mocked |
| Coping library (exercise/yoga/spirituality/aromatherapy) | Not built (real) / Static prototype | No `coping_techniques` API routes wired; timers are genuinely functional client-side, content/persistence is not |
| Coping mini-games (`/coping/[game]`) | Not built (real) / Static prototype | 1 of 4 games has real gameplay logic; none persist scores server-side |
| Profile + scores (`/profile`) | Not built (real) / Static-only | No mode-aware branch exists at all yet, unlike the Phase 2 pages |
| Psychologist directory (`/psychologists`) | Not built (real) / Static-only | Same |
| Psychologist dashboard (`/dashboard`) | Not built (real) / Static-only, mode-aware gating only | RoleGate is mode-aware; inbox data is not |
| Admin — patients/analytics/psychologist approval | Not built (real) / Static-only, mode-aware gating only | No admin API endpoints exist; approve/reject is local-state only |
| Community feed (`/community`) | Not built (real) / Static-only | No `community` API routes wired |
| Messaging (`/messages/[partnerId]`) | Not built (real) / Static-only | No `chat` API routes wired |
| Video call (`/call/[sessionId]`) | Not built (real) / Static-only | UI shell only, no Chime/Twilio integration |
| Hotlines directory (`/resources/hotlines`) | Not built (real) / Static-only | No `hotlines` API routes wired; hardcoded, unverified-by-human data |
| Mobile app (`apps/mobile`) | Not built | Empty scaffold, no screens |
| Shared types package (`packages/shared`) | Not built | Empty scaffold, no OpenAPI-generated types yet |
| Infra (`infra/`) | Not built | Empty scaffold, no Terraform/CDK |
| Django Channels / websockets | Not built (installed only) | Fully configured in settings, zero consumers/routing — dead dependency in practice |

---

## 6. Known gaps and deferred items

Pulled from `docs/roadmap.md` and `docs/prototype-roadmap.md`, then verified against the actual repo.

### Still open / unchecked, and confirmed still true

- **SECURITY.md missing** (`roadmap.md` Phase 1) — confirmed: no `SECURITY.md` exists anywhere in the repo root. Still open, blocked on picking a reporting-contact email.
- **Django (5.1.6) / DRF (3.15.2) known-CVE upgrade deferred** (`roadmap.md` Phase 1) — confirmed: `requirements/base.txt` still pins exactly these versions; `dependabot-automerge.yml`'s own comment confirms major-version bumps (e.g. a Django bump) are deliberately excluded from auto-merge and left for manual review. Still open.
- **Phase 4/5 pages need real backend work** (`roadmap.md`) — confirmed still entirely unbuilt for all listed pages: GAD-7 scoring API, coping library auth-gated completion-save endpoints, psychologist directory reject-endpoint, dashboard availability-as-current-state model, profile score-aggregation service, mini-games (Ticket 3 / MindManagement reconciliation), community endpoint-split, messaging (polling vs. websocket decision), video call (Ticket 4 / Chime SDK). None of these have any corresponding Django URL routes, confirmed against `config/urls.py`.
- **Coping mini-games: only 1 of 4 has real gameplay** (`prototype-roadmap.md`: "static shell + one working game interaction as a proof of concept") — confirmed via `apps/web/src/app/coping/[game]/gameData.ts`: 4 slugs total (`defusion`, `distraction`, `mind-management`, `body-scan`); only `defusion` is implemented in `MiniGameCanvas.tsx`, the other 3 are placeholders.
- **Hotline numbers unverified** — confirmed still true: `resources/hotlines/page.tsx`'s own on-page copy states "these numbers were sourced from official and independent public listings but have not yet been individually re-verified by a human."
- **Psychologist approval is mocked-only** — confirmed: `apps/accounts/models.py` has `is_approved` (defaults `False`) but no approve/reject endpoint exists in `apps/api` at all; `admin/psychologists/ApprovalRow.tsx`'s `handleDecide()` only updates local component state.
- **Mobile app not started** (`roadmap.md` Phase 6) — confirmed: `apps/mobile` is an empty scaffold (Section 2).
- **Infra not provisioned** (`roadmap.md` Phase 7) — confirmed: `infra/` is an empty scaffold, no Terraform/CDK files exist; no RDS/Postgres instance exists anywhere in this repo.
- **CRUD on the 4 real pages still hits the live API even in mock mode** (`prototype-roadmap.md`'s explicit caveat: "adding a task, saving a journal entry, logging a mood entry, deleting a task or entry still call the real API even under mock mode — only the initial/populated view and To-do's toggle interaction were retrofitted") — this is a design decision documented as intentionally incomplete, not verified further here since it concerns runtime behavior rather than static code presence, but the described `isMockMode()` branch points (initial fetch only, not mutations) match what Section 3 found.

### Flagged as already done, contrary to what a stale reading might suggest

- `docs/roadmap.md` Phase 4 is explicitly marked in the doc itself as "Superseded as of the prototype pivot" and left unedited as a future reference — this is correctly self-aware, not stale. No contradiction found.
- The "Open decision — existing real pages" section in `prototype-roadmap.md` is marked "Decided: (b) — now fully implemented," and this is verified true: `/`, `/about`, `/mood`, `/journal`, and `/tools/todo` all genuinely have working `isMockMode()` branches (Section 3).

### Real gaps found that are NOT mentioned in either roadmap doc

- **Django Channels is installed, fully configured (`ASGI_APPLICATION`, `CHANNEL_LAYERS`, `channels`/`channels-redis` in requirements) but has zero consumers or routing anywhere in the codebase.** This is a dead dependency in practice today, and it's the same pattern the v1 audit (`docs/audit-findings.md`) flagged as a problem in the old codebase — worth noting since neither roadmap doc calls this out for v2 specifically.
- **6 of the 12 local Django apps have no URL routing at all**: `screening`, `coping_techniques`, `chat`, `community`, `hotlines`, `feedback` exist as Django apps (with migrations) but are entirely absent from `config/urls.py`. Neither roadmap doc states this as explicitly as the routing file itself shows it — it's implied by "no endpoint exists" language scattered across Phase 4/5 items, but the full scope (6 whole apps with zero routes) is not spelled out in one place in either doc.
- **`docs/CODEMAPS/` is an empty directory** (only `.gitkeep`) — not mentioned in either roadmap doc; likely intended for `doc-updater`/codemap tooling that hasn't been run yet.

---

*This document supersedes any prior overview/summary doc for currency purposes but does not replace `docs/roadmap.md`, `docs/prototype-roadmap.md`, `docs/frontend-migration-plan.md`, `docs/audit-findings.md`, `docs/TDD.md`, or `docs/pre-migration-tickets.md`, which remain the authoritative planning/history record. This file is a point-in-time factual snapshot, verified by direct file inspection on 2026-09-13 — re-verify before relying on it after further changes land.*
