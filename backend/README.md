# Backend

API and Lambda logic for DevOS. See [architecture.md](../docs/architecture.md) and [aws-architecture.md](../docs/aws-architecture.md).

## Current state

The **HTTP contract** for projects is defined in [docs/api-projects.md](../docs/api-projects.md). The frontend implements the client; **MSW** implements the server in dev/test ([docs/api-mocking.md](../docs/api-mocking.md)).

No deployed Lambda yet — Milestone 4.

## Suggested layout (when you implement)

```text
backend/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── handlers/
    │   └── projects.ts      # API Gateway entrypoints
    ├── domain/              # same rules as frontend domain (or shared package later)
    └── lib/
        ├── response.ts
        └── dynamo.ts
```

Implement handlers to match `docs/api-projects.md` so the SPA only changes `VITE_API_BASE_URL`.
