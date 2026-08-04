# Infrastructure

AWS deployment and IaC for DevOS.

**Start here:** [docs/aws-dev-workflow.md](../docs/aws-dev-workflow.md) — console/CLI is fine for the first **dev API** slice (Milestone 2).

| Milestone | Typical IaC targets |
| --- | --- |
| **2** | DynamoDB table, Lambda, API Gateway stage, IAM roles |
| **3** | Cognito user pool, authorizer on API |
| **4** | S3 bucket, CloudFront distribution, deploy pipeline |

Service map: [docs/aws-architecture.md](../docs/aws-architecture.md).

When you add SAM, CDK, or Terraform, keep **dev** and **prod** parameters separate and document outputs (especially `VITE_API_BASE_URL` for the SPA build).
