# Testing

How we test the DevOS frontend.

Stack: **[Vitest](https://vitest.dev/)** + **[Testing Library](https://testing-library.com/react)** + **[MSW](https://mswjs.io/)** for HTTP.

Related: [api-mocking.md](./api-mocking.md) · [frontend-architecture.md](./frontend-architecture.md).

---

## Commands

From `frontend/`:

```bash
npm test          # single run (CI)
npm run test:watch
```

From repo root (optional):

```bash
npm run test --prefix frontend
```

Add to root `package.json` when you want one command for CI at monorepo level.

---

## What we test today

| Layer | Example | Location |
| --- | --- | --- |
| **Domain** | Setup step progress / hints | `features/projects/domain/*.test.ts` |
| **API + MSW** | Create/list/patch projects over HTTP | `features/projects/api/*.test.ts` |
| **UI** | (add later) palette, forms | `*.test.tsx` with `render` + `userEvent` |

Vitest setup: `src/test/setup.ts` — starts `msw/node`, resets `projects-db` after each test.

---

## Conventions

- Colocate tests: `foo.ts` → `foo.test.ts` next to it, or `__tests__/` if a folder grows large.
- **Unit:** pure functions (domain, formatters) — no MSW.
- **API integration:** call `projects-api.ts` functions; MSW handlers + in-memory DB must match [api-projects.md](./api-projects.md).
- **Component:** wrap with `QueryClientProvider` + `MswProvider` (or only Query if mocking at API boundary); prefer testing behavior, not implementation details.
- Do not test shadcn primitives; test DevOS flows.

---

## SSR note

`projects-api.ts` returns empty data during SSR (`typeof window === 'undefined'`). Component tests run in jsdom with `window` defined.

---

## CI (later)

When GitHub Actions exists: `cd frontend && npm ci && npm test && npm run build` with `VITE_MOCK_API=false` on build to ensure production bundle does not depend on MSW.
