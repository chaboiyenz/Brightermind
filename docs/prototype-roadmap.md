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

**Decided: (b).** Retrofit is in progress but not complete — `/` has a
mock-mode branch (`isMockMode()` short-circuits to static fallback content,
see PR #53), but `/mood`, `/journal`, `/tools/todo`, and `/about` do not yet
support mock mode and still require the real API to be running. Do not treat
this decision as fully implemented until all four are retrofitted.

---

## Prototype Phase A — Screening & coping pages

Recreating v1's content-heavy pages, improved per the original migration plan's
REDESIGN notes — same design direction as before, just static data instead of
a real API.

- [x] GAD-7 screening (`/screening/gad7`) — static question set (flag: needs
      real validated instrument text before this is anything but a placeholder
      flow), one-question-per-screen, mocked severity result on submit
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

- [ ] Profile + score summary (`/profile`) — static `ModuleScores`, real
      `ScoreRing` rendering (no need to wait on the real score-aggregation
      service for a mocked view) — **not built yet, next unblocked item**
- [x] Psychologist directory (`/psychologists`) — static list of psychologists
- [x] Psychologist dashboard (`/dashboard`) — static inbox, availability
      toggle works locally (client state only, no persistence)
- [x] Admin dashboards (`/admin/patients`, `/admin/analytics`) — static table
      + chart with plausible mock data

## Built but previously unplanned

- **Home landing page redesign (PR #53).** Not originally scoped in this doc.
  Added `SiteHeader`/`SiteFooter` (shared nav/footer chrome, now used by
  `/resources/hotlines` too), `CrisisBanner` (persistent hotline banner under
  the header), `FeatureGrid` (static feature highlight cards), and
  `homeContent.ts` (static fallback copy + the still-placeholder crisis
  hotline number). `/` now has a real-API-with-mock-fallback pattern via
  `isMockMode()` — the only page with that pattern so far (see the open
  decision above).

## Prototype Phase C — Social & communication

- [ ] Community feed (`/community`) — static posts/comments, vote button
      works locally (optimistic UI only, no real dedupe/persistence)
- [ ] Messaging (`/messages/[partnerId]`) — static conversation thread, no
      real-time behavior (this is the one area where "no polling/websocket"
      is actually fine for a prototype, since it was an open architecture
      question anyway)
- [ ] Video call (`/call/[sessionId]`) — static "call" UI shell only (camera
      preview if easy, no real Chime/Twilio integration) — just enough to
      review the surrounding chrome/UX, not a working call

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