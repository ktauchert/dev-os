# AWS Cloud Architecture

## Service Map & Responsibilities
- **AWS S3:** Host compiled React static build artifacts (`dist/`).
- **AWS CloudFront:** Global CDN serving S3 content over HTTPS with edge caching.
- **AWS Cognito:** Handles User Pools (authentication) and Identity Pools (authorization).
- **AWS API Gateway:** REST API proxy validating Cognito JWT tokens on incoming requests.
- **AWS Lambda:** Node.js/Python serverless functions handling business endpoints.
- **AWS DynamoDB:** Low-latency NoSQL database for projects, work items, and SDLC state.
- **AWS Bedrock:** Managed LLM endpoint invoked by Lambda with contextual prompts.
- **AWS CloudWatch:** Centralized logs, metrics, and runtime alarms.

## Architecture Diagram (Logical Flow)
```text
[ Browser / User ]
        │
        ├──> [ AWS CloudFront ] ──> [ S3 Bucket (React SPA) ]
        │
        ├──> [ AWS Cognito ] (Login / Token Generation)
        │
        └──> [ AWS API Gateway ] (Bearer JWT Auth)
                    │
                    ▼
            [ AWS Lambda ]
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
[ DynamoDB ]            [ AWS Bedrock ]
 (Work Data)            (Claude 3.5 LLM)