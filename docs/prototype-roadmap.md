# BrighterMind v2 — Prototype Roadmap (Design-First Pivot)

**Status:** Active track, as of this pivot. Supersedes `docs/roadmap.md` Phase 4
onward *for now* — that document remains the eventual full-implementation plan
and isn't discarded, but new work follows this track until the team decides to
resume it.

## Why this pivot

Real backend + real auth + real data for every remaining page is a lot of
implementation work per page, and auth/data architecture is still likely to
change (see `docs/roadmap.md` Phase 3's note that token auth may get revisited).
Building deeply-wired pages against infrastructure that's likely to shift means
redoing work. Instead: build every remaining page as a **static, mocked
prototype** — real component structure, real design, fake data — so design and
flow can be reviewed and iterated on fast, without betting real engineering time
on architecture that isn't settled yet.

**What this is:** a design/UX prototype recreating v1's pages, improved, using
the shared UI library and design tokens already built.

**What this is not:** a functioning product. No real API calls, no real
database, no real authentication for anything built under this track.

## Ground rules for everything built under this track

1. **No live API calls.** Every page uses static/mock data — hardcoded arrays,
   local JSON fixtures, or an in-memory mock — not `fetch()` against `apps/api`.
2. **Auth is a static role switcher, not real login.** A simple dev-only control
   (e.g. a dropdown or toggle) to preview a page as `student` / `psychologist` /
   `admin`, backed by `RoleProvider` from the shared UI library with a hardcoded
   role — no real login form submission, no real token, no real backend check.
3. **Design fidelity matters, correctness doesn't — yet.** Content can be
   placeholder/lorem where real content isn't decided (e.g. GAD-7 wording,
   exercise library content) — flag these clearly in the code with a comment
   and in this doc, don't silently invent clinical content.
4. **Reuse the shared UI library and design tokens** (`Button`, `Card`, `Modal`,
   `ScoreRing`, etc., and the brand/stone/clay/sage/brick palette) — this
   pivot is about speed and fidelity to *this* design system, not a new one.
   Still true after the 2026-09 redesign work: the same token *names* are
   reused everywhere, now resolved through CSS variables (`docs/DESIGN.md`)
   so a light/dark toggle works — the actual color *values* were repainted
   (e.g. brand-600 moved from a teal to a forest green), and `Button`/`Card`/
   `ScoreRing`/`Badge` were updated to the new shape language (pill buttons,
   20px card radius). `Modal` and `Toast` were **not** updated and still use
   a raw Tailwind `shadow-lg`/`shadow-md` instead of the new theme-aware
   `shadow-soft`/`shadow-float` — see `docs/project-overview.md` §3 for the
   full design-system audit.
5. **Keep it easy to swap in the real backend later.** Structure mock data
   fetching behind a single function/hook per page (e.g. `useMockMoodEntries()`)
   so replacing it with a real API call later is a one-function change, not a
   rewrite of the component tree.

## Open decision — existing real pages

Mood Tracker, Journal, To-do, Home/About, and real auth (PRs #35, #42, #43,
#44, #45) are already built and wired to the real API. Under this pivot,
decide one of:
- **(a)** Leave them wired to the real API as-is; only *new* pages from here
  use mock data. Prototype won't be fully standalone (needs the API running
  to demo those 4 pages).
- **(b)** Retrofit those 4 to also support a static/mock mode (e.g. behind an
  env flag), so the whole prototype can be demoed with zero backend running.

