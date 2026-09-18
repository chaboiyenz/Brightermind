# BrighterMind v2

Web + mobile mental health support platform for students — screening tools, mood
tracking, coping technique modules, chat and video consultation with registered
psychologists, and community support.

This is a full re-platform of BrighterMind v1 (Django + SQLite3 + PythonAnywhere,
built for CvSU–Bacoor students, scoped to anxiety). v2 expands scope to general
mental health, adds native mobile, and moves to a production-grade stack.

See [TDD.MD](./TDD.MD) for the full technical design — architecture, tech stack
reasoning, security model, and migration plan from v1.

## Structure

brightermind-v2/
├── apps/
│ ├── web/ # React + Next.js (TypeScript, Tailwind)
│ ├── mobile/ # React Native + Expo
│ └── api/ # Django + DRF + Channels
│ └── apps/ # split by feature domain: core, accounts, screening,
│ # mood_tracker, coping_techniques, chat, community,
│ # hotlines, feedback
├── packages/
│ └── shared/ # TypeScript types generated from the DRF/OpenAPI schema
├── infra/ # Terraform / AWS CDK (scaffold — infra decisions pending, TDD §9)
├── docs/ # TDD + CI/CD documentation
└── .github/ # CI + deployment workflows


Each `apps/*` and `packages/*` directory has its own README with setup notes.

## Local development

One-time setup:

```bash
pnpm install
cd apps/api && python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements/dev.txt   # .venv/bin/python on macOS/Linux
cp .env.example .env      # apps/api
cp ../web/.env.example ../web/.env.local
.venv/Scripts/python.exe manage.py migrate
```

Then, from the repo root:

```bash
pnpm dev
```

Runs `apps/web` (`next dev`, port 3000) and `apps/api` (`manage.py runserver`,
port 8000) together, labeled `[web]`/`[api]` in one terminal. Run them
separately with `pnpm dev:web` / `pnpm dev:api` if you only need one.

There's no real login yet (that's Phase 3 — see `docs/roadmap.md`) — create a
user via `manage.py shell` or `createsuperuser` and sign in at the temporary
`/dev-login` page to test pages that need auth, like `/mood`.

## Branch strategy

Feature branches merge into `dev` via PR, get promoted to `stage` for QA, then to
`main` for production.

| Branch  | Environment | Web (`apps/web`)                  | API (`apps/api`)                  |
|---------|-------------|-----------------------------------|-----------------------------------|
| `dev`   | Development | Auto-deploys to Vercel on push    | Not deployed — see below          |
| `stage` | Staging     | Preview deploy on PR              | Not deployed — see below          |
| `main`  | Production  | Not deployed                      | Not deployed — see below          |

**Web.** The prototype deploys to Vercel from `dev`, running in mock mode with no
backend. Pull requests get their own preview URL. See
`docs/ci-cd/vercel-setup.md`.

**API.** Nothing deploys yet. The `deploy-*.yml` workflows are a pipeline skeleton
written ahead of the infrastructure (TDD §9): they build and push the API image to
ECR, but the step that would deploy it is still a `TODO` placeholder, and `infra/`
is an empty scaffold. Those workflows skip while the `AWS_REGION` variable is
unset, so they don't fail merges. Roadmap Phase 7 tracks the remaining work.

See `docs/ci-cd/environment-setup.md` for the GitHub Environment and AWS OIDC
setup those workflows are waiting on.

## Status

Active development, not production-ready. The web app has substantial application
code — landing page, screening tools, mood tracking, coping modules, community
feed, and the role-based patient/psychologist shells — much of it running on mock
data behind `NEXT_PUBLIC_MOCK_MODE` while the API is built out.

Not yet done: real authentication, AWS infrastructure and deployment for the API,
and the React Native app (`apps/mobile` is still an empty scaffold). See
`docs/roadmap.md` for phase-by-phase status, TDD.md §9 for open technical
questions, and the migration audit/tickets in `docs/` for v1 issues that must be
resolved before their corresponding features are ported.
