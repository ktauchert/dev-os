# AWS Cloud Architecture

Service map and request flow for DevOS. **Build order and dev/prod habits:** [aws-dev-workflow.md](./aws-dev-workflow.md).

## Service Map & Responsibilities

| Service | Role |
| --- | --- |
| **AWS S3** | Host compiled React static build (`frontend/dist/`). |
| **AWS CloudFront** | HTTPS CDN in front of S3; SPA routing. |
| **AWS Cognito** | User pools (sign-up/sign-in); JWTs for the SPA. |
| **AWS API Gateway** | REST/HTTP API; **JWT authorizer** (post–Milestone 3) on routes. |
| **AWS Lambda** | Business logic; reads/writes DynamoDB; invokes Bedrock later. |
| **AWS DynamoDB** | Projects, work items, SDLC state (access-pattern driven). |
| **AWS Bedrock** | Managed LLM for the AI companion (Milestone 7). |
| **AWS CloudWatch** | Logs and metrics for Lambda and operational alarms. |

## Architecture Diagram (Logical Flow)

```text
[ Browser / User ]
        │
        ├──> [ AWS CloudFront ] ──> [ S3 Bucket (React SPA) ]
        │
        ├──> [ AWS Cognito ] (Login / Token Generation)
        │
        └──> [ AWS API Gateway ] (Bearer JWT Auth after M3)
                    │
                    ▼
            [ AWS Lambda ]
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
[ DynamoDB ]            [ AWS Bedrock ]
 (Work Data)            (Claude 3.5 LLM)
```

During **Milestone 2**, the browser may call API Gateway directly from `localhost` (CORS); Cognito and CloudFront are not required yet.

## Environments (summary)

| Environment | SPA | API | Auth |
| --- | --- | --- | --- |
| **Local + MSW** | `npm run dev` | MSW intercepts `fetch` | Mock / none |
| **Local + dev API** | `VITE_MOCK_API=false` | API Gateway `dev` stage | Open (M2 only) or JWT (M3+) |
| **Hosted** | CloudFront (M4) | `dev` or `prod` stage | Cognito (M3+) |

Keep **dev** and **prod** tables and stages separate; point the SPA at the correct `VITE_API_BASE_URL` at build time.

## Contract alignment

HTTP shapes are defined in `docs/api-*.md`. Lambda must match what the SPA and MSW already implement—see [api-projects.md](./api-projects.md) and [api-mocking.md](./api-mocking.md).
