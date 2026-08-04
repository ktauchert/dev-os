# API mocking (MSW)

The frontend talks to a **REST API** over HTTP. **[MSW](https://mswjs.io/)** implements the same routes in development and tests when API Gateway + Lambda are not in use—or when you choose not to call AWS on every `npm run dev`.

**This is not the long-term server.** The contract is [api-projects.md](./api-projects.md); AWS implements it in Milestone 2+. Workflow: [aws-dev-workflow.md](./aws-dev-workflow.md).

---

## When MSW runs

| Environment | Mock API |
| --- | --- |
| `npm run dev` | **On** by default (`MswProvider` + service worker in `public/`) |
| `npm run dev` + real dev API | **Off** — `VITE_MOCK_API=false` and `VITE_API_BASE_URL` set |
| `npm run build` / production | **Off** — `VITE_API_BASE_URL` points at API Gateway |
| `npm test` | **On** via `msw/node` (`src/mocks/server.ts`) |

Override with `frontend/.env.local`:

- `VITE_MOCK_API=false` — call dev API (needs `VITE_API_BASE_URL`)
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

Lambda should reuse **domain** rules from a shared package or copy the same shapes; MSW handlers mirror intended Lambda behavior.

---

## Adding a new resource

Follow the loop in [aws-dev-workflow.md](./aws-dev-workflow.md#adding-a-new-resource-repeatable):

1. Document routes in `docs/api-*.md`.
2. Add `features/<area>/api/*.ts` using `api-client`.
3. Add MSW handlers + in-memory DB (or extend existing store).
4. Add Vitest tests next to API or domain code.
5. Implement Lambda + DynamoDB when the contract stabilizes.

---

## Using the dev API instead of MSW

1. Deploy API Gateway + Lambda with the **same paths and JSON** as [api-projects.md](./api-projects.md) (Milestone 2).
2. In `frontend/.env.local`: `VITE_MOCK_API=false`, `VITE_API_BASE_URL=https://….execute-api….amazonaws.com/dev`.
3. Confirm CORS allows `http://localhost:3000`.
4. Keep MSW for Vitest; optional smoke tests against dev API later ([testing.md](./testing.md)).

Production builds: `VITE_MOCK_API=false` and API URL set at build time (Milestone 4).
