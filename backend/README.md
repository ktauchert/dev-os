# Backend

API and Lambda logic for DevOS.

**Contract:** [docs/api-projects.md](../docs/api-projects.md)  
**When to build/deploy:** Milestone 2 in [docs/plan.md](../docs/plan.md)  
**Workflow (IAM, CORS, order):** [docs/aws-dev-workflow.md](../docs/aws-dev-workflow.md)  
**Service map:** [docs/aws-architecture.md](../docs/aws-architecture.md)

## Current state

The frontend client and **MSW** implement the projects contract locally ([docs/api-mocking.md](../docs/api-mocking.md)). This package is where **API Gateway + Lambda** logic lives when you stand up the dev stack—no requirement to wait for S3/CloudFront or Cognito (those are Milestones 3–4).

## Suggested layout

```text
backend/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── handlers/
    │   └── projects.ts      # API Gateway entrypoints
    ├── domain/              # align with frontend domain (or shared package later)
    └── lib/
        ├── response.ts
        └── dynamo.ts
```

## Implementing Milestone 2

1. DynamoDB table (dev) — keys per [workflow sketch](../docs/aws-dev-workflow.md#dynamodb-sketch-projects-mvp).
2. Handlers return the same status codes and JSON as `api-projects.md`.
3. Wire API Gateway routes to Lambda; enable CORS for `http://localhost:3000`.
4. Verify with `curl`, then frontend `VITE_MOCK_API=false` + `VITE_API_BASE_URL`.

Copy or share domain rules from `frontend/src/features/projects/domain/` so MSW, tests, and Lambda stay aligned.

## Milestone 3

Add JWT validation via API Gateway authorizer; read user id in Lambda; partition DynamoDB by user. Update `api-projects.md` auth section.
