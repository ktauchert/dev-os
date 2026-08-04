# Tech Stack & Decision Log

| Area | Technology | Decision & Reasoning |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18+ (Vite) | Fast developer feedback loop, modern ecosystem, ideal for learning. |
| **Language** | TypeScript | Strong typing across UI, domain models, and API interfaces. |
| **State & Data Fetching** | TanStack Query (React Query) | Handles server state, caching, optimistic updates, and loading states cleanly. |
| **Routing** | TanStack Router | Type-safe file routes; shell in `__root.tsx`. |
| **API (dev / test)** | MSW + `fetch` client | Same REST contract as production until Lambda exists; see [api-mocking.md](./api-mocking.md). |
| **Testing** | Vitest + Testing Library | Unit + HTTP integration tests; see [testing.md](./testing.md). |
| **Styling & UI** | Tailwind CSS + Shadcn UI | Utility-first styling for high velocity and accessible UI components. |
| **Cloud Hosting** | AWS S3 + CloudFront | Serverless static web hosting, global CDN edge delivery, cost-effective. |
| **Identity & Auth** | AWS Cognito | Managed authentication handling signup, login, JWT validation, and sessions. |
| **API Layer** | AWS API Gateway + Lambda | Fully serverless REST API, scaling on demand with zero baseline cost. |
| **Database** | AWS DynamoDB | High-performance NoSQL key-value database ideal for serverless execution. |
| **AI Integration** | AWS Bedrock | Managed access to foundation models (Claude 3.5 Sonnet) within AWS boundary. |