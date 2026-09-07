# BrighterMind v2 — Technical Design Document

**Status:** Draft — scope and documentation are still being finalized. This TDD reflects the current recommended stack and architecture direction; sections marked *(TBD)* are open decisions.

**Version:** 0.1
**Last updated:** [fill in date]

---

## 1. Purpose and Background

BrighterMind v1 was a web-based coping-techniques platform for anxiety, built for students of Cavite State University — Bacoor City Campus, using Python, Django, SQLite3, HTML/CSS, and PythonAnywhere hosting.

BrighterMind v2 expands the platform in four directions:

1. **Scope of concern** — from anxiety specifically to **general mental health**.
2. **Reach** — from a single-campus study to a broader user base *(exact new scope TBD — pending updated documentation)*.
3. **Platform** — from web-only to **web + native mobile**.
4. **Infrastructure** — from a single-host deployment (PythonAnywhere) to a **cloud-hosted, security-hardened architecture on AWS**.

This document is the source of truth for architectural decisions going forward. It does not repeat v1's clinical/coping-technique content model in full — that will be revisited once the general-mental-health scope is finalized — but it locks in the technical foundation so implementation can begin.

---

## 2. Goals and Non-Goals

### Goals
- Preserve and re-platform all existing v1 features: profile management, mental health screening tools, mood tracker, coping technique modules with progress/rewards, one-on-one chat and video conferencing with registered psychologists, online community chat (post/comment/vote), hotlines, and feedback.
- Ship both a **web app** and a **native mobile app** from a shared backend and shared API contract.
- Upgrade the database from SQLite3 to a production-grade, security-capable database (**PostgreSQL**, per Section 4).
- Add a real security layer appropriate for handling sensitive mental health data (screening results, mood entries, chat content).
- Establish CI/CD from day one so every environment (dev/staging/production) is reproducible.

