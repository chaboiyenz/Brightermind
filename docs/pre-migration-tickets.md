# Pre-migration tickets — BrighterMind v2

These four items came out of the migration audit and are blocking issues: everything
else in the migration mapping table depends on #2 in particular. Formatted to match
`.github/ISSUE_TEMPLATE/` so they can be pasted directly into GitHub Issues once the
new repo exists.

---

## Ticket 1: Rotate leaked SECRET_KEY and embedded JWT

**Labels:** `security`, `critical`, `bug`

### Description
`settings.py` has a hardcoded, committed `SECRET_KEY`. Separately, a full JWT string
is pasted into a commented-out line inside the video-call HTML template. Both are
compromised and need rotation regardless of migration timeline — this should not
wait for the stack change.

### Steps to reproduce / where it lives
- `webapp/settings.py` — `SECRET_KEY = "..."` hardcoded
- Video call template — commented-out `<script>` line containing a full JWT

### Expected behavior
- No secret material committed to the repo, ever.
- Secrets loaded from environment/secrets manager at runtime.

### Acceptance criteria
- [ ] New `SECRET_KEY` generated (`get_random_secret_key()`), old one revoked/rotated
- [ ] Secret moved out of `settings.py` — sourced from AWS Secrets Manager (or `.env`
      locally, never committed)
- [ ] JWT in the video template removed entirely (not just commented out) and
      revoked if it was ever a real, active token
- [ ] `.gitignore` confirmed to exclude any local secrets file
- [ ] Pre-commit secret scanner added (gitleaks or truffleHog) so this can't
      silently recur
- [ ] If v1 is still live anywhere: confirm rotating `SECRET_KEY` invalidates
      existing sessions, and that this is communicated/expected (forces re-login)

---

## Ticket 2: Design an explicit role model for auth/permissions

**Labels:** `security`, `high-priority`, `backend`, `blocks-migration`

### Description
There is no real role concept today. Student/psychologist/admin is inferred per
request via `is_superuser` checks or a `try/except`-wrapped
`Psychologist.objects.get(user=...)` lookup, repeated ad hoc across nearly every
view with no shared decorator or permission class. This blocks writing any
meaningful DRF permission class and needs to exist **before** other endpoints are
built out.

### Expected behavior
A single, explicit, queryable source of truth for "what role does this user have,"
usable by both Django and DRF permission classes.

### Proposed approach
- Add an explicit `role` field (or linked `Role` concept) to the user/profile model
  — not inferred from unrelated lookups.
- Expose it as a property/manager method so every permission check calls one place.
- Write reusable DRF permission classes (`IsStudent`, `IsPsychologist`, `IsAdmin`)
  once this exists.
- This is also the field that future PostgreSQL Row-Level Security policies will
  key off — design it with that in mind.

### Acceptance criteria
- [ ] Explicit role field/concept added to the user model
- [ ] All existing ad hoc role checks (`is_superuser`, `try/except Psychologist.get`)
      identified and listed for replacement
- [ ] Reusable DRF permission classes written and unit tested
- [ ] Migration/backfill plan for existing users' roles under the new field
- [ ] Documented in the TDD as the role model going forward

### Blocks
This ticket blocks meaningful implementation of: `approve_psychologist`,
`reject_psychologist`, `viewpatient`, `analytics`, and any endpoint currently
protected by nothing more than `@login_required`.

---

## Ticket 3: Reconcile MindManagement vs MindManagementScore

**Labels:** `backend`, `data-model`, `needs-investigation`

### Description
Two models back what looks like one feature. Before this becomes a single API
resource in the new stack, we need to confirm which model the live (non-shadowed)
`mind_management` view actually reads from, and what happens to the other.

### Steps to reproduce / investigate
- [ ] Confirm which model the live `mind_management` view (the second, active
      definition — the first is shadowed/dead code) actually queries
- [ ] Determine whether the two models hold genuinely different data (e.g. raw
      responses vs. computed score) or are true duplicates

### Expected behavior
One clear model (or one primary + one explicitly derived model with an FK
relationship) backing this feature — not two independently-updated tables both
claiming to be the source of truth.

### Acceptance criteria
- [ ] Investigation above completed and documented
- [ ] Decision made: merge into one model, or keep two with an explicit
      primary/derived relationship
- [ ] One-time data migration written to backfill/merge historical data from the
      dead model before it's dropped — no data loss
- [ ] Becomes exactly one DRF resource (e.g. `/api/v2/mind-management/`) in the
      migration mapping table

---

## Ticket 4: Rebuild video calling with per-session isolation (Chime SDK)

**Labels:** `security`, `high-priority`, `feature`, `build-from-scratch`

### Description
Current video calling is not Twilio (despite it being imported/in requirements —
dead code, never called). The real implementation renders a static template
embedding 8x8.vc/Jitsi with a **hardcoded room name** — every user who opens the
page joins the same literal video room, with no per-session isolation. This needs
to be built new, not ported, per the migration audit.

### Expected behavior
Each chat/video session between a specific student and psychologist gets its own
isolated, backend-issued room — the client never constructs or guesses a room
name/token itself.

### Proposed approach
- Use **Amazon Chime SDK** (per the TDD's recommended stack) — call `CreateMeeting`
  server-side per session, return a short-lived, session-scoped token to the client.
- Fallback option: Twilio Video, if there's a concrete reason to prefer it over
  Chime (e.g. existing team familiarity) — otherwise Chime keeps billing/infra
  consolidated on AWS per the TDD.
- Directly resolves the v1 recommendation on record ("provide a private room for
  video conferencing").

### Acceptance criteria
- [ ] Provider decision finalized (Chime SDK recommended, Twilio as fallback)
- [ ] Backend issues a new, isolated meeting/room per session — never a shared
      static room
- [ ] Room/token is short-lived and scoped to the specific student-psychologist
      pairing for that session
- [ ] No room name, JWT, or credential ever hardcoded or embedded in client-side
      HTML/JS
- [ ] Old `twilio` dependency removed if Chime is chosen (dead dependency either way
      under the current implementation)
- [ ] TDD updated to reflect the final decision (currently listed as open question
      in Section 9)

---

## Suggested order
1. Ticket 1 — do immediately, no dependencies
2. Ticket 2 — next; blocks meaningful work on tickets 3 and 4's permission handling
3. Tickets 3 and 4 — can proceed in parallel once Ticket 2 lands
