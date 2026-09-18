# CI/CD Environment & Authorization Setup

This doc walks through setting up the three GitHub Environments (dev, stage, prod)
and the authorization model backing them. Do this once per repo.

## 1. Branch strategy

| Branch | Environment | Deployment |
|---|---|---|
| `dev`   | Development | Auto-deploy on every push |
| `stage` | Staging     | Auto-deploy on every push |
| `main`  | Production  | Manual trigger, requires approval |

Feature branches merge into `dev` first via PR (CODEOWNERS-enforced review), get
promoted to `stage` for QA, then to `main` for production once verified.

## 2. Create GitHub Environments

Repo **Settings > Environments** — create three environments named exactly:
`dev`, `stage`, `main` (these names must match the `environment:` key used in the
deploy workflows).

For each environment, configure:

### dev
- No required reviewers (fast iteration).
- Environment secret: `AWS_DEPLOY_ROLE_ARN` (dev role ARN from `setup-oidc.sh dev`).
- Environment variable: `AWS_REGION`.

### stage
- Optional: 1 required reviewer if you want a QA sign-off gate before staging deploys.
- Same secrets/variables as dev, pointing at the staging AWS role/region.

### main (production)
- **Required reviewers**: at least 1-2 people from `@your-org/brightermind-leads`.
- **Deployment branch restriction**: only allow deployments from the `main` branch.
- Same secrets/variables as dev/stage, pointing at the production AWS role/region.
- This is what makes `deploy-prod.yml`'s `workflow_dispatch` actually pause for
  human approval — the `environment: main` key in that workflow is what triggers
  the gate, combined with required reviewers configured here.

### The master switch: `AWS_DEPLOYS_ENABLED`

The per-environment settings above are not enough on their own. The deploy jobs
are gated on a **repository** variable — Repo **Settings > Secrets and variables
> Actions > Variables**:

| Variable | Value | Effect |
|---|---|---|
| `AWS_DEPLOYS_ENABLED` | unset, or anything but `true` | Deploy jobs skip. This is the current state: `infra/` is an empty scaffold, so a deploy could only fail at its first AWS step and redden every merge. |
| `AWS_DEPLOYS_ENABLED` | `true` | Deploy jobs run normally, using the environment secrets and variables above. |

Set this **last**, once everything else in this document is done and the AWS
resources actually exist. Turning it on before then puts the red X back.

It has to be a repository variable, and it has to be separate from `AWS_REGION`,
for a reason worth knowing: a job-level `if` is evaluated *before* GitHub
resolves the job's `environment:`, so environment secrets and environment
variables are both unreadable in that position. Gating on `AWS_REGION` — an
environment variable, per the sections above — would read as empty forever and
skip the deploy even after infra landed. Only repository and organization
variables are visible to a job-level `if`.

## 3. AWS OIDC authorization (no stored access keys)

Run `scripts/setup-oidc.sh` once per environment:

```bash
./scripts/setup-oidc.sh dev
./scripts/setup-oidc.sh stage
./scripts/setup-oidc.sh prod
```

Each run creates an IAM role trusted **only** for:
- This specific GitHub repo
- This specific GitHub Environment name (dev/stage/prod)

This means a workflow running against `dev` cannot accidentally assume the `prod`
role, even if someone misconfigures a workflow file — the trust policy itself
blocks it.

Take the printed role ARN from each run and add it as the `AWS_DEPLOY_ROLE_ARN`
secret in the matching GitHub Environment (step 2).

**Before production use:** replace the placeholder permissions in
`setup-oidc.sh` (currently a TODO) with a scoped IAM policy — at minimum:
- `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, `ecr:PutImage` (push images)
- App Runner or ECS deploy permissions, scoped to the specific service
- RDS connect permission if migrations run from CI

Avoid attaching a broad managed policy like `AdministratorAccess` — scope it down
per environment.

## 4. Branch protection rules

Repo **Settings > Branches** — add rules for `dev`, `stage`, and `main`:
- Require a pull request before merging (no direct pushes).
- Require status checks to pass before merging — select the `ci.yml` jobs (`js`, `api`).
- Require review from Code Owners (uses the `.github/CODEOWNERS` file).
- For `main` specifically: require at least 1-2 approvals, and consider requiring
  linear history.

## 5. Verifying the setup

1. Open a PR against `dev` — confirm `ci.yml` runs both jobs and CODEOWNERS
   requests review from the right team.
2. Merge to `dev` — confirm `deploy-dev.yml` runs and (once infra TODOs are filled
   in) deploys successfully.
3. Merge to `stage` — same check.
4. Manually trigger `deploy-prod.yml` from the Actions tab — confirm it pauses
   for required reviewer approval before running.

## Open items

- [x] Replace `your-org` / `brightermind-v2` placeholders in `CODEOWNERS` and
      `setup-oidc.sh` with real GitHub org/repo names (`chaboiyenz`/`Brightermind`).
      `CODEOWNERS` currently routes everything to `@chaboiyenz` as sole maintainer —
      split into real teams once there's an actual team.
- [ ] Scope the IAM policy attached in `setup-oidc.sh` (currently a TODO).
- [ ] Fill in the actual App Runner/ECS deploy steps in each `deploy-*.yml` once
      `infra/` (Terraform/CDK) exists.
- [ ] Decide whether `stage` needs a required reviewer or stays fully automatic.
