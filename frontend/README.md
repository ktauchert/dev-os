# DevOS frontend

Vite + TanStack Router + Query + shadcn/ui.

**Docs:** [../docs/plan.md](../docs/plan.md) · [../docs/aws-dev-workflow.md](../docs/aws-dev-workflow.md) · [../docs/frontend-architecture.md](../docs/frontend-architecture.md) · [../docs/api-mocking.md](../docs/api-mocking.md) · [../docs/testing.md](../docs/testing.md) · [../AGENTS.md](../AGENTS.md)

## Run

```bash
npm install
npm run dev      # from frontend/, or npm run dev from repo root
npm test
npm run build
```

Port **3000**. Routes: `npm run generate-routes`.

## Stack highlights

- **Shell** — `src/features/shell/` — palette, status bar, theme
- **Projects** — `/projects` — `features/projects/api` → `/api/projects`
- **MSW** — mock API in dev (`public/mockServiceWorker.js`) and in tests (`mocks/server.ts`)
- **Env** — copy `.env.example` → `.env.local` if you need `VITE_API_BASE_URL` or `VITE_MOCK_API`
