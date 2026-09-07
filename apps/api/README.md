# apps/api

Django + Django REST Framework + Django Channels backend (TDD §4.3).

## Layout

- `config/` — Django project settings, URL routing, ASGI/WSGI entrypoints.
- `apps/core/` — shared/base models, permissions, utilities.
- `apps/accounts/` — profile management, auth, roles (student/psychologist/admin).
- `apps/screening/` — mental health screening tools.
- `apps/mood_tracker/` — mood tracker entries.
- `apps/coping_techniques/` — coping technique modules, progress/rewards.
- `apps/chat/` — one-on-one chat and video conferencing (Channels + Chime SDK).
- `apps/community/` — community chat (post/comment/vote).
- `apps/hotlines/` — hotline directory.
- `apps/feedback/` — feedback collection.
- `tests/` — cross-app / integration tests.

PostgreSQL (AWS RDS) is the target database, with Row-Level Security policies per role (TDD §4.4, §6.1).

Status: scaffold only — no app code yet.
