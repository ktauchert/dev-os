# Frontend Architecture (React + TypeScript)

## Directory structure (current)

```text
src/
├── components/
│   ├── ui/              # shadcn primitives (button, command, dialog, …)
│   ├── theme-provider.tsx
│   └── theme-controls.tsx
├── features/
│   ├── shell/           # App chrome — see ui-ux.md
│   │   ├── app-shell.tsx
│   │   ├── context-strip.tsx
│   │   ├── status-bar.tsx
│   │   ├── command-palette.tsx
│   │   └── …
│   ├── projects/        # Projects workspace — see projects-ux.md
│   │   ├── api/           # HTTP client (projects-api.ts)
│   │   ├── project-shell.ts  # projectToShell (UI → shell context)
│   │   ├── components/
│   │   ├── queries.ts
│   │   # types + domain logic: @dev-os/domain (packages/domain)
├── mocks/               # MSW handlers + in-memory db — see api-mocking.md
│   ├── auth/            # (planned) Cognito
│   ├── work/            # (planned) Kanban
│   ├── sdlc/            # (planned) phase UI
│   └── ai/              # (planned) companion sheet
├── integrations/tanstack-query/
├── lib/
│   ├── query-client.ts
│   ├── api-client.ts
│   ├── theme.ts
│   └── utils.ts
├── test/setup.ts        # Vitest + MSW node
├── main.tsx             # SPA entry → RouterProvider
├── routes/
│   ├── __root.tsx       # AppShell → <Outlet />
│   ├── index.tsx        # /
│   └── projects/
│       └── index.tsx    # /projects?project=&new=
├── styles.css           # Tailwind + theme tokens (ui-theme.md)
└── router.tsx
```

SPA shell: `index.html` at package root (theme bootstrap + `#root`).

Theming: [ui-theme.md](./ui-theme.md). Shell: [ui-ux.md](./ui-ux.md). Projects: [projects-ux.md](./projects-ux.md). API mock: [api-mocking.md](./api-mocking.md). Tests: [testing.md](./testing.md).

## Routes (today)

| Path | File | Notes |
| --- | --- | --- |
| `/` | `routes/index.tsx` | Home |
| `/projects` | `routes/projects/index.tsx` | Search: `?new=1`, `?project=<id>` |

Thin routes: import from `features/*`; no business logic in route files.

## TanStack Router vs Next.js `layout.tsx`

| Next.js (App Router) | TanStack Router (file routes) |
| --- | --- |
| `app/layout.tsx` | `src/routes/__root.tsx` — wraps every page with `AppShell` + `<Outlet />` |
| Nested `layout.tsx` | e.g. `routes/projects/route.tsx` + `<Outlet />` when needed |
| `children` | `<Outlet />` in layout / root routes |

**Today:** Vite SPA (`index.html` → `src/main.tsx`). `__root.tsx` wraps pages in `AppShell` (Query provider, context strip, main, status bar, command palette). Page content is `<Outlet />`.

## Routing conventions

- File-based routes under `src/routes/`; run `npm run generate-routes` after adding files.
- **No global sidebar** — navigation via command palette; see [ui-ux.md](./ui-ux.md).
- Prefer route **search params** for pane state on `/projects` until nested routes are needed.
- Later: `beforeLoad` / parent routes for Cognito; loaders + Query for API data.
- Do not add React Router.

## Data (frontend)

- Projects: `features/projects/api/projects-api.ts` → `GET/POST/PATCH /api/projects`
- Mock server: MSW ([api-mocking.md](./api-mocking.md)); contract [api-projects.md](./api-projects.md)
- TanStack Query hooks in `features/projects/queries.ts`
- Shell sync: `projectToShell()` when a project is selected on `/projects`

Real API Gateway + Lambda replaces MSW when `VITE_MOCK_API=false` and `VITE_API_BASE_URL` is set (Milestone 2). See [aws-dev-workflow.md](./aws-dev-workflow.md).
