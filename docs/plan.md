# Plan

Build DevOS as a real SaaS while learning React, AWS, and architecture in practice. Use this file as the **single checklist** for where we are in the lifecycle.

**Scope gate:** [mvp.md](./mvp.md) — if it is not in the MVP, do not build it unless this plan explicitly says post-MVP.

---

## Milestone 0 – Foundation ✅

- [x] Repository and doc structure
- [x] Vision, MVP, architecture baseline

---

## Milestone 1 – Local foundation

**Goal:** Run DevOS locally with a clean dev setup.

- [ ] React app (Vite, TypeScript)
- [ ] Backend app skeleton
- [ ] Feature-first project structure and routing
- [ ] Local dev documented in `frontend/README.md`

**Learning:** React, TypeScript, project layout ([frontend-architecture.md](./frontend-architecture.md)).

---

## Milestone 2 – Cloud foundation

**Goal:** Host the app on AWS.

- [ ] AWS account and IAM basics
- [ ] S3 + CloudFront for the SPA
- [ ] Deployment path (manual or CI)
- [ ] Environment configuration; no secrets in git

**Learning:** IAM, S3, CloudFront, CloudWatch ([aws-architecture.md](./aws-architecture.md)).

---

## Milestone 3 – Authentication

**Goal:** Users can sign in and access their own data.

- [ ] Cognito user pool (or chosen auth)
- [ ] Login / logout
- [ ] Protected routes in the SPA
- [ ] Session / JWT handling toward API Gateway

**Learning:** Cognito, auth flow, protected React routes.

---

## Milestone 4 – Projects

**Goal:** Create and manage software projects.

- [ ] Project CRUD API + persistence
- [ ] Project dashboard and settings
- [ ] TanStack Query for server state

**Learning:** Forms, validation, mutations and cache updates.

---

## Milestone 5 – Work management

**Goal:** Plan and track work inside a project.

- [ ] Epics, features, tasks (domain hierarchy in [architecture.md](./architecture.md))
- [ ] Kanban board and status workflow
- [ ] Optimistic updates where it helps UX

**Learning:** Server state, UI composition for boards.

---

## Milestone 6 – SDLC in the product

**Goal:** Show where the project is in the SDLC and what comes next.

- [ ] SDLC phases per project
- [ ] Progress visualization
- [ ] Workflow transitions / project health (minimal but useful)

**Learning:** Workflow and domain modeling.

---

## Milestone 7 – AI companion

**Goal:** Contextual assistance tied to project data (not a generic chatbot).

- [ ] Lambda → Bedrock with project context
- [ ] Next suggested step, daily focus, task refinement
- [ ] UI that complements structured workflows ([vision.md](./vision.md))

**Learning:** Bedrock, context assembly, streaming if needed.

---

## Milestone 8 – MVP polish

**Goal:** Shippable MVP per [mvp.md](./mvp.md) success criteria.

- [ ] Error handling and UX pass
- [ ] Performance sanity check
- [ ] Tests where they catch real regressions
- [ ] README / run notes for deploy and local dev

---

## Post-MVP (ideas only)

Not part of the MVP checklist. See [future.md](./future.md) for a longer wish list.

- GitHub / GitLab integration
- Teams, notifications, analytics, plugins, mobile

---

## Project success (build journey)

Same spirit as [vision.md](./vision.md): useful without AI, better with it, solid architecture, learned by shipping milestones 1–8.
