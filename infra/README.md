# infra

Terraform (or AWS CDK) definitions for the AWS infrastructure described in TDD §4 and §6:
RDS PostgreSQL (private subnet), S3, ECR, App Runner/ECS Fargate, Secrets Manager, IAM roles for GitHub OIDC.

Status: empty scaffold — infra decisions are not yet final (TDD §9).

Because of that, the deploy workflows in `.github/workflows/` skip their deploy job while the
`AWS_REGION` repository variable is unset, rather than failing at the first AWS step. Setting
that variable, along with the `AWS_DEPLOY_ROLE_ARN` secret, is what switches deploys on once
the resources above exist — the workflows need no edit.
