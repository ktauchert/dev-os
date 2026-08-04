# Projects API (MVP)

Interim contract implemented by **MSW** and future **API Gateway + Lambda**. All paths are relative to `VITE_API_BASE_URL` (empty = same origin).

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
  "sdlcPhase": "Discovery | Planning | … (optional, default Discovery)",
  "todayFocus": "string (optional)"
}
```

**Response:** `201` — `Project` · `400` if name missing

## `PATCH /api/projects/:id`

**Body:** partial `{ name?, description?, sdlcPhase?, todayFocus?, setupSteps? }`

**Response:** `200` — `Project` · `404` if not found

`setupSteps` are normally **derived** on the server from fields via `createSetupSteps` (see `features/projects/domain/project-logic.ts`). MSW uses the same logic.

## `Project` shape

See `frontend/src/features/projects/types.ts` — `id`, `name`, `description`, `sdlcPhase`, `todayFocus`, `setupSteps[]`, `createdAt`, `updatedAt`.
