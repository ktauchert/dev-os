# Tech Stack & Decision Log

| Area | Technology | Decision & Reasoning |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18+ (Vite) | Familiar React UI with fast HMR; vehicle for TanStack Router/Query and shadcn. |
| **Language** | TypeScript | Strong typing across UI, domain models, and API interfaces. |
| **State & Data Fetching** | TanStack Query (React Query) | Handles server state, caching, optimistic updates, and loading states cleanly. |
| **Routing** | TanStack Router | Type-safe file routes; shell in `__root.tsx`. |
| **API contract** | `docs/api-*.md` + `fetch` client | Single source of truth for MSW, Vitest, and Lambda ([aws-dev-workflow.md](./aws-dev-workflow.md)). |
| **API (dev / test)** | MSW + `api-client` | Optional interceptor until dev API exists; stays for tests ([api-mocking.md](./api-mocking.md)). |
| **API (AWS)** | API Gateway + Lambda | Serverless REST; dev stage before CloudFront ([plan.md](./plan.md) M2). |
| **Testing** | Vitest + Testing Library | Unit + HTTP integration tests; see [testing.md](./testing.md). |
| **Styling & UI** | Tailwind CSS + Shadcn UI | Utility-first styling for high velocity and accessible UI components. |
| **Cloud Hosting** | AWS S3 + CloudFront | Static SPA hosting (Milestone 4, after dev API is proven). |
| **Identity & Auth** | AWS Cognito | JWT for SPA; API Gateway authorizer (Milestone 3). |
| **Database** | AWS DynamoDB | Key design follows API access patterns; see [aws-dev-workflow.md](./aws-dev-workflow.md). |
| **AI Integration** | AWS Bedrock | Managed LLM access within AWS (Milestone 7). |
