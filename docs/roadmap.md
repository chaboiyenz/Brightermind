# BrighterMind v2 — Chronological Roadmap

Last updated: 2026-09-09. Check items off as they land; this is a living
document, not a fixed spec — update it as decisions get made (see TDD §9 open
questions, which several phases below depend on).

---

## Phase 0 — Foundation (DONE)

- [x] Audit of BrighterMind v1 (structure, security findings, migration mapping table)
- [x] Technical Design Document (stack, architecture, security model)
- [x] 4 pre-migration tickets written (SECRET_KEY rotation, role model, MindManagement
      reconciliation, video calling rebuild)
- [x] Django → React/Next.js frontend migration plan (17 modules, PORT/REDESIGN
      classification, component breakdowns)
- [x] GitHub CI/CD scaffolding: `ci.yml`, `deploy-dev/stage/prod.yml`, PR/issue
      templates, CODEOWNERS, AWS OIDC setup script, environment setup guide
- [x] Repo scaffolded, git initialized, `dev`/`stage`/`main` branches created and pushed
- [x] Shared UI component library built (Button, Card, Modal, ConfirmDialog, Toast,
      Input/FormField, Table, Badge, Avatar, EmptyState, Skeleton, ScoreRing,
      Disclosure, RoleGate) with design tokens