**Decided: (b) — now fully implemented.** `/` (PR #53), and `/mood`,
`/journal`, `/tools/todo`, and `/about` (mock-mode retrofit PR) all support
`NEXT_PUBLIC_MOCK_MODE`, using the same `isMockMode()` pattern: real fetch
when mock mode is off, static fallback data when it's on or when the real
fetch errors. The whole prototype is now demoable with zero backend running.
One caveat, flagged rather than silently built around: create/edit/delete
actions on those four pages (adding a task, saving a journal entry, logging
a mood entry, deleting a task or entry) still call the real API even under
mock mode — only the initial/populated view and To-do's toggle interaction
were retrofitted. This is the last remaining piece if full CRUD mocking is
wanted later.

---

## Prototype Phase A — Screening & coping pages

Recreating v1's content-heavy pages, improved per the original migration plan's
REDESIGN notes — same design direction as before, just static data instead of
a real API.

- [x] GAD-7 screening (`/screening/gad7`) — uses the real standard GAD-7
      instrument text (Spitzer et al., 2006), not placeholder copy; still
      flagged for a licensing/appropriateness sign-off before real users, and
      for the fact that a completed screening is not persisted anywhere
      (client-side scoring only, no `lib/api`/`lib/mock` write)
- [x] PHQ-9, DASS-21, WHO-5 screening (`/screening/phq9`, `/screening/dass21`,
      `/screening/who5`) — added later than this doc originally scoped (not
      in the audit that produced this checklist); same pattern as GAD-7:
      real instrument text, static scoring, no persistence. All four are
      listed together on the home page's "Start where you are" section.
- [x] Exercise & Yoga (`/coping/exercise`, `/coping/yoga`) — static routine
      library (flag: needs real content decision), `RoutineTimerModal` fully
      functional (it's just a client-side timer, no backend needed for this
      to actually work)
- [x] Spirituality + Aromatherapy (`/coping/spirituality`, `/coping/aromatherapy`)
      — static content list, `BreathingTimer` fully functional (same reason —
      client-side only)
- [x] Coping mini-games (`/coping/[game]`) — static shell + one working game
      interaction as a proof of concept; score submission mocked (no need to
      wait on Ticket 3's MindManagement reconciliation for a static prototype)

## Prototype Phase B — Profile, directory, dashboards

- [x] Profile + score summary (`/profile`) — static `ModuleScores`, real
      `ScoreRing` rendering (no need to wait on the real score-aggregation
      service for a mocked view) — PR #54
- [x] Psychologist directory (`/psychologists`) — static list of psychologists
- [x] Psychologist dashboard (`/dashboard`) — static inbox, availability
      toggle works locally (client state only, no persistence)
- [x] Admin dashboards (`/admin/patients`, `/admin/analytics`) — static table
      + chart with plausible mock data. **Superseded 2026-09-16**: both URLs
      are now dead `redirect()` stubs (kept only for old bookmarks) — the
      real pages moved to `/psych/patients` and `/psych/analytics` as part
      of the role-based shells work below, alongside a new `/psych/approvals`
      (a genuinely new page, not one of the original two)

## Built but previously unplanned

- **Home landing page redesign (PR #53) — SUPERSEDED, twice.** Not originally
  scoped in this doc. PR #53 added `SiteHeader`/`SiteFooter`, `CrisisBanner`,
  `FeatureGrid` (static feature highlight cards), and `homeContent.ts`. None
  of that structure describes today's home page: `FeatureGrid` and the old
  `HeroGraphic` decorative SVG are **deleted from the codebase**. Two later
  rebuilds (PRs #77/#80 "redesignUI", #84, 2026-09-10 → 09-15) replaced the
  whole page with 8 sections — `HeroSection` (now with a `CheckInCard` mood
  widget instead of the SVG), `ScreeningSection`, `CopingSection`,
  `GamesSection`, `TrackSection`, `CounsellingSection`,
  `CommunityLearnSection`, `TrustStrip` — plus a real light/dark theme
  (`ThemeToggle`, `docs/DESIGN.md`). `SiteHeader`/`CrisisBanner` and the
  `isMockMode()` fallback pattern from PR #53 are still current; the rest of
  that bullet is history, not current state. See `docs/project-overview.md`
  §2–3 for what's actually on `/` today.

- **Role-based shells (2026-09-16), PR #85.** See
  `docs/role-based-system-plan.md` — note that doc's own §4 (session state)
  is itself slightly stale against what shipped: it says "extend
  `MockRoleProvider`" and a `bm_mock_signed_in` storage key, but the actual
  implementation **deleted** `MockRoleProvider` outright and replaced it with
  `SessionProvider` + `AccessGate`, storing `bm_mock_role` and
  `bm_session_signed_in` (not `bm_mock_signed_in`) in `localStorage`. What
  did ship as planned: `/login` became a two-card role picker
  (`RoleEntryCards`); signed-in patients keep the website chrome (avatar
  menu, `/care`, personalised `/home`); psychologists/admins get a sidebar
  workspace at `/psych/*` that absorbed `/dashboard` and `/admin/*` (old URLs
  now redirect, confirmed working); guests can still play coping techniques
  and games untouched, gated only at the save moment. Ground rule 2's
  "static role switcher" is now the login page itself rather than a
  bottom-left control — that control (`MockRoleProvider`'s "Prototype role"
  switcher) no longer exists anywhere in the codebase.
  **One gap found in this audit, not part of the original plan**:
  `/community` is not gated by `AccessGate`/`access.ts` at all, even though
  it's wired into both the signed-in patient and psychologist nav as if it
  were a members-only feature — unlike `/coping`, there's no code comment
  marking this as an intentional guest trial, so it reads as an oversight
  worth a decision.

## Prototype Phase C — Social & communication

- [x] Community feed (`/community`) — static posts/comments, vote button
      works locally (optimistic UI only, no real dedupe/persistence) — PR #55
- [x] Messaging (`/messages/[partnerId]`) — static conversation thread, no
      real-time behavior (this is the one area where "no polling/websocket"
      is actually fine for a prototype, since it was an open architecture
      question anyway) — PR #56
- [x] Video call (`/call/[sessionId]`) — static "call" UI shell only (camera
      preview if easy, no real Chime/Twilio integration) — just enough to
      review the surrounding chrome/UX, not a working call — PR #56

## Prototype Phase D — Review

- [ ] Full click-through of every static page, both as a design review with
      stakeholders and as a gut-check on whether v1's flows are actually
      worth preserving as-is or worth changing further
- [ ] Decide what happens next: resume `docs/roadmap.md`'s real Phase 4
      onward, using this prototype as the settled design spec — or keep
      iterating on the static version first

---

## What does NOT change because of this pivot

- The shared UI library, design tokens, and existing real pages/auth stay as
  they are — this pivot doesn't undo any completed work.
- `docs/roadmap.md`, `docs/frontend-migration-plan.md`, `docs/audit-findings.md`,
  and the ticket backlog remain the reference for what "real" looks like later
  — this prototype should follow their design/complexity notes even while
  skipping their backend requirements.
- CI/CD, rulesets, Dependabot automation — untouched, keep running as normal.

## Note on "most likely to get changed"

If auth architecture changes again later (e.g. token auth gets revisited),
that's exactly why this pivot exists — none of the Phase A/B/C work above
depends on it, so a future auth change won't require touching any of these
pages.