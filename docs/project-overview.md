# BrighterMind v2 — Project Overview

Last verified: 2026-09-19, by direct inspection of the repository at `D:\Brightermind 2.0` (branch `fix/navbar-active-state`, which contains 100% of `dev` plus one small fix commit — `origin/dev` and local `dev` are identical, no divergence). This document is a standalone snapshot of the current, actual state of the codebase, superseding the 2026-09-13 version of this file — that version described `MockRoleProvider`, `FeatureGrid`, and a 23-route inventory that no longer exist. Every claim below was checked against the file(s) named.

The redesign work reconciled here landed via four merged PRs between 2026-09-10 and 2026-09-16, by contributors "Gens" and "Daniel Pagilagan": #77/#80 ("redesignUI"/"redesingUI"), #84 ("boni" — screening tools, dark mode, animation), and #85 ("new-feature" — the full role-based auth/shell system). All are on `dev`, not stray unmerged work.

---

## 1. Tech stack — verified, not assumed

### Root (`package.json`)
- `packageManager`: `pnpm@11.5.2`
- `concurrently` `^10.0.5` (dev script orchestration)
- No `engines` field; CI (`.github/workflows/*.yml`) pins Node `22` and Python `3.12`

### `apps/web` (`apps/web/package.json`)
- **Framework**: Next.js `15.1.6`, React `19.0.0` / React DOM `19.0.0`, TypeScript `5.7.3`
- **Styling**: Tailwind CSS `3.4.17`, PostCSS `8.5.28`, Autoprefixer `10.5.5`
- **Testing — new since the last audit**: `vitest` `^3.2.7`, with `"test": "vitest run"` / `"test:watch": "vitest"` scripts. Real test files exist: `src/lib/session/access.test.ts`, `src/lib/session/sessionStorage.test.ts` — the new auth/routing logic is actually unit-tested, not just implemented.
- **Theming — no library.** No `next-themes` or any theming package. Fully custom: CSS custom properties in `globals.css`, resolved through `tailwind.config.ts`, persisted via `localStorage` key `bm-theme` (`themeStorage.ts`), applied via a `data-theme` attribute set by an inline pre-hydration script.
- Runtime deps unchanged from before: `@radix-ui/react-{collapsible,dialog,toast}`, `@tanstack/react-query` `^5.102.8`, `class-variance-authority` `^0.7.1`, `clsx`/`tailwind-merge` (inside `lib/cn.ts`), `lucide-react` `^1.41.0`.

### `apps/api`
- Settings module is package-style: `apps/api/config/settings/{base,dev,prod}.py` (not a flat `settings.py`).
- `base.txt`: `Django==5.1.6`, `djangorestframework==3.15.2`, `django-cors-headers==4.9.0`, `django-environ==0.12.0`, `channels==4.2.0`, `psycopg[binary]==3.2.4`, `drf-spectacular==0.30.0`.
- `dev.txt` adds `pytest`, `pytest-django`, `pytest-cov`, `ruff`, `django-stubs`. `prod.txt` adds `gunicorn`, `uvicorn[standard]`, `channels-redis`.
- `INSTALLED_APPS` local apps: `core`, `accounts`, `screening`, `mood_tracker`, `journal`, `tasks`, `content`, `coping_techniques`, `chat`, `community`, `hotlines`, `feedback`.
- Auth: DRF `TokenAuthentication`, `IsAuthenticated` default permission. `AUTH_USER_MODEL = "accounts.User"`.
- DB is Postgres-shaped (`psycopg` installed, `prod.py` sets `sslmode=require`) but **local `.env`/CI both actually run SQLite** (`DATABASE_URL=sqlite:///db.sqlite3`).
- `channels` is installed and wired (`ASGI_APPLICATION`, `CHANNEL_LAYERS`) but **no `consumers.py`/`routing.py` exists anywhere** — installed and unused, the same dead-dependency pattern `docs/audit-findings.md` flagged in v1.

---

## 2. Auth/session system

### 2.1 Intended design (`docs/role-based-system-plan.md`, PR #85's own spec)