- [x] `apps/web` bootstrapped: Next.js 15 + TypeScript + Tailwind, UI library wired in
- [x] `apps/api` bootstrapped: Django 5.1 + DRF + Channels, custom User model with
      `student/psychologist/admin` role field (**Ticket 2's core piece — done**)
- [x] `apps/web` ↔ `apps/api` wired together (typed API client, health-check call
      working, CORS confirmed)

---

## Phase 1 — Close out loose ends (DONE)

- [x] Merge PR #3 (`feature/wire-web-to-api` → `dev`)
- [x] Resolve `db.sqlite3` tracked-in-git issue
- [x] Fill in real CI jobs in `ci.yml` — lint/typecheck/build/test for `apps/web`,
      ruff/pytest/migration-check for `apps/api`, plus advisory dependency audits
      (PR #6)
- [x] Reconcile diverged `main` branch (merged via PR #27; `main` now tracks `dev`)
- [x] Remove `/ui-test` scratch page (PR #24)

**Decisions locked in:**
- [x] PostgreSQL — already the operating default (TDD §4.4's recommendation is
      what's actually implemented: `psycopg`, `DATABASE_URL`-driven config,
      RDS-shaped settings). No formal MySQL counter-proposal ever came up: treat
      this as settled unless someone actively raises it.
- [x] The 4 untracked tickets filed as GitHub issues: community endpoint-split +
      vote dedupe (#37), hotline-CRUD auth fix (#38), score-aggregation service
      extraction (#39), GAD-7 scoring duplication fix (#40)
- [x] SECURITY.md — deferred (see below), tracked rather than forgotten

**Still open, not blocking Phase 2:**
- [ ] SECURITY.md — needs a real reporting-contact email decided before launch
      (GitHub's private vulnerability reporting requires GitHub Advanced Security,
      a paid feature we're not using for a private repo at this stage)
- [ ] `Django` (5.1.6) and `djangorestframework` (3.15.2) have real known CVEs —
      Dependabot's major-bump PR for Django was closed as a known-breaking bump
      rather than merged (see `.github/workflows/dependabot-automerge.yml`). Worth
      a dedicated, deliberately-tested upgrade PR, not a drive-by bump.

---

## Phase 2 — First page transfers: low complexity, zero blockers

Pick these first — they don't wait on anything else and build momentum/patterns
for the harder pages later.

- [x] Mood Tracker (`/mood`) — REDESIGN, already the cleanest existing view (PR #35)
- [x] Journal (`/journal`) — REDESIGN (PR #42)
- [x] To-do list (`/tools/todo`) — PORT, built fresh with proper auth from the start
      rather than porting v1's missing-auth bug (PR #43)
- [x] Home / About (`/`, `/about`) — PORT, static/ISR content with a fallback path
      for API-unreachable builds (PR #44)

---

## Phase 3 — Auth (DONE, PR #45)

- [x] Login / Signup / Psychologist signup (`/login`, `/signup`, `/signup/psychologist`)
- [x] Reusable DRF permission classes (`IsStudent`, `IsPsychologist`, `IsAdmin`) built
      against the role field, unit tested
- [x] `RoleGate`/`RoleProvider` on the frontend wired to the real `/auth/me/`
      endpoint, replacing the mocked role from Phase 0
- [x] Architecture decision: switched from session cookies to DRF
      `TokenAuthentication` — this also genuinely fixed the cross-origin SSR gap
      documented through Phase 2 (verified: authenticated data now actually
      renders server-side, not just client-side after hydration)

**Decided:**
- [x] Headless captcha — explicitly **skipped for now**, to revisit as its own
      ticket before real launch. Login/signup ship without it.

---

## Phase 4 — Medium complexity pages, each with one clear prerequisite

> **Superseded as of the prototype pivot.** Active work now follows
> [`docs/prototype-roadmap.md`](./prototype-roadmap.md) instead — real
> backend/auth for these pages is deferred until that prototype track's
> Phase D review decides whether to resume this plan as-is. Left unedited
> below as the eventual full-implementation reference.

- [ ] GAD-7 screening (`/screening/gad7`) — fix client/server scoring duplication in
      the API first, then build the paginated one-question-per-screen flow
- [ ] Exercise & Yoga (`/coping/exercise`, `/coping/yoga`) — fix missing auth on
      completion-save endpoints first, then build the shared `RoutineTimerModal`
- [ ] Spirituality + Aromatherapy (`/coping/spirituality`, `/coping/aromatherapy`) —
      split the admin add/delete path out of the student-facing view first
- [ ] Psychologist directory & approval workflow (`/psychologists`,
      `/admin/psychologists`) — needs a working reject-endpoint built (doesn't exist
      today) and Ticket 2's admin gating
- [ ] Psychologist dashboard & availability (`/dashboard`) — needs availability
      modeled as current-state, not "latest log row," fixed in the API first

---

## Phase 5 — High complexity: genuinely blocked, don't start early

- [ ] Profile + score summary (`/profile`) — blocked until the score-aggregation
      service (7-model summing loop) is extracted into a real endpoint
- [ ] Coping mini-games (`/coping/[game]`) — blocked on Ticket 3 (MindManagement
      reconciliation) and the distraction magic-number decision
- [ ] Community feed (`/community`) — blocked on the endpoint-split + vote-dedupe
      ticket from Phase 1
- [ ] Messaging (`/messages/[partnerId]`) — blocked on the polling-vs-websocket
      decision and Ticket 2's ownership checks
- [ ] Video call (`/call/[sessionId]`) — fully blocked on Ticket 4 (Chime SDK
      integration) shipping server-side first; no frontend work before that
- [ ] Admin dashboards (`/admin/patients`, `/admin/analytics`) — blocked on Ticket 2,
      the N+1 query fix, and the `-9` magic-number fix in analytics

---

## Phase 6 — Mobile

- [ ] Bootstrap Expo app in `apps/mobile`
- [ ] Port the shared design tokens to React Native (NativeWind or StyleSheet
      equivalents of the web tokens)
- [ ] Rebuild the Phase 2–5 pages as native screens, roughly in the same order,
      once each page's web version is stable — mobile follows web, not parallel,
      per the TDD's migration path (§8)

---

## Phase 7 — Infrastructure & deployment

- [ ] Decide Terraform vs. AWS CDK (TDD §9, still open)
- [ ] Provision dev environment: VPC, RDS (Postgres), S3, App Runner
- [ ] Turn `deploy-dev.yml`'s TODO lines into real deploy steps
- [ ] Scope down the placeholder IAM policy in `setup-oidc.sh`
- [ ] Repeat for staging, then production (manual-approval gated)
- [ ] Enable RLS policies on Postgres once the data model is stable enough to write
      real per-role policies against
- [ ] Video provider final decision: Amazon Chime SDK (recommended) vs. Twilio —
      needed before Ticket 4 can actually ship

---

## Phase 8 — Hardening & launch readiness

- [ ] Regulatory/compliance pass: Data Privacy Act considerations for screening
      and mood data (consent language, retention policy, breach notification)
- [ ] Full security re-audit of the new codebase (mirroring the original v1 audit)
      before this goes anywhere near real users
- [ ] Load/performance check now that the N+1 and score-aggregation fixes are in
- [ ] Updated study documentation reflecting the finalized broader user scope
      (still TBD as of this roadmap)

---

## How to use this doc

- Work top to bottom within a phase; phases 2–5 can interleave somewhat (e.g. start
  Phase 3 auth work while someone else does Phase 2's Mood Tracker), but don't jump
  into Phase 5 items before their listed blockers are actually resolved — that's
  exactly the kind of shortcut the original audit found in v1.
- Update the checkboxes as things land, and update TDD §9 in parallel whenever an
  open question here gets a real answer.