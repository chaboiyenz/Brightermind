<<<<<<< HEAD
# BrighterMind v2

Monorepo for BrighterMind v2 — see [TDD.MD](./TDD.MD) for the full technical design.

## Structure

```
brightermind-v2/
├── apps/
│   ├── web/      # React + Next.js (TypeScript, Tailwind)
│   ├── mobile/   # React Native + Expo
│   └── api/      # Django + DRF + Channels
├── packages/
│   └── shared/   # TypeScript types generated from the DRF/OpenAPI schema
├── infra/        # Terraform / AWS CDK (scaffold — infra decisions pending)
├── docs/         # TDD + CI/CD documentation
└── .github/      # CI + deployment workflows
```

Each `apps/*` and `packages/*` directory has its own README with setup notes.

Status: scaffold only — no application code yet. See TDD.MD Section 9 for open questions.
=======
# Brightermind
>>>>>>> c0aecaa57653fcd9e5ed1b8714b977c785930e2a
