# infra

Terraform (or AWS CDK) definitions for the AWS infrastructure described in TDD §4 and §6:
RDS PostgreSQL (private subnet), S3, ECR, App Runner/ECS Fargate, Secrets Manager, IAM roles for GitHub OIDC.

Status: empty scaffold — infra decisions are not yet final (TDD §9).

Because of that, the deploy workflows in `.github/workflows/` skip their deploy job unless the
`AWS_DEPLOYS_ENABLED` repository variable is `"true"`, rather than failing at the first AWS
step. Once the resources above exist and the environments are configured per
`docs/ci-cd/environment-setup.md`, setting that variable switches deploys on — the workflows
need no edit.
