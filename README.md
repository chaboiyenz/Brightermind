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

## Branch strategy

| Branch  | Environment | Deployment                          |
|---------|-------------|--------------------------------------|
| `dev`   | Development | Auto-deploy on push                  |
| `stage` | Staging     | Auto-deploy on push                  |
| `main`  | Production  | Manual trigger, requires approval    |

See `docs/ci-cd/environment-setup.md` for GitHub Environment and AWS OIDC setup.

## Status

Scaffold only — no application code yet. Folder structure, CI workflow skeleton,
and issue/PR templates are in place; environments (`dev`/`stage`/`main`) are set up
on GitHub. See TDD.MD Section 9 for open questions and the migration audit/tickets
in `docs/` for known issues carried over from v1 that must be resolved before their
corresponding features are ported.
