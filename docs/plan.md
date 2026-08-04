# Plan

Build DevOS as a real SaaS while deepening the **TanStack + Vite** frontend stack, learning **AWS**, and practicing architecture on a real product. Use this file as the **single checklist** for where we are in the lifecycle.

**Scope gate:** [mvp.md](./mvp.md) — if it is not in the MVP, do not build it unless this plan explicitly says post-MVP.

**AWS path:** Milestone order and rationale live in [aws-dev-workflow.md](./aws-dev-workflow.md). The frontend can run ahead on MSW; the backend catches up per contract.

---

## Where we are now

| Area | Status |
| --- | --- |
| **Milestone 1** | Mostly complete — SPA, shell, projects UI, MSW, Vitest |
| **Your next AWS focus** | **Milestone 2** — dev API (Lambda + DynamoDB + API Gateway) for [api-projects.md](./api-projects.md) |
| **Frontend (optional parallel)** | M1 leftovers: `work` / `sdlc` / `auth` route stubs |

---

## Milestone 0 – Foundation ✅

- [x] Repository and doc structure
- [x] Vision, MVP, architecture baseline

---

## Milestone 1 – Contract & local application

**Goal:** Runnable SPA and documented HTTP contracts; MSW implements the server locally so UI work does not wait on AWS.

**Why first:** Same as contract-first API design—stable `fetch` surface, fast local SPA feedback, tests without cloud credentials.

- [x] Vite SPA (React, TypeScript, TanStack Query, shadcn toolchain)
- [x] TanStack Router + [app shell](ui-ux.md) (`features/shell/`)
- [x] UI theme ([ui-theme.md](./ui-theme.md))
- [x] `features/projects/` — workspace; HTTP client + MSW + Vitest ([api-mocking.md](./api-mocking.md), [testing.md](./testing.md), [api-projects.md](./api-projects.md))
- [ ] `backend/` package skeleton (handlers, types; **no deploy yet** — [backend/README.md](../backend/README.md))
- [ ] `features/work/`, `features/sdlc/`, `features/auth/` (thin routes / placeholders)
- [x] Local dev from repo root (`npm run dev` → frontend on port 3000)

**Skill focus:** TanStack Router & Query, Vite SPA layout, shadcn/ui, contract-first HTTP clients ([frontend-architecture.md](./frontend-architecture.md)).

---

## Milestone 2 – Dev API on AWS (projects)

**Goal:** First real serverless stack in a **dev** account: same REST contract as MSW, callable from localhost.

**Why before hosting or Cognito:** Learn Lambda + DynamoDB + API Gateway on one vertical slice; debug with `curl` and `VITE_MOCK_API=false` without CloudFront or JWT complexity. See [aws-dev-workflow.md](./aws-dev-workflow.md#milestone-2--dev-api-checklist).

- [ ] AWS account hygiene (billing alert, least-privilege IAM user/role for dev)
- [ ] DynamoDB table (dev) — access pattern for projects ([workflow sketch](./aws-dev-workflow.md#dynamodb-sketch-projects-mvp))
- [ ] Lambda in `backend/` implementing [api-projects.md](./api-projects.md)
- [ ] API Gateway (dev stage) + CORS for `http://localhost:3000`
- [ ] Verified: `curl` + SPA against dev URL (MSW off)
- [ ] (Optional) SAM/CDK in `infrastructure/` for repeatable dev stack

**Skill focus:** IAM, Lambda, DynamoDB, API Gateway, CORS, CloudWatch logs.

---

## Milestone 3 – Authentication & per-user data

**Goal:** Cognito sign-in; API enforces identity; projects scoped to the signed-in user.

**Why after dev API:** Handlers and DynamoDB patterns work before adding authorizer context and `userId` partitions.

- [ ] Cognito user pool + app client (SPA)
- [ ] Login / logout; protected routes in the SPA
- [ ] Bearer JWT on API requests; API Gateway JWT authorizer
- [ ] Lambda uses caller identity; update storage model (no cross-user access)
- [ ] Update [api-projects.md](./api-projects.md) for auth (401, ownership)

**Skill focus:** Cognito, JWT flow, protected routes (TanStack Router), secure serverless APIs.

---

## Milestone 4 – Host the SPA (S3 + CloudFront)

**Goal:** Public HTTPS URL for the built React app, configured to call the **dev/prod** API.

**Why after dev API (and ideally after M3 for a “real” product):** Static hosting does not provide compute or data; production needs a stable API URL and CORS for the CloudFront origin.

- [ ] S3 bucket for `frontend/dist` (private; CloudFront OAC/OAI)
- [ ] CloudFront distribution + SPA routing
- [ ] Build-time env (`VITE_API_BASE_URL`, `VITE_MOCK_API=false`)
- [ ] Deployment path (manual or CI); no secrets in git

**Skill focus:** S3, CloudFront, cache invalidation, environment configuration ([aws-architecture.md](./aws-architecture.md)).

---

## Milestone 5 – Work management

**Goal:** Plan and track work inside a project.

**Per-resource loop:** `docs/api-*.md` → MSW → Lambda → UI ([aws-dev-workflow.md](./aws-dev-workflow.md#adding-a-new-resource-repeatable)).

- [ ] Epics, features, tasks (domain hierarchy in [architecture.md](./architecture.md))
- [ ] Kanban board and status workflow
- [ ] Optimistic updates where it helps UX

**Skill focus:** TanStack Query server state, UI composition for boards, more DynamoDB access patterns.

---

## Milestone 6 – SDLC in the product

**Goal:** Show where the project is on the **Discovery-first path** and what the next micro-step is ([sdlc-ux.md](./sdlc-ux.md), [mvp.md](./mvp.md)).

- [x] Align create UI/API with always-Discovery (remove create-time phase picker if still present)
- [ ] Phase map / “you are here” + one next step
- [ ] Soft forward transitions (exit hints); no mid-lifecycle create
- [ ] Workflow health (minimal but useful)

**Skill focus:** Workflow and domain modeling. Mid-lifecycle git join stays in [future.md](./future.md).

---

## Milestone 7 – AI companion

**Goal:** Contextual assistance tied to project data (not a generic chatbot).

- [ ] Lambda → Bedrock with project context
- [ ] Next suggested step, daily focus, task refinement
- [ ] UI that complements structured workflows ([vision.md](./vision.md))

**Skill focus:** Bedrock, context assembly, streaming if needed.

---

## Milestone 8 – MVP polish

**Goal:** Shippable MVP per [mvp.md](./mvp.md) success criteria.

- [ ] Error handling and UX pass
- [ ] Performance sanity check
- [ ] Tests where they catch real regressions (MSW + optional dev API smoke)
- [ ] README / run notes for deploy and local dev

---

## Post-MVP (ideas only)

Not part of the MVP checklist. See [future.md](./future.md) for a longer wish list.

- **Pro:** mid-lifecycle join via git crawl / repo analysis ([future.md](./future.md))
- GitHub / GitLab integration (broader)
- Teams, notifications, analytics, plugins, mobile

---

## Project success (build journey)

Same spirit as [vision.md](./vision.md): useful without AI, better with it, solid architecture, learned by shipping milestones 1–8.
