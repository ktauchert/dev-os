# DevOS (Codename)

An AI-assisted software development platform that supports developers throughout the Software Development Life Cycle.

## Status

In active development — **Milestone 1** largely complete (SPA + projects + MSW). **Next AWS focus: Milestone 2** (dev API on Lambda + DynamoDB + API Gateway). See [docs/plan.md](docs/plan.md) and [docs/aws-dev-workflow.md](docs/aws-dev-workflow.md).

## Goals

- Ship a useful MVP ([docs/mvp.md](docs/mvp.md))
- Deepen TanStack/Vite patterns and learn AWS by building the real architecture
- Keep the codebase simple and maintainable

## Tech stack

[docs/tech-stack.md](docs/tech-stack.md)

## Documentation

| | |
| --- | --- |
| Index | [docs/README.md](docs/README.md) |
| **AWS workflow** | [docs/aws-dev-workflow.md](docs/aws-dev-workflow.md) |
| Vision | [docs/vision.md](docs/vision.md) |
| MVP scope | [docs/mvp.md](docs/mvp.md) |
| Plan / milestones | [docs/plan.md](docs/plan.md) |
| Pair programming (DevOS) | [AGENTS.md](AGENTS.md) |
| Frontend (TanStack) | [frontend/AGENTS.md](frontend/AGENTS.md) |

## Repo layout

`frontend/` · `backend/` · `infrastructure/` · `docs/`

From the repo root (after `npm install` in `frontend/`):

```bash
npm run dev
```

To hit a **dev API** instead of MSW, see [docs/aws-dev-workflow.md](docs/aws-dev-workflow.md#switching-off-msw).
