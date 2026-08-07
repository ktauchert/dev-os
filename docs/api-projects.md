# Projects API (MVP)

**OpenAPI (machine-readable):** [api/openapi.yaml](./api/openapi.yaml) — import in Insomnia, Postman, or Swagger UI.

HTTP contract implemented by **MSW** (local/tests) and **API Gateway + Lambda** (AWS). Paths are relative to `VITE_API_BASE_URL` (empty = same origin).

## Where the frontend calls this API

| Layer | File |
| --- | --- |
| HTTP paths | [frontend/src/features/projects/api/projects-api.ts](../frontend/src/features/projects/api/projects-api.ts) |
| `fetch` wrapper | [frontend/src/lib/api-client.ts](../frontend/src/lib/api-client.ts) |
| React Query | [frontend/src/features/projects/queries.ts](../frontend/src/features/projects/queries.ts) |
| Mock implementation (optional) | [frontend/src/mocks/handlers/projects-handlers.ts](../frontend/src/mocks/handlers/projects-handlers.ts) |
| Real implementation (you build) | [backend/](../backend/) per [backend/FILES.md](../backend/FILES.md) |

Turn off MSW: `VITE_MOCK_API=false` and set `VITE_API_BASE_URL` — then only the rows above without “Mock” must work or the UI breaks (intentional when learning).

**Build order:** [aws-dev-workflow.md](./aws-dev-workflow.md) · **Auth (Milestone 3):** requests will require `Authorization: Bearer <JWT>`; Lambdas scope data by Cognito `sub`. Until then, dev-only stacks may omit the authorizer—do not expose that configuration to the public internet.

## `GET /api/projects`

**Response:** `200` — `Project[]` sorted by `updatedAt` desc.

## `GET /api/projects/:id`

**Response:** `200` — `Project` · `404` — `{ "message": "Project not found" }`

## `POST /api/projects`

**Body:**

```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "todayFocus": "string (optional)"
}
```

**Response:** `201` — `Project` with **`sdlcPhase: "Discovery"` always** · `400` if name missing

Do **not** accept a create-time starting phase. MVP journey starts at Discovery ([sdlc-ux.md](./sdlc-ux.md), [mvp.md](./mvp.md)). If a client sends `sdlcPhase` on POST, ignore it (or `400`)—server wins.

## `PATCH /api/projects/:id`

**Body:** partial `{ name?, description?, sdlcPhase?, todayFocus?, setupSteps? }`

**Response:** `200` — `Project` · `404` if not found

`sdlcPhase` on PATCH is for **advancing along the path** (soft transitions in Milestone 6), not for declaring a mid-lifecycle import. Prefer forward moves; do not treat arbitrary jumps as first-class MVP behavior.

`setupSteps` are normally **derived** on the server from fields via `createSetupSteps` (see `packages/domain/src/helpers/setup-steps.ts`). MSW and Lambda should use the same logic. Setup no longer includes a “pick starting phase” step.

## `Project` shape

See `packages/domain` (`Project`) — `id`, `name`, `description`, `sdlcPhase`, `todayFocus`, `setupSteps[]`, `createdAt`, `updatedAt`.

## Auth (Milestone 3+)

| Status | Meaning |
| --- | --- |
| `401` | Missing or invalid JWT (when authorizer enabled) |
| `404` | Project not found **or** not owned by caller (prefer not to leak existence) |

List and mutate operations return only projects for the authenticated user.
