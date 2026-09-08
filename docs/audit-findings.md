# BrighterMind Migration Audit — Key Findings

## 0. Structure reality check

The original migration plan assumed multiple Django apps (`accounts`, `mood_tracker`,
etc.) — that doesn't exist in v1. Everything lives in one app, `webapp`: one
`models.py` (430 lines, 34 models), one `views.py` (1,512 lines, 87 views), one
`urls.py` (73 routes), one `forms.py`. There's no existing domain boundary to carry
over — the DRF app split in v2 is new structure being imposed, not a lift.

## Biggest structural problems

- **Dead/shadowed views**: `viewfeed` and `mind_management` are each defined twice
  in `views.py` — the second definition silently overwrites the first, making the
  first version dead code and causing two different URLs (`cognitive-reframing` and
  `mind-management`) to render the identical view.
- **Two duplicate scoring models** (`MindManagement` vs `MindManagementScore`) back
  what looks like one feature — needs reconciling before it becomes one API resource.
- **Score aggregation logic is copy-pasted, not shared**: both `profile` and
  `viewpatient` independently sum scores across 7 unrelated models in Python loops.
  This needs to become one real service/endpoint.
- **`viewpatient` has an N+1 query loop** (one query per patient) instead of an
  annotated queryset.
- **Broken code paths that will 500 the first time they're hit**: `reject_psychologist`
  sets `psychologist.is_rejected`, a field that doesn't exist on the model;
  `viewfeed` filters on `Feedback.First_Name`, a field that also doesn't exist.
- **A magic number**: `total_users = Profile.objects.count() - 9` in analytics —
  unexplained hardcoded offset baked into a dashboard stat.

## Auth & permissions — the real migration risk

No real role model exists. "Student/psychologist/admin" is inferred per-request by
manually checking `is_superuser`, or by `try/except`-ing a
`Psychologist.objects.get(user=...)` lookup — repeated ad hoc in nearly every view,
with no shared decorator or DRF permission class. This needs an explicit role
concept designed in before DRF permission classes can check anything meaningful.

## Real-time & integrations — biggest surprise

Video calling is **not** Twilio, despite `twilio` being imported and in
`requirements.txt` (never actually called — dead code). The real `videocall` view
just renders a static template embedding 8x8.vc/Jitsi with a **hardcoded room
name** — meaning every user who opens the page joins the same literal video room,
no per-session isolation at all. There's also a full JWT string pasted into a
commented-out line in that same HTML template.

Chat is full-page-reload + one fetch on send — no polling, no websockets — despite
Django Channels being installed and fully unused (dead dependency).

## Security findings (ranked)

- **Critical** — Hardcoded, committed `SECRET_KEY` in `settings.py`.
- **Critical** — No auth at all on hotline CRUD and exercise/yoga library CRUD —
  anyone can edit/delete the crisis hotline list.
- **High** — Shared video room + embedded JWT in template HTML (above).
- **High** — `approve_psychologist`, `reject_psychologist`, `viewpatient`,
  `analytics` require only `@login_required` — any student account can approve
  psychologists or read every patient's GAD-7 history.
- **High** — `@csrf_exempt` on session-authenticated, state-changing endpoints
  (`save_mood`, `save_exercise_data`, `save_yoga_data`, `submit_score`) — classic
  CSRF vector.
- **Medium** — Vote/reject/pending endpoints reachable via GET (unsafe, bypasses
  CSRF by design).
- **Medium** — `DEBUG = True` committed as default, compounding the secret-key
  leak risk.
- No SQL injection surface — everything goes through the ORM.

## Dependencies to drop

`channels`/`daphne`/`twisted` stack (unused), `twilio` (unused), the entire
`weasyprint` PDF toolchain (no call site), `pandas`/`numpy`/`openpyxl` (no call
site), `beautifulsoup4` (no call site), `django-auto-logout`,
`django-tailwind`/`widget-tweaks`/`browser-reload` (template-era tooling),
`antiorm`/`db`/`db-sqlite3` (abandoned, unused). Keep `django-cors-headers`
(becomes load-bearing) and `PyJWT` (currently unused but a natural fit for API
token auth).

## Migration mapping highlights

- **Low complexity** (near-direct CRUD→serializer): mood tracker, journal, to-do
  list, hotline directory, landing/about content.
- **Medium**: auth/signup flows, GAD-7, exercise/yoga modules, psychologist
  directory/dashboard.
- **High complexity**: profile score aggregation, coping mini-games (duplicate
  models need reconciling first), community feed (dual-intent view needs
  splitting), messaging (3 near-duplicate views need collapsing into one
  conversation resource), admin dashboards (fix N+1 and magic-number bugs before
  they're trusted API numbers), and video calling — this needs to be built from
  scratch, not ported, since nothing real exists today.