Three shells by session state: **guest** → public website with a trial of coping techniques/games; **patient** (role `student`) → same website chrome, now with an avatar menu and a personalised `/home`; **psychologist**/**admin** → a left-sidebar workspace at `/psych/*` that absorbs the old `/dashboard` and `/admin/*`. Login is bypassed in prototype mode via two role cards on `/login`. Guests get a real trial for coping/games (gated only at the *save* moment via a "Keep your progress" sheet), but screening/mood/journal/etc. are a hard sign-in gate from the first click. Shell selection happens once, in `SiteChrome`, keyed by pathname + session — not via Next.js route groups.

### 2.2 Actual implementation — confirmed by reading the code

- **Roles are unchanged**: `Role = "student" | "psychologist" | "admin"` (`components/ui/RoleGate.tsx`). "Patient" is UI copy for the `student` role, not a new role — no renaming happened.
- **`MockRoleProvider` (the old bottom-left "Prototype role" switcher) is deleted outright**, not extended. Replaced by `SessionProvider` (`components/SessionProvider.tsx`) + `AccessGate` (`components/site/AccessGate.tsx`) + `lib/session/{access,sessionStorage}.ts`.
- **Session shape**: `PrototypeSession = { role: Role; isSignedIn: boolean }` — a real, distinct signed-in flag, not implied by role selection.
- **Storage**: `localStorage`, keys `bm_mock_role` and `bm_session_signed_in` (`sessionStorage.ts`). This is a real discrepancy worth flagging: `role-based-system-plan.md` §4 says the plan was to keep `bm_mock_role` plus add `bm_mock_signed_in` — the shipped key is `bm_session_signed_in`, and `MockRoleProvider` was deleted rather than extended as the plan said. Corrected in `docs/prototype-roadmap.md`.
- **Sign-in**: only via `/login`'s `RoleEntryCards` (two cards: "I'm here for myself" / "I'm a psychologist") calling `useSession().signIn(role)`, which writes both localStorage keys and redirects via `postLoginDestination()`. The old real-mode username/password form still exists on the same page, collapsed, and still works against the real API — it does not touch the prototype session.
- **Sign-out**: `AvatarMenu`'s "Log out" calls `signOut()`, which clears both localStorage keys and does a **hard navigation** to `/` (`window.location.assign`), deliberately not a state update — avoids a race with `AccessGate` redirecting the now-guest user mid-navigation.
- **Guest/logged-out state is real and is the default.** `GUEST_SESSION = { role: "student", isSignedIn: false }`. A fresh visitor with empty `localStorage` is a guest; `AccessGate` actively enforces this by redirecting to `/login?next=<path>` for any gated route.
- **Route protection**: `AccessGate` wraps `children` in `SiteChrome`, computing `getAccessDecision(pathname, session)` from `lib/session/access.ts`. Three outcomes: `allow`, `redirect` (to `/login?next=...` or a legacy URL), `forbidden` (renders `RestrictedPageNotice`). This is UX routing only — explicitly documented as not a security boundary; the API must enforce the same rules server-side (it currently doesn't have role-aware endpoints to enforce against yet).
- **Real-mode fallback**: when not in mock mode and no local session exists, `SessionProvider` calls the real `GET /api/v2/auth/me/`-equivalent (`fetchCurrentUser`) exactly as the old `AuthRoleProvider` did — this path is untouched by the redesign.

### 2.3 Gating rules, exactly as coded (`lib/session/access.ts`)

| Rule array | Prefixes | Effect |
|---|---|---|
| `AUTH_PREFIXES` | `/login`, `/signup` | shell = `"auth"` (`MinimalSiteHeader`, no footer) |
| `SIGNED_IN_PREFIXES` | `/screening`, `/mood`, `/journal`, `/tools`, `/profile`, `/psychologists`, `/messages`, `/call`, `/care`, `/home` (+ all of `/psych`) | guest → redirect to `/login?next=` |
| `PATIENT_ONLY_PREFIXES` | `/screening`, `/mood`, `/journal`, `/tools`, `/profile`, `/psychologists`, `/care`, `/home` | forbidden for psychologist/admin |
| `PSYCH_PREFIXES` | `/psych` | forbidden for student |
| `LEGACY_REDIRECTS` | `/dashboard`, `/admin/patients`, `/admin/analytics`, `/admin/psychologists` | hard `redirect()` to the `/psych/*` equivalent, regardless of session |

`/messages` and `/call` are signed-in-gated but **not** patient-only — both roles reach them, correctly, since psychologists message/call patients from their own workspace.

**Everything not in any array is not gated at all.** Confirmed ungated: `/`, `/about`, `/resources/hotlines` (intentionally public), and the entire `/coping/**` tree including `/coping/[game]` (intentionally a guest trial, per an explicit code comment in `access.ts`).

**Gap found in this audit — flagged, not fixed**: `/community` is **not gated**, even though it's wired into both `PATIENT_NAV` and `PSYCH_NAV` as if it were a members-only feature, and has a real post/comment composer. Unlike `/coping`, there is no comment anywhere marking this as an intentional guest trial (the plan's §2 access matrix even says guests get "read only", not full unauthenticated access) — this reads as an oversight, not a decision, and needs one.

### 2.4 Nav visibility — is "hide links until signed in" already solved?

**Yes, for the top-level nav.** `SiteHeader.tsx` picks `PATIENT_NAV` vs `PRIMARY_NAV` from `isSignedIn` (`const navLinks = isPatient ? PATIENT_NAV : PRIMARY_NAV`) and swaps the right-hand controls: guests get a "Log in" icon + coral "Book a session" button; signed-in patients get a notification bell + `AvatarMenu` instead. Psychologists/admins never see `SiteHeader` at all — `SiteChrome` renders `PsychShell` (a different sidebar component) for that shell, so there's no shared-header logic to leak between roles.

Guest nav (`PRIMARY_NAV`): Screening · Coping · Games · Counselling · Community — all in-page anchors on `/`.
Patient nav (`PATIENT_NAV`): Home · Screening · Coping · Games · My care · Community — real routes.

---

## 3. Design system — one coherent system with a genuine repaint, not two clashing ones, with two real exceptions

**This is the headline finding.** `tailwind.config.ts` was **fully rewritten**, not left alone with a CSS-variable layer bolted on top. Every color utility (`brand`, `stone`, `clay`, `sage`, `brick`) is generated by a `scale()` helper that maps each step to `rgb(var(--brand-600) / <alpha-value>)` — Tailwind classes now *are* the CSS-variable system, not a separate thing sitting beside it. Same token **names** as before the redesign; the actual **values** were repainted (e.g. `brand-600` moved from a teal `#2F6F62` to a forest green `rgb(69 102 77)` / `#45664D` in light mode) — a genuine visual redesign, not a technical refactor. New additions: a `display` font (Plus Jakarta Sans, for headings/buttons), a named type scale (`display`, `display-sm`, `headline-{lg,md,sm}`, `label-{lg,md,sm}`), a wider radius scale (`sm` 4px → `2xl` 24px, replacing a 3-step scale), theme-aware shadow tokens (`shadow-soft`/`shadow-float`/`shadow-coral`), and animation keyframes for specific new widgets (`breathe` for the breathing pacer, `drift` for the defusion game's leaves).

The actual color values live in `src/app/globals.css` as RGB triplets, one block for light ("Serene Restorative Sanctuary") and one for dark ("Evening Pine"), resolved by: bare `:root` = light, `@media (prefers-color-scheme: dark)` applies dark unless `data-theme="light"` is set, `data-theme="dark"` forces dark, and a `.theme-dark` class scopes dark styling to one subtree (used for surfaces that are dark-by-design regardless of theme, e.g. the video call room). This is documented in a new `docs/DESIGN.md` (Material-Design-token-shaped YAML front matter, 262 lines) which **is itself accurate** — it matches the code exactly, including the `bm-theme` storage key.

**Component-library consistency — genuinely mixed, but the mechanism means most of it rides along for free:**
- `Button.tsx`, `Card.tsx`, `Badge.tsx`, `ScoreRing.tsx` were **explicitly updated** to the new shape language: pill buttons (`rounded-full`), 20px card radius (`rounded-xl` per the new scale), `font-display` on titles/buttons, `shadow-soft`. `Button`'s own docblock now cites `docs/DESIGN.md` by name.
- `Input.tsx`/`FormField`/`Table.tsx` were **not visually refreshed** but aren't broken either — they use token names (`border-stone-300`, `focus:ring-brand-500`) that resolve through the new CSS vars automatically, they just never got the newer pill/shadow treatment (arguably correct — forms and tables aren't supposed to look like marketing buttons).
- **The two exceptions found in the previous audit are fixed (2026-09-19, demo-polish pass):**
  1. `components/ui/Modal.tsx` and `components/ui/Toast.tsx` now use `shadow-float` (the same theme-aware token `AvatarMenu`'s dropdown already used) instead of raw Tailwind `shadow-lg`/`shadow-md`. Verified in both themes via Playwright screenshots (`e2e/theme.spec.ts`) — see §5.
  2. `src/app/psych/analytics/SeverityDistributionChart.tsx`'s bar fills and baseline stroke now use Tailwind `fill-brand-{200,400,700,900}`/`stroke-stone-200` classes instead of hardcoded hex literals, so they resolve through the same CSS variables as everything else and correctly invert the ramp direction in dark mode (confirmed by screenshot — light theme goes light→dark green low→high severity, dark theme correctly goes dark→light). No `MOOD_LEVELS`-style documented exception was needed here, unlike that case: this was plain SVG with no chart-library constraint forcing literal hex, so full conversion was possible.

**Verdict, plainly, as asked**: this is **one coherent design system that got a real repaint**, executed well at the primitive level (`Button`/`Card`/`ScoreRing` and every new section component consume the token/CSS-var mechanism correctly and consistently) — not two systems awkwardly coexisting. The two components and one chart that were missed by the retheme pass are now fixed; the design system has no known theme-inconsistent surfaces as of this audit.

---

## 4. Full route inventory (current)

Legend — **Mode**: `real` (calls `@/lib/api`, no mock branch) · `mock-aware` (branches on `isMockMode()`) · `mock-only` (fully static/mock, no live-API path at all yet) · `redirect` (no UI, pure `redirect()`). **Gate**: shell from `access.ts`, or "—" if ungated.

| Route | Mode | Gate | Nav |
|---|---|---|---|
| `/` | mock-aware | — (redirects signed-in users to their home) | `PRIMARY_NAV` |
| `/about` | mock-aware | — | `FOOTER_PEOPLE_LINKS` |
| `/resources/hotlines` | mock-only | — | `HOTLINES_LINK` |
| `/login` | mock-only | auth | `LOGIN_LINK` |
| `/signup` | mock-only | auth | linked only from `/login` |
| `/signup/psychologist` | mock-only | auth | linked only from `/login`/`/signup` |
| `/community` | mock-only | **— (see §2.3 gap)** | `PRIMARY_NAV`, `PATIENT_NAV`, `PSYCH_NAV` |
| `/screening/gad7`, `/phq9`, `/dass21`, `/who5` | mock-only, **not persisted** | signed-in, patient-only | not in nav; linked from home page content |
| `/mood` | mock-aware | signed-in, patient-only | `PATIENT_MENU_LINKS`, footer |
| `/journal` | mock-aware | signed-in, patient-only | `PATIENT_MENU_LINKS`, footer |
| `/tools/todo` | mock-aware | signed-in, patient-only | `PATIENT_MENU_LINKS`, footer |
| `/profile` | mock-only | signed-in, patient-only | `PATIENT_MENU_LINKS` |
| `/psychologists` | mock-only | signed-in, patient-only | `BOOK_LINK` |
| `/messages/[partnerId]` | mock-only | signed-in (both roles) | reached via CTAs, not nav |
| `/call/[sessionId]` | mock-only | signed-in (both roles) | reached via CTAs, not nav |
| `/care` | mock-only | signed-in, patient-only | `PATIENT_NAV` ("My care") |
| `/home` | mock-only | signed-in, patient-only; also the post-login patient landing | `PATIENT_NAV` ("Home") |
| `/coping`, `/coping/exercise`, `/coping/yoga`, `/coping/aromatherapy`, `/coping/spirituality`, `/coping/[game]` | mock-only | — (intentional guest trial) | `PATIENT_NAV` ("Coping"/"Games") for the index; children reached via cards |
| `/dashboard`, `/admin/patients`, `/admin/analytics`, `/admin/psychologists` | redirect | — (`LEGACY_REDIRECTS` fires first) | dead URLs, not in nav |
| `/psych` | mock-only | psych-only; post-login psych landing | `PSYCH_NAV` ("Overview") |
| `/psych/patients`, `/psych/patients/[id]` | mock-only | psych-only | `PSYCH_NAV` ("Patients") / reached via table rows |
| `/psych/inbox` | mock-only | psych-only | `PSYCH_NAV` ("Inbox") |
| `/psych/sessions` | mock-only | psych-only | `PSYCH_NAV` ("Sessions") |
| `/psych/screenings` | mock-only | psych-only | `PSYCH_NAV` ("Screenings") |
| `/psych/analytics` | mock-only | psych-only | `PSYCH_NAV` ("Analytics") |
| `/psych/approvals` | mock-only, confirmed a real working page (not a stub) | psych-only | `PSYCH_NAV` ("Approvals") |
| `/psych/settings` | mock-only | psych-only | `PSYCH_NAV` ("Settings") |

Only 6 routes have any live-API code path at all (`/`, `/about`, `/mood`, `/journal`, `/tools/todo`, plus real-mode `/login`) — everything else, including the entire `/psych/*` workspace, `/home`, `/care`, `/community`, and all four screening tools, is mock-only today. No `route.ts` API handlers exist under `apps/web/src/app` — all "real" calls hit the separate `apps/api` Django backend.

---

## 5. Known gaps and inconsistencies found in this audit

1. ~~`/community` ungated despite being nav-linked as a members feature~~ — **checked, not a bug (2026-09-19)**. Every interactive action (`VoteButton.tsx`, `CommentThread.tsx`, `PostList.tsx`) already checks `useSession().isSignedIn` and shows a `SignInPrompt`/toast instead of acting — guests get exactly the "read only" access the plan's own matrix specifies, already covered by `access.test.ts`. The only real gap was that `lib/session/access.ts` had no comment saying so (unlike `/coping`'s explicit one) — added one, no behavior changed.
2. **Screening tools (`/screening/*`) persist nothing** — client-side scoring only, no write to `lib/api` or `lib/mock`, despite being gated as if they were a real per-user feature like `/mood`/`/journal`. Still open.
3. ~~`Modal`/`Toast` use raw `shadow-lg`/`shadow-md`~~ — **fixed (2026-09-19)**, see §3.
4. ~~`SeverityDistributionChart.tsx` hardcodes stale pre-redesign hex values~~ — **fixed (2026-09-19)**, see §3.
5. **`ScreeningSection.tsx`'s `ToolRow`** uses a fixed 64px column for the instrument code; "DASS-21" (7 characters) wraps onto two lines while GAD-7/PHQ-9/WHO-5 (5 characters) don't — a small, confirmed-by-screenshot visual bug. Still open — found again during the 2026-09-19 demo-path walkthrough but out of that pass's bounded scope (see §7).
6. **Guest-facing screening copy overpromises**: the home hero's "Take a 2-minute check-in" CTA and the `Gad7Preview` live-question mockup both imply instant guest access, but every screening link hard-redirects a guest to `/login` first (correctly, per the access matrix) — inconsistent with the *actual* guest trial coping techniques/games get. Not a bug against the written plan, but a real UX/copy mismatch worth a decision. Still open.
7. **`role-based-system-plan.md` §4 is stale against its own "Implemented" claim** — see §2.2's key-name discrepancy. Corrected in `docs/prototype-roadmap.md`, not edited in `role-based-system-plan.md` itself (left as the historical plan document).

---

## 6. Doc inventory and staleness (see `docs/prototype-roadmap.md` and `docs/roadmap.md` for the corrections themselves)

| Doc | Status |
|---|---|
| `docs/DESIGN.md` | Accurate — matches the shipped theme system exactly, including the `bm-theme` key |
| `docs/TDD.md` | Not applicable — historical foundational design doc, not a live tracker |
| `docs/audit-findings.md` | Not applicable — v1 (pre-migration) audit log, correctly historical |
| `docs/frontend-migration-plan.md` | Partially stale — still useful as a component/data reference, but its auth section never anticipated `SessionProvider`; forward-looking, not descriptive of current code, so not severely stale |
| `docs/pre-migration-tickets.md` | Not applicable — v1 ticket log, a one-time input artifact |
| `docs/roadmap.md` | Accurate for its actual scope (the real-backend migration path; Phase 3's real auth is still exactly what `SessionProvider` falls back to) — added a pointer to this file and the prototype docs so it's not mistaken for describing the mock/prototype system |
| `docs/prototype-roadmap.md` | Was partially stale (PR #53 home page description, admin route URLs, GAD-7-only screening note); corrected in this audit |
| `docs/role-based-system-plan.md` | Was partially stale (§4 localStorage key names / "extend MockRoleProvider"); flagged, left as the historical plan document rather than rewritten |
| `docs/project-overview.md` | This file — was severely stale (described deleted `MockRoleProvider`/`FeatureGrid`, a 23-route inventory); replaced in full by this audit |

---

## 7. Demo-polish pass (2026-09-19) — visual fixes, Playwright, demo-path audit

Follow-up to the audit above, closing out the three retheme misses from §3/§5 and adding automated coverage so manual QA (role-gating, hover states, screenshot verification) stops being a recurring bottleneck.

**Visual fixes**: `Modal`, `Toast`, and `SeverityDistributionChart` are now fully theme-aware — see §3 for the mechanism, and `e2e/theme.spec.ts` for the automated proof (committed screenshot baselines under `e2e/theme.spec.ts-snapshots/`).

**`/community` gating**: confirmed not a bug, documented as intentional in `access.ts` — see §5, item 1.

**Playwright**: installed in `apps/web` (`@playwright/test`, config at `apps/web/playwright.config.ts`), wired as a new `e2e` job in `.github/workflows/ci.yml` alongside `js`/`python`, running against a production build (`pnpm build && pnpm start`) on a dedicated port (3100) rather than `next dev` on 3000 — dev-mode's on-first-hit route compilation and a habitually-occupied port 3000 in this environment both produced false failures during setup (a redirect that hadn't happened yet looked identical to a broken gate). **Non-blocking for now** (`continue-on-error: true`) — this is the suite's first pass and hasn't proven itself stable in CI yet; promote to blocking once it has been green for a while. HTML report + trace-on-first-retry uploaded as a CI artifact.

Also added: `pnpm --filter web test` (Vitest) to the existing `js` CI job — it was a literal `TODO` in `ci.yml` ("once apps/web has a test framework configured") that Vitest's own arrival (§1) had already resolved without the CI job catching up.

Suite scope, and one deliberate scope cut:
- **Sign-in/sign-out** (`e2e/auth.spec.ts`): role-card sign-in persists across reload, nav swaps to `PATIENT_NAV`; `AvatarMenu` sign-out clears the session and returns to the guest header.
- **Role-gating matrix** (`e2e/role-gating.spec.ts`): guest redirect-with-`next`, the `/coping`+`/community` guest trial, patient/psychologist cross-forbidding, legacy URL redirects, signed-in landing-page redirect — mirrors `access.test.ts`'s own cases end-to-end through real navigation.
- **Theme screenshots** (`e2e/theme.spec.ts`): light/dark, scoped to exactly the three fixed surfaces plus the home page as a general baseline — not a full-app snapshot matrix.
- **Video call** (`e2e/call.spec.ts`) — **scoped down from a two-context Jitsi handshake test.** `CallRoom.tsx` embeds a **real** `meet.jit.si` iframe (a public third-party service), not a mock room — confirmed by reading the code before writing the test. A deterministic CI assertion that two browser contexts actually connect to each other would depend on that free public service's live availability and its "first participant must sign in" quirk (documented in `CallRoom.tsx`'s own comment), which isn't something a smoke suite should be flaky against. Flagging this rather than building brittle CI around it: the test instead covers the page's own shell (loads, mounts the iframe container, shows a connecting status, controls render) with fake-media-stream flags so Chromium doesn't hang on a real camera/mic prompt.

**Demo-path audit** (home → mock sign-in → a few gated pages → sign-out, screenshotted at desktop, mobile, and both themes): clean. No console/network errors, no broken links, no unstyled fallback states found along the actual walkthrough path. One thing found again but intentionally left out of this pass's bounded scope: the `ScreeningSection.tsx` `ToolRow` column-width wrap on "DASS-21" (§5, item 5) — real, but off the literal demo path (home's screening list isn't part of the signed-in walkthrough; `/home`'s own screening card doesn't have the same fixed-width column).
