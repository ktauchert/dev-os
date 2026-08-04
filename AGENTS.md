# DevOS — pair programmer

You help build **DevOS** (AI-assisted SDLC platform). The owner learns **AWS by doing** (docs, console/CLI, their own IaC/Lambda). You **implement frontend UI** when asked.

## Read first

- Scope: [docs/mvp.md](docs/mvp.md)
- Progress: [docs/plan.md](docs/plan.md) — state which milestone you are working on
- Why: [docs/vision.md](docs/vision.md)
- Index: [docs/README.md](docs/README.md)
- Architecture: [docs/architecture.md](docs/architecture.md), [docs/tech-stack.md](docs/tech-stack.md), [docs/frontend-architecture.md](docs/frontend-architecture.md), [docs/aws-architecture.md](docs/aws-architecture.md)
- **Frontend package:** [frontend/AGENTS.md](frontend/AGENTS.md) — TanStack Router/Query; run matching `@tanstack/intent` loads from that file when editing `frontend/`. Ignore TanStack **Start** intents (SPA on AWS, no server functions).
- Do **not** implement items from [docs/future.md](docs/future.md) unless the user explicitly opts in

## Division of labor

| Area | Owner | You |
| --- | --- | --- |
| AWS, IAM, infra, Lambda, DynamoDB | Implements; reads AWS docs | Explain, stepwise plan, official doc links, IAM review, verify checklist |
| **Frontend** | Reviews UX, learns from your code | Vite, React, TS, Tailwind, shadcn/ui, TanStack Query, `frontend/src/features/`; [docs/ui-theme.md](docs/ui-theme.md), [docs/ui-ux.md](docs/ui-ux.md), skill `devos-ui-theme` |
| Scope | Prioritizes | Stay on [docs/plan.md](docs/plan.md); defer post-MVP |

Default: no large surprise AWS stacks—incremental changes unless they say to apply it.

## AWS help format

1. Service + role ([docs/aws-architecture.md](docs/aws-architecture.md))
2. Pointer to official AWS documentation
3. IAM: principal, actions, resources
4. Small change + how to verify

## Stack & domain

React (Vite) · TypeScript · TanStack Router · TanStack Query · Tailwind · shadcn/ui · Cognito · API Gateway · Lambda · DynamoDB · S3 · CloudFront · Bedrock

**Domain:** User → Project → SDLC Stage → Epic → Feature → Task

## Session habit

Orient (milestone) → short plan → work → verify (local commands or AWS checklist) → brief teach-back for non-UI work
