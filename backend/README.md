# Backend

API and Lambda logic for DevOS.

**Contract:** [docs/api-projects.md](../docs/api-projects.md)  
**When to build/deploy:** Milestone 2 in [docs/plan.md](../docs/plan.md)  
**Workflow (IAM, CORS, order):** [docs/aws-dev-workflow.md](../docs/aws-dev-workflow.md)  
**Service map:** [docs/aws-architecture.md](../docs/aws-architecture.md)

## Current state

The frontend client and **MSW** implement the projects contract locally ([docs/api-mocking.md](../docs/api-mocking.md)). This package is where **API Gateway + Lambda** logic lives when you stand up the dev stack—no requirement to wait for S3/CloudFront or Cognito (those are Milestones 3–4).

## Package init (not Vite)

The **frontend** uses Vite; the **backend** does not. Vite targets browsers and dev servers — Lambda needs a Node bundle (later: **esbuild** or **tsc** + zip), not `vite init`.

Bootstrap (you run these):

```bash
cd backend
npm install -D typescript @types/node
# when you add handlers + AWS SDK:
# npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
# npm install -D @types/aws-lambda vitest esbuild
npm run typecheck   # after you add src/**/*.ts
```

`package.json` and `tsconfig.json` are already minimal; add dependencies as you need them.

## Suggested layout

```text
backend/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts             # optional: single Lambda entry + router
    ├── handlers/
    │   └── projects.ts      # HTTP: list / get / create / patch
    ├── domain/              # buildNewProject, applyProjectPatch (mirror frontend)
    ├── repos/
    │   └── projects-repo.ts # DynamoDB (or in-memory while learning)
    └── lib/
        ├── apigw.ts         # parse API Gateway HTTP API v2 event
        ├── response.ts      # JSON + CORS headers
        └── dynamo.ts        # DocumentClient + TABLE_NAME
```

**Build order (learning):** `domain` → `repos` → `handlers` → `index.ts` → AWS wiring.

## Implementing Milestone 2

1. DynamoDB table (dev) — keys per [workflow sketch](../docs/aws-dev-workflow.md#dynamodb-sketch-projects-mvp).
2. Handlers return the same status codes and JSON as `api-projects.md`.
3. Wire API Gateway routes to Lambda; enable CORS for `http://localhost:3000`.
4. Verify with `curl`, then frontend `VITE_MOCK_API=false` + `VITE_API_BASE_URL`.

Copy or share domain rules from `frontend/src/features/projects/domain/` so MSW, tests, and Lambda stay aligned.

## Milestone 3

Add JWT validation via API Gateway authorizer; read user id in Lambda; partition DynamoDB by user. Update `api-projects.md` auth section.
