# BrighterMind v2 — Django → React/Next.js Frontend Migration Plan

Grouped by the same 17 feature capabilities as the audit's migration mapping table,
so nothing gets missed and nothing is double-counted. Two tickets gate this plan
structurally:

- **Ticket 2 (role model)** — every "who can see/do this" check below (`RoleGate`,
  server-side auth checks) currently has no backend concept to call. Anything
  marked "blocked on Ticket 2" can be scaffolded with mock roles but shouldn't be
  wired to real permission logic until that ticket lands.
- **Ticket 4 (video calling)** — the video call page is designed here against the
  rebuilt Chime-based flow, not the current shared-Jitsi-room behavior. It cannot
  actually be built until Ticket 4 ships.

**Shared UI library** (`apps/web/components/ui/`) — called out once here instead of
repeated per page: Button, Card, Modal, ConfirmDialog (replaces every `confirm()`
call in `script.js`), Toast, Input/Textarea/FormField, Table, Badge/Pill, Avatar,
EmptyState, Skeleton, ScoreRing (circular progress, reused across profile/mini-games),
Disclosure (replaces the seven duplicate `xTogglePopup()` functions), RoleGate
(client wrapper around Ticket 2's role field).

---

## 1. Auth & account creation
`signin, signup, createprof, staff` → `/login`, `/signup`, `/signup/psychologist`

**Classification:** PORT. Functional flow, no emotional design lift needed — the
value here is speed and clarity, not atmosphere.

**Components**
- `LoginPage` (Server, shell) → `LoginForm` (Client — owns `useState` for form
  fields + submit/error state; needs browser captcha widget)
- `SignupPage` (Server) → `SignupForm` (Client — same reasoning; multi-field form
  with client-side validation before submit)
- `PsychologistSignupForm` (Client) — longer form (license number, qualification,
  years of experience, expertise, bio); same state pattern as `SignupForm`, kept
  separate rather than a shared "big form with conditional fields" component, since
  the two flows diverge completely server-side

```ts
interface LoginFormValues { username: string; password: string; captchaId: string; captchaAnswer: string }
interface SignupFormValues { username: string; firstName: string; lastName: string; email: string; password1: string; password2: string; image?: File }
interface PsychologistSignupFormValues extends SignupFormValues {
  licenseNumber: string; qualification: string; yearsOfExperience: number; areaOfExpertise: string; contactNumber: string; bio?: string
}
```

**Data:** `POST /api/v2/auth/login/`, `POST /api/v2/auth/register/`,
`POST /api/v2/auth/register/psychologist/`. All client-side fetch (form submission,
not initial page data) via a thin `useAuth()` hook wrapping React Query mutations.
Loading: submit button spinner + disabled form. Error: inline field errors from
DRF's error shape, plus a toast for non-field errors (e.g. "invalid credentials").

**Old logic that must move:** the captcha challenge/response cycle moves from
session-rendered form fields to a headless flow — component requests a challenge
id + image URL, submits id+answer alongside the form. `StaffUserSignupForm`'s
"hash password + set `is_staff`" logic was previously unguarded in the view; do not
port that as a public-facing form at all — it becomes an admin-only action gated
by Ticket 2's role model, not a signup page.

**Complexity:** Medium — three separate signup shapes plus a captcha integration
that doesn't exist as a headless flow yet. Blocked on Ticket 2 only for the
staff-creation path, not student/psychologist signup. Shared components: Input,
Button, FormField, Toast.

---

## 2. Profile + cross-module score summary
`profile, edit_profile` → `/profile`, `/profile/edit`

**Classification:** REDESIGN — this is the user's core "how am I doing" view;
worth a calmer, clearer presentation than a flat data dump.

**Components**
- `ProfilePage` (Server — fetches profile + score summary server-side, passes as props)
- `ProfileHeader` (Server) — avatar, name, grade; props: `{ user: UserSummary; profile: Profile }`
- `ScoreSummaryPanel` (Server, unless charts need client interactivity — then
  Client) — renders per-module `ScoreRing`s; props: `{ scores: ModuleScores }`
- `MoodSnapshot` (Client — small inline calendar strip, hover interactions) —
  props: `{ recentMoods: MoodEntry[] }`
- `EditProfileForm` (Client — owns form state) — props: `{ initial: ProfileEditable }`

```ts
interface ModuleScores {
  tasks: number; defusion: number; exercise: number; yoga: number;
  distraction: number; mindManagement: number; relaxation: number; total: number;
}
interface Profile { image?: string; twitter?: string; facebook?: string; instagram?: string; address?: string; phoneNumber?: string; grade?: string }
```

**Data:** `GET /api/v2/profile/me/`, `GET /api/v2/profile/me/scores/`. Server-side
fetch for initial render. Loading: server-rendered skeleton only on client-side
re-fetch after edit; initial load has no loading state since it's server-rendered.
Error: a `ProfileError` boundary rendering "couldn't load your profile — retry".

**Old logic that must move:** the 7-model score-summing loop currently living in
`views.py`'s `profile` view must become the `/scores/` endpoint's job, not a
frontend calculation. This is explicitly flagged in the audit as needing a real
service layer; do not build `ScoreSummaryPanel` against a "sum these 7 arrays
client-side" API shape.

**Design notes (REDESIGN):**
- Replace the flat "Total Score: N" number with the `ScoreRing` set — one ring per
  module, muted teal/green fills rather than a stark leaderboard aesthetic.
- Surface the mood snapshot as a soft 7-day strip on the profile itself.
- De-emphasize raw point totals in favor of trend language.

**Complexity:** High — depends directly on the score-aggregation service existing
(currently only a view-level loop). Blocked on: the aggregation logic being
extracted to a real endpoint. Shared components: ScoreRing, Avatar, Card.

---

## 3. Mood tracker
`mood, save_mood, get_moods` → `/mood`

**Classification:** REDESIGN — explicitly named as a core emotional surface.

**Components**
- `MoodTrackerPage` (Server — fetches the current month's entries server-side)
- `MoodCalendar` (Client — click interactions, month navigation) — state:
  `selectedDate: string | null`, `visibleMonth: { year: number; month: number }`
- `MoodEntryModal` (Client — form state for mood + note) — state: `mood: MoodValue`,
  `note: string`, `isSaving: boolean`
- `MoodDayCell` (Server, pure presentational) — props:
  `{ date: string; mood?: MoodValue; isToday: boolean; onSelect: () => void }` —
  note: needs to be a Client Component in practice since it takes an `onClick`

```ts
type MoodValue = 'happy' | 'neutral' | 'sad' | 'excited' | 'anxious';
interface MoodEntry { date: string; mood: MoodValue; note?: string }
```

**Data:** `GET /api/v2/mood-entries/?month=YYYY-MM`, `POST /api/v2/mood-entries/`.
Server-side fetch for the initial month; client-side (React Query) for month
navigation and the create mutation. Loading: skeleton calendar grid (7×5 grey
cells). Error: inline banner in the calendar area, never a blank calendar.

**Old logic that must move:** the duplicate-entry-for-same-day check currently
lives only in the `save_mood` view (audit flagged the missing DB constraint) — the
frontend must not assume one-entry-per-day is guaranteed until the backend adds
the `unique_together(user, date)` constraint; until then, `MoodEntryModal` should
handle a 409/validation error from the API gracefully.

**Design notes (REDESIGN):**
- Replace flat emoji-in-a-grid-cell with a soft color wash per mood.
- Slide-up modal instead of an inline form.
- Optional short reflection prompt in the note field.

**Complexity:** Low — already the cleanest existing view. Shared components:
Modal; `MoodDayCell` is page-specific.

---

## 4. GAD-7 screening
`gad7` → `/screening/gad7`

**Classification:** REDESIGN — explicitly named ("screening flow," "reduced
cognitive load").

**Components**
- `Gad7Page` (Server — fetches latest response server-side for the "your last
  result" state)
- `Gad7Questionnaire` (Client — owns all 7 answers + running total) — state:
  `answers: Record<string, 0|1|2|3>`, `currentStep: number`
- `Gad7ResultCard` (Server) — props: `{ totalScore: number; severity: Severity }`
- `Gad7ProgressIndicator` (Client — needs live `currentStep`) — props:
  `{ step: number; total: 7 }`

```ts
type Severity = 'minimal' | 'mild' | 'moderate' | 'severe';
interface Gad7Response { responses: Record<string, 0|1|2|3>; totalScore: number; severity: Severity; timestamp: string }
```

**Data:** `POST /api/v2/gad7/responses/`, `GET /api/v2/gad7/responses/latest/`.
Server-side fetch for "latest result" on page load; client-side mutation on
submit. Loading: submit button spinner. Error: keep the user's answers in place
and show a retry toast — never clear a half-completed screening on a network error.

**Old logic that must move:** scoring (sum → severity band) is currently computed
twice — once client-side in `script.js`'s `calculateScore()` for the live running
total, once server-side in the view for the saved record. The severity banding
rule itself (≤4 minimal, ≤9 mild, ≤14 moderate, >14 severe) must live in exactly
one place going forward: the backend, returned in the POST response. The
frontend's live running-total display during the questionnaire is fine to compute
client-side (it's just addition) — but the severity label shown to the user should
come from the API response, not a second copy of the if/elif ladder in a component.

**Design notes (REDESIGN):**
- One question per screen with a progress indicator, not all 7 stacked in a long form.
- Calm, non-alarming color language for higher severity results — avoid red/alarm
  styling; pair the score with a clear, supportive next step.
- Autosave-in-progress answers to local state so navigating back a step never
  loses an answer.

**Complexity:** Medium — mostly UI/flow work once the scoring-duplication issue is
resolved on the backend. No ticket blocks this directly, but flag the
scoring-duplication fix as a prerequisite regardless.

---

## 5. Journal
`journal, edit_journal, delete_journal` → `/journal`

**Classification:** REDESIGN — personal reflective writing is an emotional
surface, not a utility list.

**Components**
- `JournalPage` (Server — fetches entries server-side)
- `JournalEntryList` (Server) — props: `{ entries: JournalEntry[] }`
- `JournalEntryCard` (Server, unless expand/collapse is added — then Client)
- `JournalEditor` (Client — owns draft title/content + dirty state) — state:
  `title: string`, `content: string`, `isDirty: boolean`

```ts
interface JournalEntry { id: number; title: string; content: string; createdAt: string; updatedAt: string }
```

**Data:** `GET /api/v2/journal-entries/`, `POST /api/v2/journal-entries/`,
`PATCH/DELETE /api/v2/journal-entries/:id/`. Server-side fetch for the list;
client-side mutations with optimistic updates on delete (audit flagged no
confirmation dialog issue — replace the raw `confirm()` with the shared
`ConfirmDialog`). Loading: skeleton list of 3 card placeholders. Error:
`EmptyState`-shaped error card, not a silent failure.

**Old logic that must move:** none of significant weight — this was already clean
CRUD in Django. The one thing to fix, not port: `delete_journal`'s GET-request
fallback path (audit noted `edit_journal`'s form doesn't repopulate on GET
properly) — the new `JournalEditor` should always load full entry content before
allowing edits, never a partial/empty form.

**Design notes (REDESIGN):**
- Distraction-free full-bleed editor rather than a small textarea in a page template.
- Warm, paper-like background tone for the writing surface specifically.
- Autosave drafts locally every few seconds rather than relying on an explicit
  save button alone.

**Complexity:** Low — straightforward CRUD, no dependent tickets. Shared
components: ConfirmDialog, Card.

---

## 6. To-do list
`todo_list, add_task, update_task, delete_task` → `/tools/todo`

**Classification:** PORT — a utility, not an emotional surface.

**Components**
- `TodoPage` (Server)
- `TaskList` (Client — needs optimistic toggle) — state: none owned beyond React
  Query cache
- `TaskItem` (Client — checkbox interaction) — props:
  `{ task: Task; onToggle: (id: number) => void }`
- `AddTaskForm` (Client — form state)

```ts
type Priority = 'low' | 'medium' | 'high';
type TaskCategory = 'work' | 'personal' | 'shopping';
interface Task { id: number; title: string; notes?: string; deadline?: string; priority: Priority; category: TaskCategory; isCompleted: boolean; score: number }
```

**Data:** `GET /api/v2/tasks/`, `POST /api/v2/tasks/`,
`PATCH /api/v2/tasks/:id/toggle/`. All client-side (React Query) after an initial
server fetch, since toggling is a frequent, latency-sensitive interaction best
handled with optimistic updates. Loading: skeleton rows. Error: inline row-level
error state if a toggle fails, reverting the optimistic UI change.

**Old logic that must move:** the score increment/decrement-on-toggle rule (+1
complete, `max(score-1, 0)` un-complete) moves to the toggle endpoint's response —
the frontend applies the score delta the API returns, it doesn't compute +1/-1
itself. Soft-delete (`deleted` boolean) becomes a real filtered queryset
server-side; the frontend just calls DELETE and trusts the list endpoint.

**Complexity:** Low. Shared components: none beyond base Input/Button; note
`update_task`'s missing `@login_required` (audit finding) must be fixed before
this endpoint is trusted.

---

## 7. Exercise & Yoga modules
`exercise_view, yoga_view` + save/add/delete quartets → `/coping/exercise`, `/coping/yoga`

**Classification:** REDESIGN — named as coping-technique pages in the brief.

**Components**
- `ExerciseLibraryPage` / `YogaLibraryPage` (Server — nearly identical, worth a
  shared `<MovementLibraryPage kind="exercise"|"yoga">` rather than two parallel
  implementations)
- `RoutineCard` (Server) — props: `{ routine: Routine }`
- `RoutineTimerModal` (Client — owns countdown state) — state:
  `secondsRemaining: number`, `isRunning: boolean`
- `CompletionToast` (Client, transient)

```ts
interface Routine { id: number; name: string; imageUrl: string; description: string }
interface Completion { routineName: string; score: number; timeTaken: string /* consider a duration-seconds number instead, per audit */ }
```

**Data:** `GET /api/v2/exercises/` | `/api/v2/yoga/`, `POST .../completions/`.
Server-side fetch for the library list; client-side for the completion POST at
the end of a timed routine. Loading: skeleton grid of routine cards. Error:
EmptyState ("couldn't load routines — retry").

**Old logic that must move:** the timer/popup toggle logic currently duplicated
across 7 near-identical `script.js` functions collapses into the one shared
`RoutineTimerModal` + `Disclosure` pattern. The audit's `time_taken`-as-free-text-
string finding means the frontend should not assume a parseable duration format
from the API until the backend switches to a real duration type.

**Design notes (REDESIGN):**
- Replace popup-style timers with a calm full-screen focus mode during an active
  routine.
- Consistent illustration treatment across exercise/yoga cards.
- Gentle completion feedback rather than an abrupt score-number popup.

**Complexity:** Medium — mostly a UI/timer-component consolidation exercise; the
completion-save endpoints currently have no auth at all (audit finding) and must
be fixed before going live, though that doesn't block frontend design work.
Shared components: `RoutineTimerModal` should itself be the shared component
reused by module 9's aromatherapy breathing timer.

---

## 8. Coping mini-games
`defusion_game, distraction/submit_score, mind_management ×2, save_score, bodyscan` → `/coping/[game]`

**Classification:** REDESIGN — named explicitly.

**Components**
- `MiniGamePage` (Server, generic shell parametrized by game slug)
- `MiniGameCanvas` (Client — the actual game/interaction, differs per game but
  shares a scoring-submission contract)
- `ScoreSubmitPrompt` (Client) — state: `score: number`, `hasSubmitted: boolean`

```ts
interface MiniGameAttempt { gameSlug: 'defusion' | 'distraction' | 'mind-management' | 'body-scan'; score: number }
```

**Data:** `POST /api/v2/games/:slug/attempts/` — one unified shape for all four
games, replacing today's four separate models/views. Client-side only. Loading:
n/a beyond a submit spinner. Error: retry toast on failed submission, game state
preserved.

**Old logic that must move — flag, don't guess:** this is the one place where the
frontend plan cannot be finalized yet. Per Ticket 3, `MindManagement` vs
`MindManagementScore` needs reconciling before `mind-management`'s attempt shape
is settled, and per the audit, distraction's "only save `score===20`" rule is a
hardcoded backend quirk the frontend has no visibility into today — do not build
`MiniGameCanvas` for distraction against "score is only meaningful at exactly 20";
that rule needs to either become a real threshold constant returned by the API or
be removed, not silently baked into a React component too.

**Design notes (REDESIGN):**
- One consistent "mini-game" shell (score display, calm start/end screens) across
  all four, instead of four visually unrelated pages.
- Post-game reflection micro-copy over a bare score number.
- Let a user replay immediately without navigating away.

**Complexity:** High — genuinely blocked on unresolved backend model questions,
not just UI work. Blocked on Ticket 3 (mind-management specifically) and on the
distraction magic-number decision above. Shared components: `MiniGamePage` shell,
ScoreRing.

---

## 9. Spirituality content + aromatherapy
`turning_to_religion, aromatherapy/get_scents/add_scent` → `/coping/spirituality`, `/coping/aromatherapy`

**Classification:** REDESIGN — coping-technique pages.

**Components**
- `SpiritualityFeedPage` (Server) → `SpiritualityContentCard` (Server)
- `AromatherapyPage` (Server, fetches scent list) → `ScentPicker` (Client —
  selection state) → `BreathingTimer` (Client — reuses module 7's timer
  pattern) — state: `phase: 'inhale'|'hold'|'exhale'`, `secondsInPhase: number`

```ts
interface SpiritualityContent { id: number; title: string; content: string }
interface Scent { name: string; description: string; imageUrl: string; inhaleTime: number; holdTime: number; exhaleTime: number }
```

**Data:** `GET /api/v2/spirituality-content/`, `GET /api/v2/scents/`. Server-side
fetch for both lists. Loading: skeleton cards. Error: EmptyState.

**Old logic that must move:** the staff-only add/delete branch currently mixed
into `turning_to_religion`'s own view becomes a separate admin-only
endpoint/page entirely — `SpiritualityFeedPage` as consumed by students should
have zero admin UI in it, unlike the old template which rendered the form
conditionally in the same view.

**Design notes (REDESIGN):**
- The breathing timer already the strongest interaction in the app conceptually —
  give it a full ambient visual treatment rather than a text countdown.
- Warm, soft scent-photo presentation with a gentle hover state.
- Spirituality content as a calm single-column read, not a card grid.

**Complexity:** Medium — `get_scents` already hand-serializes cleanly; the
admin-split above is the only real rework. Shared components:
`RoutineTimerModal`/`BreathingTimer` share the countdown primitive.

---

## 10. Community feed
`onlinecom, delete_post/comment, up/downvote ×4` → `/community`

**Classification:** REDESIGN — named explicitly ("community chat").

**Components**
- `CommunityFeedPage` (Server — initial page of posts)
- `PostList` (Client — needs infinite scroll/pagination state) — state:
  `posts: Post[]`, `isLoadingMore: boolean`
- `PostComposer` (Client — form + image upload state)
- `PostCard` (Server, unless votes are optimistic — then Client) — props:
  `{ post: Post }`
- `CommentThread` (Client — expand/collapse state) — state: `isExpanded: boolean`
- `VoteButton` (Client — optimistic increment) — props:
  `{ targetId: number; targetType: 'post'|'comment'; votes: number; direction: 'up'|'down' }`

```ts
interface Post { id: number; author: UserSummary; content: string; imageUrl?: string; timestamp: string; upvotes: number; downvotes: number; commentCount: number }
interface Comment { id: number; author: UserSummary; content: string; upvotes: number; downvotes: number }
```

**Data:** `GET /api/v2/posts/`, `POST /api/v2/posts/`, `POST /api/v2/comments/`,
`POST /api/v2/posts/:id/vote/`. Server-side fetch for the initial feed;
client-side (React Query, cursor pagination) for "load more" and all mutations.
Loading: skeleton post cards. Error: toast on failed post/comment/vote, with
optimistic UI reverted on failure.

**Old logic that must move:** the audit flagged the old `onlinecom` view
branching on which POST field was present to decide post-vs-comment — the new
frontend must call two distinct endpoints (`PostComposer` → `/posts/`, comment
form → `/comments/`), never one shared "smart" endpoint that infers intent from
payload shape. Vote endpoints move from GET (unsafe, no dedupe) to POST with
per-user dedupe enforced server-side; `VoteButton`'s optimistic update must be
prepared to be rejected once that dedupe rule exists, since it doesn't today.

**Design notes (REDESIGN):**
- Softer, less Reddit-like vote affordance — consider a single toggleable
  "support" reaction more in keeping with a peer-support community.
- Clearer visual distinction for anonymous-feeling safety — consider
  display-name/pseudonym conventions rather than full real names by default.
- Calmer comment-thread expansion (soft fade-in) rather than an abrupt
  display:none/block toggle.

**Complexity:** High — the endpoint-split and vote-dedupe work is real
backend-dependent rework, not just a UI reskin. No formal ticket yet — worth
raising "split community endpoints + add vote dedupe" as one. Shared
components: VoteButton, Avatar, CommentThread.

---

## 11. Psychologist directory & approval workflow
`prof, viewpsych, approve/reject_psychologist` → `/psychologists`, `/admin/psychologists`

**Classification:** PORT — explicitly named as a function-over-polish admin
surface.

**Components**
- `PsychologistDirectoryPage` (Server) → `PsychologistCard` (Server)
- `AdminApprovalQueuePage` (Server, role-gated) → `ApprovalRow` (Client —
  approve/reject buttons need pending/optimistic state)

```ts
interface PsychologistSummary { id: number; name: string; imageUrl?: string; areaOfExpertise: string; availability: 'available'|'unavailable'|'unknown' }
interface PendingPsychologist extends PsychologistSummary { licenseNumber: string; qualification: string; yearsOfExperience: number }
```

**Data:** `GET /api/v2/psychologists/`, `POST /api/v2/psychologists/:id/approve/`
(admin). Directory: server-side fetch. Approval queue: server-side fetch, gated
by RoleGate (admin only). Loading: skeleton list. Error: banner + retry.

**Old logic that must move:** the audit's finding that `approve_psychologist`
also flips `user.is_staff = True` (conflating "approved provider" with Django
admin-site access) must not carry into the API contract — approving a
psychologist should only ever set the domain-level "approved" flag Ticket 2's
role model defines, never grant unrelated admin permissions as a side effect.
Also flag: `reject_psychologist`'s reference to a nonexistent `is_rejected`
field means the reject endpoint literally doesn't work today.

**Complexity:** Medium — mostly straightforward once the endpoint contract above
is fixed. Blocked on Ticket 2 for the approval queue's admin gating, and on the
backend actually implementing a working reject path. Shared components: Table,
Badge, Button.

---

## 12. Psychologist dashboard & availability
`psychview, edit_psychview, set_availability` → `/dashboard`, `/dashboard/edit`

**Classification:** PORT — dashboard, function-over-polish.

**Components**
- `PsychologistDashboardPage` (Server) → `InboxTable` (Server) →
  `MessageStatusBadge` (Server)
- `AvailabilityToggle` (Client — needs immediate optimistic state) — state:
  `status: 'available'|'unavailable'`

```ts
interface InboxRow { messageId: number; senderName: string; severity: Severity | 'unknown'; status: 'pending'|'read'|'accepted'|'rejected' }
```

**Data:** `GET /api/v2/psychologists/me/inbox/`,
`PATCH /api/v2/psychologists/me/availability/`. Server-side fetch for the inbox;
client-side for the availability toggle. Loading: skeleton table rows. Error:
row-level retry.

**Old logic that must move:** current-state availability (today modeled as a log
read via `.latest()`) becomes a real "current status" field per the audit's
model note — `AvailabilityToggle` should read/write one boolean/enum field, not
"the most recent of many log rows."

**Complexity:** Medium — needs the availability-as-current-state schema fix
landed first, otherwise the frontend is stuck emulating "latest row" semantics
itself. Shared components: Table, Badge.

---

## 13. Messaging (chat)
`chat_view, psychprofile, admin_message_user, accept/reject/pending-message` → `/messages/[partnerId]`

**Classification:** REDESIGN — 1:1 support conversation is an emotional surface,
and the brief groups "community chat" here in spirit.

**Components**
- `ConversationPage` (Server — initial message history)
- `MessageThread` (Client — needs live updates, scroll position) — state:
  `messages: Message[]`, `isPolling: boolean`
- `MessageComposer` (Client — draft text)
- `MessageStatusControls` (Client, psychologist-only — accept/reject/pending)

```ts
interface Message { id: number; senderId: number; content: string; timestamp: string; status: 'pending'|'read'|'accepted'|'rejected' }
```

**Data:** `GET /api/v2/conversations/:partnerId/messages/`,
`POST .../messages/`, `PATCH /api/v2/messages/:id/status/`. Server-side fetch
for history; client-side polling (short interval) or, if Channels ends up
actually used per the audit's dead-dependency note, a websocket subscription
instead — this choice needs a decision, not an assumption. Loading: skeleton
message bubbles. Error: "message failed to send" inline retry, message kept in
the composer.

**Old logic that must move:** the audit flagged three near-duplicate messaging
views (student↔psych, psych↔patient, admin↔user) — the frontend should use one
`ConversationPage`/`MessageThread` pair for all three contexts, varying only by
which "partner" resolves and which controls (accept/reject) render.

**Design notes (REDESIGN):**
- Add a visible "read"/"delivered" indicator.
- Warmer bubble styling distinguishing "you" vs "them" without relying on plain
  green/blue (accessibility + tone).
- Gentle empty state on first opening a new conversation.

**Complexity:** High — needs a real-time delivery decision (polling vs.
Channels) made before the component's data-fetching strategy can be finalized;
also depends on Ticket 2 for the ownership check `psychprofile` currently lacks.
Shared components: Avatar, Badge.

---

## 14. Video call
`videocall` → `/call/[sessionId]`

**Classification:** PORT — this is Ticket 4's rebuilt plumbing; the design goal
is safe, correct, minimal chrome around an embedded call, not a visual
reinvention.

**Components**
- `VideoCallPage` (Server — validates the session id belongs to the current
  user, requests a meeting token server-side)
- `CallRoom` (Client — must be, since it wraps the Chime SDK's browser APIs) —
  state: `connectionState: 'connecting'|'connected'|'error'`, `isMuted: boolean`,
  `isVideoOff: boolean`

```ts
interface CallSession { sessionId: string; meetingToken: string; attendeeId: string; expiresAt: string }
```

**Data:** `POST /api/v2/video-rooms/` (issues a session-scoped meeting + token).
Server-side request for the token (never expose long-lived credentials to the
client bundle). Loading: "connecting…" state in `CallRoom` while the SDK
initializes. Error: clear "couldn't connect — retry" with a real retry action.

**Old logic that must move — explicitly not ported:** the current static
shared-room behavior and the hardcoded room name are the thing being replaced,
not adapted. `VideoCallPage` must request a new, isolated meeting per session
id — there is no old logic here worth carrying forward, per Ticket 4.

**Complexity:** High — fully blocked on Ticket 4 shipping server-side
(`POST /api/v2/video-rooms/` doesn't exist yet, and the provider decision —
Chime vs. Twilio — isn't finalized). No frontend work should start beyond this
component sketch until that's resolved. Shared components: none reusable
elsewhere.

---

## 15. Admin/staff dashboards
`viewpatient, viewpsych, viewprof, analytics` → `/admin/patients`, `/admin/analytics`

**Classification:** PORT — explicitly named as a function-over-polish surface.

**Components**
- `AdminPatientListPage` (Server, role-gated) → `PatientRow` (Server) →
  `ScoreSummaryCell` (Server, reuses module 2's aggregation data shape)
- `AdminAnalyticsPage` (Server) → `SeverityDistributionChart` (Client — chart
  library needs client-side rendering)

```ts
interface PatientRow { userId: number; name: string; latestSeverity: Severity; scoreSummary: ModuleScores }
interface AnalyticsSummary { severityCounts: Record<Severity, number>; totalUsers: number; totalStaff: number }
```

**Data:** `GET /api/v2/admin/patients/`, `GET /api/v2/admin/analytics/`.
Server-side fetch, both role-gated. Loading: skeleton table/chart. Error: banner
+ retry.

**Old logic that must move:** the audit's two flagged bugs here are
non-negotiable fixes, not migration details — the N+1 per-patient query loop in
`viewpatient` must become one annotated backend query, and the hardcoded
`Profile.objects.count() - 9` in analytics must not reach
`AnalyticsSummary.totalUsers` uncorrected.

**Complexity:** High — blocked on Ticket 2 (both pages are currently reachable
by any logged-in user in v1) and on the two backend bugs above being fixed
before the data is presentable at all. Shared components: Table, chart
component (recharts or visx — npm install for this Next.js app).

---

## 16. Hotline directory
`hotline, add/edit/delete_hotline` → `/resources/hotlines`

**Classification:** PORT — a simple list, but flagged as safety-critical:
clarity of typography/contrast matters here regardless of "PORT" meaning low
design investment elsewhere.

**Components**
- `HotlineDirectoryPage` (Server, public) → `HotlineCard` (Server)
- `AdminHotlineForm` (Client, admin-only — create/edit)

```ts
interface Hotline { id: number; title: string; contact: string; description?: string }
```

**Data:** `GET /api/v2/hotlines/` (public, no auth), `POST/PATCH/DELETE`
(admin). Server-side fetch for the public list — this page should render fast
and reliably with no client-side dependency, since it may be the page someone
opens in a crisis. Loading: n/a for the public view if server-rendered. Error:
the public page's error state deserves particular care — fall back to a
hardcoded local emergency-number list if the API call fails entirely.

**Old logic that must move:** the audit's critical finding — no auth at all on
hotline CRUD today — means `AdminHotlineForm` must be built against the fixed
endpoint (admin-only writes) from day one.

**Complexity:** Low — simple CRUD once the auth fix lands. Blocked on the
hotline-CRUD auth fix (part of Ticket 2's broader permission rollout, worth
calling out explicitly as its own ticket). Shared components: Card.

---

## 17. Public landing/about + CMS content
`home, about` → `/`, `/about`

**Classification:** PORT — marketing pages, function-over-polish for this
migration pass; a future brand redesign is a separate, later conversation.

**Components**
- `HomePage` / `AboutPage` (Server — public, SEO-relevant, should be statically
  generated or ISR'd, not client-fetched)
- `ContentBlock` (Server) — props: `{ block: ContentBlock }`
- `AdminContentEditor` (Client, admin-only, separate route — not embedded
  inline on the public page)

```ts
interface ContentBlock { id: number; title: string; content: string; createdAt: string }
```

**Data:** `GET /api/v2/content/home/`, `GET /api/v2/content/about/` (public),
admin writes via a separate `/admin/content` route. Server-side static/ISR
fetch for the public pages. Loading: n/a (statically generated). Error:
build-time/ISR failure falls back to last-known-good content.

**Old logic that must move:** the superuser-conditional inline `<form>`
currently embedded directly in `home.html`/`about.html` must not be ported into
`HomePage`/`AboutPage` at all — content editing moves entirely to a separate
admin route.

**Complexity:** Low. Shared components: `ContentBlock` only used here.

---

## Master migration plan

| Old template/page | PORT/REDESIGN | New route | Key components | API endpoints | Complexity | Blocking |
|---|---|---|---|---|---|---|
| signin, signup, createprof, staff | PORT | /login, /signup, /signup/psychologist | LoginForm, SignupForm, PsychologistSignupForm | /auth/login/, /auth/register/, /auth/register/psychologist/ | Medium | Ticket 2 (staff-creation path only) |
| profile, edit_profile | REDESIGN | /profile, /profile/edit | ProfilePage, ScoreSummaryPanel, MoodSnapshot, EditProfileForm | /profile/me/, /profile/me/scores/ | High | Score-aggregation service must exist first |
| mood, save_mood, get_moods | REDESIGN | /mood | MoodTrackerPage, MoodCalendar, MoodEntryModal | /mood-entries/ | Low | — |
| gad7 | REDESIGN | /screening/gad7 | Gad7Questionnaire, Gad7ResultCard | /gad7/responses/ | Medium | Fix client/server scoring duplication first |
| journal, edit_journal, delete_journal | REDESIGN | /journal | JournalEditor, JournalEntryList | /journal-entries/ | Low | — |
| todo_list, add/update/delete_task | PORT | /tools/todo | TaskList, TaskItem, AddTaskForm | /tasks/ | Low | Fix missing auth on update_task |
| exercise_view, yoga_view + quartets | REDESIGN | /coping/exercise, /coping/yoga | MovementLibraryPage, RoutineTimerModal | /exercises/, /yoga/, .../completions/ | Medium | Fix missing auth on completion-save endpoints |
| defusion, distraction, mind-management ×2, body-scan | REDESIGN | /coping/[game] | MiniGamePage, MiniGameCanvas | /games/:slug/attempts/ | High | Ticket 3 (MindManagement reconciliation); distraction magic-number decision |
| turning_to_religion, aromatherapy/get_scents/add_scent | REDESIGN | /coping/spirituality, /coping/aromatherapy | SpiritualityFeedPage, ScentPicker, BreathingTimer | /spirituality-content/, /scents/ | Medium | Split admin add/delete out of student-facing view |
| onlinecom, delete_post/comment, votes ×4 | REDESIGN | /community | PostList, PostComposer, VoteButton, CommentThread | /posts/, /comments/, /posts/:id/vote/ | High | Endpoint split + vote dedupe (not yet a numbered ticket) |
| prof, viewpsych, approve/reject_psychologist | PORT | /psychologists, /admin/psychologists | PsychologistDirectoryPage, ApprovalRow | /psychologists/, /psychologists/:id/approve/ | Medium | Ticket 2; working reject-endpoint doesn't exist yet |
| psychview, edit_psychview, set_availability | PORT | /dashboard, /dashboard/edit | InboxTable, AvailabilityToggle | /psychologists/me/inbox/, /psychologists/me/availability/ | Medium | Availability-as-current-state schema fix |
| chat_view, psychprofile, admin_message_user, accept/reject/pending | REDESIGN | /messages/[partnerId] | MessageThread, MessageComposer, MessageStatusControls | /conversations/:id/messages/, /messages/:id/status/ | High | Ticket 2; polling-vs-websocket decision |
| videocall | PORT | /call/[sessionId] | VideoCallPage, CallRoom | /video-rooms/ | High | Ticket 4 — fully blocked |
| viewpatient, viewpsych, viewprof, analytics | PORT | /admin/patients, /admin/analytics | AdminPatientListPage, SeverityDistributionChart | /admin/patients/, /admin/analytics/ | High | Ticket 2; N+1 query fix; -9 magic-number fix |
| hotline + add/edit/delete | PORT | /resources/hotlines | HotlineDirectoryPage, AdminHotlineForm | /hotlines/ | Low | Hotline-CRUD auth fix (untracked — needs a ticket) |
| home, about | PORT | /, /about | HomePage, AboutPage, ContentBlock | /content/home/, /content/about/ | Low | — |

**Two gaps worth turning into tickets before sprint planning:** the community
endpoint-split/vote-dedupe work (row 10) and the hotline-CRUD auth fix (row 16)
both block real frontend work but currently have no ticket number — they're
referenced above as "untracked."
