# BrighterMind — Role-based system plan (prototype)

**Status:** Implemented in `apps/web` on 2026-09-16 (all five phases below, in one pass). Extends
`docs/prototype-roadmap.md`.
**Mockups:** design canvas "BrighterMind Role Shells" (link in the chat handover).

## 0. What changed at implementation time

Decisions taken with the user after the mockup review:

- **The landing page stays as it is, for guests.** Signed-in patients are redirected from `/` to a
  personalised `/home` (check-in, continue where you left off, screening, next session, this week,
  quick links), matching the "Patient: Home (signed in)" mockup. Psychologists go to `/psych`. Logging
  out returns to the landing page. Every feature link on the landing page leads a guest to the new
  `/login`, which returns them to that feature after they pick a role (`?next=`).
- **`/login` is the two-card role picker** in both mock and real mode. The email/password form is kept,
  collapsed, underneath. The mock "Continue with Google" button was removed.
- **Psychologist approvals are inside the workspace** (`/psych/approvals`) rather than left for a later
  admin pass, so no existing feature is unreachable. The `admin` role still exists in code and gets the
  workspace shell too.
- **Shell selection is not done with route groups.** `SiteChrome` picks the shell from the session:
  psychologists get `PsychShell` on every route (including `/messages`, `/call`, `/community`,
  `/coping`), so no page had to move. Only the dashboard and admin pages moved, to `/psych/*`, and
  their old URLs redirect.
- **Session state** lives in `components/SessionProvider.tsx` (`useSession()`): a local prototype
  session (`lib/session/sessionStorage.ts`) that wins over the real `/auth/me/` check whenever it is
  present. Route rules are pure functions in `lib/session/access.ts`, unit-tested with Vitest
  (`pnpm --filter web test`).

## 1. Goal

Move every feature behind a sign-in step while auth is still mocked, and give the two
kinds of users a shell that fits how they use the product:

| Role | Shell | Feel |
|------|-------|------|
| Patient (student) | Top navigation bar, same look as the public website | "I'm still on the BrighterMind site, it just knows me now" |
| Psychologist | Left sidebar workspace | "I'm running my caseload from a control panel" |
| Guest (not signed in) | Public website | Landing page, hotlines, and a **trial** of coping techniques and games |

Login is bypassed in prototype mode: the login page offers **Continue as a patient** and
**Continue as a psychologist**. Picking one sets the mock role, marks the session as signed in,
and redirects into that role's shell. The existing email/password form stays available in a
collapsed "Use email and password" section so the real flow can be wired later without moving anything.

The existing `admin` role stays in code but gets no entry button. Its two pages
(patients, analytics) move into the psychologist workspace. Psychologist approvals stay
admin-only and are out of scope for this pass.

## 2. Access matrix

| Feature | Guest | Patient | Psychologist |
|---------|:-----:|:-------:|:------------:|
| Landing page, About, Hotlines | ✓ | ✓ (as Home, personalised) | link only |
| Coping techniques (exercise, yoga, spirituality, aromatherapy) | trial | ✓ | ✓ (preview / assign later) |
| Mini-games | trial (play, no save) | ✓ (saves progress) | preview |
| Screening (GAD-7, PHQ-9, DASS-21, WHO-5) | sign-in gate | ✓ | see patient results |
| Mood tracker, Journal, To-do | sign-in gate | ✓ | see patient mood snapshot |
| Profile | – | ✓ own | ✓ own (professional) |
| Psychologist directory + Book a session | sign-in gate | ✓ | – |
| Messages | – | ✓ with own psychologist | ✓ with every patient, status controls |
| Video call | – | ✓ join | ✓ start / host |
| Community | read only | ✓ post, vote, comment | ✓ plus moderate (hide, pin) |
| Patients list + patient detail | – | – | ✓ |
| Sessions calendar | – | – | ✓ |
| Analytics | – | – | ✓ |
| Availability toggle | – | – | ✓ |

**Trial rule for guests:** coping pages and games are fully playable. The gate appears
at the *save* moment: "Save this round" or a mood/screening submit opens a **Keep your progress**
sheet with Create account, Log in, or Continue as guest. After the second completed round a soft
banner nudges sign-in. Nothing is blocked mid-activity, which matches the calm tone of DESIGN.md.

## 3. Route map

Next.js route groups give each shell its own `layout.tsx` without changing URLs where they
already exist. Existing pages move into groups. New pages are marked **new**.