### Non-Goals (for this phase)
- Finalizing the exact new user scope/population (pending updated study documentation).
- Clinical/diagnostic features — the platform remains a screening and support tool, not a diagnostic one (carried over from v1's stated limitation).
- Multi-region deployment — single AWS region is sufficient at this stage.

---

## 3. High-Level Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   Web client     │     │  Mobile client    │
│  React + Next.js │     │ React Native+Expo │
└────────┬─────────┘     └─────────┬────────┘
         │                          │
         └───────────┬──────────────┘
                      ▼
           ┌─────────────────────┐
           │      API layer        │
           │ Django REST Framework │
           │  + Django Channels    │
           └──────────┬───────────┘
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
┌───────────┐  ┌──────────────┐  ┌─────────────┐
│ PostgreSQL │  │  S3 + Chime  │  │ ECS Fargate /│
│  (AWS RDS) │  │   + FCM      │  │  App Runner  │
└───────────┘  └──────────────┘  └─────────────┘
                      │
           ┌─────────────────────┐
           │   GitHub Actions      │
           │ test → build → ECR →  │
           │   deploy to AWS       │
           └─────────────────────┘
```

Both clients talk to a single Django REST API. Real-time features (chat, community feed, notifications) go through Django Channels over WebSockets. The API is the only component with direct database access — neither client ever talks to Postgres directly.

---

## 4. Tech Stack

### 4.1 Frontend — Web
| Component | Choice | Reasoning |
|---|---|---|
| UI library | React | Direct requirement; team's existing JavaScript knowledge carries over. |
| Framework | Next.js | Built-in routing, easier deploy path on AWS (Amplify or ECS) than a bare Vite+React setup. |
| Language | TypeScript | Catches bugs early; enables sharing types with the API contract and with the mobile app. |
| Styling | Tailwind CSS | Fast to implement, pairs well with a shared design system across web and mobile. |

### 4.2 Frontend — Mobile
| Component | Choice | Reasoning |
|---|---|---|
| Framework | React Native | Direct requirement; same language/paradigm as the web app, single codebase for iOS + Android. |
| Toolchain | Expo (managed workflow) | Removes native iOS/Android build toolchain setup; EAS Build/Submit integrates directly with GitHub Actions; OTA updates allow shipping fixes without app-store review delays. |

### 4.3 Backend / API
| Component | Choice | Reasoning |
|---|---|---|
| Language/Framework | Python + Django | Retained from v1 — team's strongest existing skill; no new language to learn. |
| API layer | Django REST Framework (DRF) | Converts existing Django models/views into a JSON API consumable by React and React Native. Smallest possible step up from v1's server-rendered views. |
| Real-time | Django Channels + Redis | Handles chat, community feed, and notifications natively within the Django ecosystem — no separate real-time service/language required. |

### 4.4 Database
| Component | Choice | Reasoning |
|---|---|---|
| Database engine | PostgreSQL | Approved alternative to MySQL by project sponsor. Django ORM makes the SQLite→Postgres migration close to configuration-only. Supports **Row-Level Security (RLS)** — enforces per-role data access (student/psychologist/admin) at the database level, not only in application code. This is a meaningful security upgrade for a platform handling screening results, mood entries, and chat content. |
| Hosting | AWS RDS for PostgreSQL | Managed backups, Multi-AZ failover, encryption at rest via AWS KMS, enforced TLS in transit — available as configuration rather than manual database operations. |

*(TBD: if a decision is later made to use MySQL instead, see Section 6.4 for the compensating security controls required in that scenario.)*

### 4.5 File / Media Storage
| Component | Choice | Reasoning |
|---|---|---|
| Storage | AWS S3 | Profile photos, community post images, uploaded attachments. Standard pairing with an AWS-hosted backend. |

### 4.6 Video Conferencing
| Component | Choice | Reasoning |
|---|---|---|
| Video | Amazon Chime SDK (Twilio Video acceptable as a fallback) | Keeps billing and infrastructure inside one cloud provider; removes the "no private room" limitation flagged as a future recommendation in v1. |

### 4.7 Push Notifications
| Component | Choice | Reasoning |
|---|---|---|
| Push | Firebase Cloud Messaging (FCM) | Simpler pairing with Expo/React Native for mobile push than AWS SNS; fine to use alongside an otherwise AWS-hosted backend. |

### 4.8 Hosting / Compute
| Component | Choice | Reasoning |
|---|---|---|
| Initial hosting | AWS App Runner | Closest AWS equivalent to PythonAnywhere's "push and it runs" simplicity — the gentlest landing spot for a team new to AWS. |
| Future hosting | AWS ECS Fargate | Migrate here once the team needs finer-grained control over networking/scaling. Not required at launch. |

---

## 5. Repository Structure

A monorepo is recommended so the API contract, once defined, cannot silently drift between the web and mobile clients.

```
brightermind-v2/
├── apps/
│   ├── web/          # React + Next.js
│   ├── mobile/        # React Native + Expo
│   └── api/           # Django + DRF + Channels
├── packages/
│   └── shared/         # TypeScript types generated from the DRF/OpenAPI schema
├── infra/              # Terraform or AWS CDK (empty scaffold until infra decisions are final)
├── docs/                # This TDD + CI/CD documentation
└── .github/             # CI + deployment workflows
```

`packages/shared` holds types generated from the Django REST Framework OpenAPI schema, consumed by both `apps/web` and `apps/mobile`, so a change to the API contract surfaces as a type error in both clients rather than a silent runtime bug.

---

## 6. Security

### 6.1 Database-level
- **Row-Level Security (RLS) policies** in PostgreSQL restrict each role (student, psychologist, admin) to only the rows it should see, enforced by the database itself — a second layer of defense beyond DRF permission classes.
- **Encryption at rest** via AWS KMS on the RDS instance.
- **Enforced TLS** on all database connections (`rds.force_ssl` for Postgres).
- **Least-privilege DB users** — the application does not connect as a superuser; separate roles per service where applicable.

### 6.2 Network-level
- RDS instance lives in a **private subnet**, reachable only from the API's compute layer (App Runner/ECS), never exposed to the public internet.
- Security groups restrict inbound traffic to only the necessary ports/sources.

### 6.3 Credentials and CI/CD
- **AWS Secrets Manager** stores database credentials and other secrets — never committed to `.env` files in the repo.
- **GitHub OIDC → AWS IAM role assumption** for CI/CD — no long-lived AWS access keys stored as GitHub secrets; tokens are short-lived per workflow run.

### 6.4 If MySQL is chosen instead of PostgreSQL *(contingency, not the current recommendation)*
MySQL has no native equivalent to Postgres's Row-Level Security. If the team later moves to MySQL, the following compensating controls are required to reach an equivalent security posture:
- Strict, thoroughly tested DRF permission classes enforcing per-role row access entirely in application code.
- Field-level encryption on the most sensitive columns (chat content, mood entries, screening answers) via a library such as `django-cryptography` or `django-fernet-fields`.
- TLS-only database connections (`require_secure_transport`).
- Separate database users per service with minimal grants.

### 6.5 Regulatory note
Mood tracker entries and mental health screening data likely qualify as sensitive personal information under the Philippine Data Privacy Act (2012). Data retention policy, consent language, and breach notification procedures should be documented as part of the updated study scope. *(Not legal advice — confirm with appropriate counsel/compliance guidance before launch.)*

---

## 7. CI/CD

- **GitHub Actions**, with separate jobs per toolchain rather than per app, since the JS workspace (web + mobile) and the Python backend have different dependency and test tooling:
  - **JS job:** lint, typecheck, build, test across `apps/web` and `apps/mobile`.
  - **Python job:** lint (ruff), test (pytest) for `apps/api`.
- **Pipeline stages:** test/lint on every PR → build Docker image for the API → push to Amazon ECR → deploy to App Runner/ECS on merge to main.
- **Mobile builds:** triggered via EAS Build/Submit from within the same GitHub Actions workflow.
- **Deploy workflow shape:** set up dev/staging auto-deploy and a manual-approval gate for production, following the pipeline skeleton before AWS infrastructure is fully provisioned — this lets the workflow shape be agreed on early, with actual deploy steps filled in once `infra/` is built out.

---

## 8. Migration Path from v1

Recommended order, minimizing the number of new concepts introduced at each step:

1. **Django → Django REST Framework** — add an API layer on top of existing models/views. Same codebase, same language.
2. **SQLite3 → PostgreSQL** — primarily a configuration change; Django's ORM absorbs most of the differences. Enable RLS policies as they're needed for role separation.
3. **Build the React web app** against the new DRF API.
4. **Build the React Native app** once the API and web client are stable.
5. **Move deployment to AWS**, starting with App Runner rather than ECS, to keep the operational learning curve manageable.

---

## 9. Open Questions / Assumptions

- **Final user scope** — the expanded population beyond CvSU–Bacoor students is not yet defined; revisit once updated documentation lands.
- **PostgreSQL vs. MySQL** — PostgreSQL is the current recommendation (Section 4.4); final call rests with the project sponsor.
- **Video conferencing provider** — Amazon Chime SDK is recommended over continuing with Twilio; not yet finalized.
- **RLS policy design** — specific policies per role (student/psychologist/admin) need to be drafted once the data model for the general-mental-health scope is finalized.
- **Contract testing** — not yet scoped; a decision on whether to adopt schema-based contract tests (e.g., generated OpenAPI client + type checking) versus a dedicated contract-testing tool is deferred until the API surface stabilizes.
- **ECS migration trigger** — no concrete criteria yet for when to move off App Runner onto ECS Fargate.

---

## 10. Appendix — Decision Log

| Date | Decision | Reasoning |
|---|---|---|
| [fill in] | Adopt React + React Native over continuing web-only Django templates | Sponsor requirement; enables native mobile experience. |
| [fill in] | Adopt PostgreSQL over MySQL | RLS support for role-based data access; sponsor-approved alternative to MySQL. |
| [fill in] | Retain Django/DRF as backend | Preserves team's strongest existing skill; minimizes re-platforming risk. |
| [fill in] | AWS over continuing PythonAnywhere | Sponsor requirement; needed for production-grade scaling, security controls (KMS, VPC, Secrets Manager), and native mobile backend support. |