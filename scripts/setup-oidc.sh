#!/usr/bin/env bash
# setup-oidc.sh — one-time setup for GitHub Actions -> AWS OIDC federation.
# Run this once per AWS environment (dev/stage/prod) as an account admin.
# Requires: aws CLI configured with sufficient IAM permissions.

set -euo pipefail

GITHUB_ORG="chaboiyenz"
GITHUB_REPO="Brightermind"
ENVIRONMENT="${1:?Usage: ./setup-oidc.sh <dev|stage|prod>}"
ROLE_NAME="brightermind-${ENVIRONMENT}-deploy-role"

echo "Setting up OIDC federation for environment: ${ENVIRONMENT}"

# 1. Create the GitHub OIDC identity provider in AWS IAM (skip if it already exists —
#    only one provider per AWS account is needed, shared across all repos/environments).
aws iam create-open-id-connect-provider \
  --url "https://token.actions.githubusercontent.com" \
  --client-id-list "sts.amazonaws.com" \
  --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" \
  || echo "OIDC provider already exists, skipping."

# 2. Create the trust policy: only this repo, only this environment, can assume the role.
cat > /tmp/trust-policy-${ENVIRONMENT}.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG}/${GITHUB_REPO}:environment:${ENVIRONMENT}"
        }
      }
    }
  ]
}
EOF

# 3. Create the deploy role with that trust policy.
aws iam create-role \
  --role-name "${ROLE_NAME}" \
  --assume-role-policy-document file:///tmp/trust-policy-${ENVIRONMENT}.json \
  --description "GitHub Actions deploy role for BrighterMind (${ENVIRONMENT})"

# 4. Attach least-privilege permissions. Replace this managed policy with a scoped
#    custom policy before going to production — AdministratorAccess is a placeholder only.
echo "TODO: attach a scoped policy (ECR push, App Runner/ECS deploy, RDS migrate access)"
echo "      instead of a broad managed policy. See docs/ci-cd/environment-setup.md."

echo ""
echo "Done. Add this to your GitHub repo secrets for the '${ENVIRONMENT}' environment:"
echo "  AWS_DEPLOY_ROLE_ARN = $(aws iam get-role --role-name ${ROLE_NAME} --query Role.Arn --output text)"
