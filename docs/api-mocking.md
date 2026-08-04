# API mocking (MSW)

The frontend talks to a **REST API** over HTTP. Until API Gateway + Lambda exist, **[MSW](https://mswjs.io/)** (Mock Service Worker) implements the same routes in development and tests.

Contract reference: [api-projects.md](./api-projects.md).  
Production map: [aws-architecture.md](./aws-architecture.md).

---

## When MSW runs

| Environment | Mock API |
| --- | --- |
| `npm run dev` | **On** by default (`MswProvider` + service worker in `public/`) |
| `npm run build` / production | **Off** — set `VITE_API_BASE_URL` to the real API |
| `npm test` | **On** via `msw/node` (`src/mocks/server.ts`) |

Override with `frontend/.env.local`:

- `VITE_MOCK_API=false` — call real API in dev (needs `VITE_API_BASE_URL`)
- `VITE_MOCK_API=true` — force mock in production builds (rare; demos only)

---

## Layout

```text
frontend/src/
├── lib/api-client.ts              # fetch wrapper
├── features/projects/api/         # projects-api.ts → HTTP
├── features/projects/domain/      # buildNewProject, applyProjectPatch (shared rules)
├── mocks/
│   ├── db/projects-db.ts          # in-memory store (handlers + test reset)
│   ├── handlers/projects-handlers.ts
│   ├── browser.ts               # dev worker
│   ├── server.ts                # Vitest
│   └── enable-mocking.ts
└── components/msw-provider.tsx  # await worker.start() before UI
```

**Rule:** UI and TanStack Query only import `features/projects/api/*`, never the mock DB.

Lambda later should reuse **domain** rules from a shared package or copy the same shapes; handlers today mirror the intended Lambda behavior.

---

## Adding a new resource

1. Document routes in `docs/api-*.md`.
2. Add `features/<area>/api/*.ts` using `api-client`.
3. Add MSW handlers + in-memory DB (or extend existing store).
4. Add Vitest tests under `*.test.ts` next to API or domain code.

---

## Replacing MSW with AWS

1. Deploy API Gateway + Lambda with the **same paths and JSON** as [api-projects.md](./api-projects.md).
2. Set `VITE_API_BASE_URL` in the deployed SPA environment.
3. Build with `VITE_MOCK_API=false` (default in production).
4. Remove or keep MSW for local dev only.