```
src/app/
  (public)/               PublicShell: SiteHeader + SiteFooter (current look)
    page.tsx              landing (guest) — redirects signed-in patients to /home,
                          psychologists to /psych
    about/  resources/hotlines/  login/  signup/
    coping/**             trial-enabled (TrialGate wraps the save action)
    community/            read-only for guests
  (patient)/              PatientShell: top nav + avatar menu, footer kept
    home/                 new — personalised landing (check-in, next session, continue)
    screening/**  mood/  journal/  tools/todo/  profile/
    psychologists/        directory + booking (existing page, moved)
    care/                 new — my psychologist, upcoming session, message thread
    messages/[partnerId]/ existing (student ↔ psychologist)
    call/[sessionId]/     existing
  (psych)/                PsychShell: left sidebar + top bar, no marketing footer
    psych/                new — overview (stat tiles, today's sessions, inbox preview)
    psych/patients/       moved from /admin/patients, extended (filters, trend, actions)
    psych/patients/[id]/  new — patient detail (screening history, mood, notes)
    psych/inbox/          moved from /dashboard (InboxTable, AvailabilityToggle)
    psych/sessions/       new — upcoming and past calls
    psych/analytics/      moved from /admin/analytics
    psych/community/      community with moderation controls
    psych/settings/       new — profile, availability hours
    messages/[partnerId]/ shared page (MessageStatusControls already role-gated)
    call/[sessionId]/     shared page
```

Old URLs (`/dashboard`, `/admin/patients`, `/admin/analytics`) get `redirect()` stubs so
bookmarks and the breadcrumb table keep working.

## 4. Session and role state (mock mode)

Extend `MockRoleProvider` rather than adding a second mechanism:

```ts
interface MockSession {
  role: Role;            // "student" | "psychologist" | "admin"
  isSignedIn: boolean;   // false = guest
  signIn(role: Role): void;
  signOut(): void;
}
```

Persisted in localStorage under the existing `bm_mock_role` key plus `bm_mock_signed_in`.
`RoleGate` stays for in-page gating. A new `RequireSession` wrapper replaces
`RestrictedPageNotice` for whole-shell gating: a guest hitting `(patient)` or `(psych)` is
redirected to `/login?next=<path>` instead of seeing an empty state.

Shell selection lives in one place, `SiteChrome`, keyed by pathname prefix and session:
public paths keep the current header, `(patient)` paths render `PatientHeader`, `(psych)`
paths render `PsychSidebar` + `PsychTopbar`.

## 5. UI system per shell

### Patient shell (website feel)
- Same 68 px frosted `SiteHeader`, same 1160 px container, same footer.
- Nav becomes: **Home · Screening · Coping · Games · My care · Community**.
- The "Log in" icon and coral "Book a session" button are replaced on the right by a
  notification bell and an **avatar menu** (Profile, Mood tracker, Journal, To-do, Log out).
  "Book a session" moves into the My care page so the header keeps one accent at most.
- New `/home` reuses the landing sections but personalised: greeting, check-in card, "Your next
  session", "Continue where you left off", "Screening due", quick links. No hero copy.

### Psychologist shell (workspace feel)
- Left sidebar 264 px, white surface, hairline right border. Items 44 px tall, 12 px radius,
  active state `brand-50` background with `brand-700` text. Inbox item carries a count badge.
- Sidebar footer: avatar, name, availability toggle, Log out.
- Top bar 64 px: page title, search, availability pill, avatar.
- Content on the linen canvas with the same Card / Table / Badge primitives. Density is higher
  than the patient side but still follows DESIGN.md (no red alerts, severity stays "warning").
- Collapses to an icon rail at < 1024 px and a bottom sheet drawer at < 640 px.

### Guest trial
- Top nav shows a small **Trial** pill next to Games while playing as a guest.
- Post-game `ScoreSubmitPrompt` keeps its layout; "Save this round" opens `KeepProgressSheet`.
- Copy stays encouraging, never blocking: "Save this round to see your progress over time."

## 6. Implementation phases

| Phase | Scope | Touches |
|-------|-------|---------|
| 1. Session + entry | `MockSession`, role-card login page, redirects, `RequireSession` | `MockRoleProvider`, `login/page.tsx`, `LoginForm.tsx`, `SiteChrome.tsx` |
| 2. Patient shell | Route group, `PatientHeader`, avatar menu, `/home`, `/care`, nav links | `siteLinks.ts`, new `components/patient/*`, moves of existing pages |
| 3. Psychologist shell | Route group, sidebar + topbar, overview, patients (list + detail), inbox, sessions, analytics, settings | new `components/psych/*`, moves of `/dashboard` and `/admin/*`, new mock fixtures (sessions, patient detail, notes) |
| 4. Guest trial | `TrialGate`, `KeepProgressSheet`, attempt counter, trial pill, read-only community | `coping/[game]/ScoreSubmitPrompt.tsx`, `gameAttempts.ts`, `community/*` |
| 5. Polish | Mobile nav for both shells, breadcrumbs table update, redirect stubs, tests for session state and gating | `Breadcrumbs.tsx`, tests |

Each phase is demoable on its own with `NEXT_PUBLIC_MOCK_MODE=true`.

## 7. Decisions to confirm

1. **Admin role**: fold patients + analytics into the psychologist workspace and leave approvals
   for a later admin pass. (Proposed: yes.)
2. **Landing page after sign-in**: patients land on `/home` (personalised), not the marketing `/`.
   The marketing page stays reachable from the footer.
3. **Trial limit**: gate only at the save moment plus a nudge after the second round, rather than a
   hard cap on plays. (Proposed: no hard cap.)
4. **Community for guests**: read-only, or hidden entirely? (Proposed: read-only.)
5. **Booking**: keep the coral "Book a session" only inside My care and the directory, so the
   patient header has no accent button.
