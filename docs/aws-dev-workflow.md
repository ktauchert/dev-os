# AWS development workflow

How DevOS is built on AWS, in what order, and why. This is the **learning path** for serverless work in this repo—not a generic “deploy the website first” checklist.

**Related:** [plan.md](./plan.md) · [aws-architecture.md](./aws-architecture.md) · [api-mocking.md](./api-mocking.md) · [api-projects.md](./api-projects.md)

---

## Mental model (vs Supabase / Prisma + Postgres)

| Habit from full-stack / BaaS | DevOS / AWS serverless |
| --- | --- |
| One local stack (DB + auth + API) | Separate services: **DynamoDB**, **Lambda**, **API Gateway**, **Cognito**, **S3/CloudFront** |
| Schema/migrations first (Prisma) | **Access patterns** first → DynamoDB keys; HTTP **contract** in `docs/api-*.md` |
| `fetch` hits your framework or Supabase | `fetch` hits **`VITE_API_BASE_URL`**; implementation can be MSW or API Gateway |
| Auth and DB on day one | **Dev API without auth** is OK briefly; **Cognito + JWT authorizer** when data must be per-user |
| Deploy = app goes live | **Dev API in AWS** is not “production”; localhost SPA can call cloud API months before CloudFront |

The frontend is intentionally **not** tied to mocks: only `features/*/api` + `api-client` speak HTTP. See [api-mocking.md](./api-mocking.md).

---

## Source of truth

```text
docs/api-*.md          ← contract (paths, status codes, JSON)
        │
        ├── MSW handlers (dev + Vitest)
        ├── backend/ Lambda (dev then prod)
        └── frontend features/*/api (client)
```

When contract changes, update **all three implementations** (or two until Lambda exists).

---

## Environments

| Name | Purpose | Typical resources |
| --- | --- | --- |
| **local** | Vite on `localhost:3000`; MSW **or** real dev API | No AWS required for UI-only work |
| **dev** | Your learning / integration account | DynamoDB table `dev-*`, API Gateway stage `dev`, Lambdas, later Cognito pool |
| **prod** | Shippable MVP | Separate table, stage, stricter IAM; same code paths |

Use **one AWS account** with logical separation at first; split accounts later if you want stronger isolation.

**Stages:** API Gateway `dev` vs `prod` URLs; SPA build-time `VITE_API_BASE_URL` points at the right stage.

---

## Recommended milestone order (why this sequence)

High-level flow:

```text
M1  Contract + SPA (MSW)     ← TanStack/Vite SPA; API is “fake but real HTTP”
      │
M2  Dev API (Lambda + DDB)   ← core serverless; call from localhost
      │
M3  Cognito + secure API     ← JWT on Gateway; userId on items
      │
M4  S3 + CloudFront SPA      ← static hosting; CORS + env for API URL
      │
M5+ Features (work, SDLC, AI) ← each: api doc → MSW → Lambda → UI
```

### Why API (M2) before hosting (M4)

- You can run the UI on your machine and point at **execute-api** URLs (`VITE_MOCK_API=false`).
- Hosting the SPA does not create a database or API; it only serves static files.
- Debugging Lambda and DynamoDB is easier without also debugging CDN cache and deploy pipelines.

### Why API (M2) before Cognito (M3)

- First slice: prove **read/write paths**, IAM for Lambda → DynamoDB, and JSON matching [api-projects.md](./api-projects.md).
- Auth adds **Cognito**, **API Gateway authorizer**, **token refresh in the SPA**, and **partition keys per user**—easier on a working handler.
- **Security note:** an open dev API is only acceptable in a private dev account with no sensitive data; lock down before sharing URLs or going prod.

### Why Cognito (M3) before relying on CloudFront (M4) for “real product”

- MVP success criteria require login and **own data** ([mvp.md](./mvp.md)).
- Production SPA should call an API that **enforces** identity, not a public dev stage.

### Why MSW stays after Lambda exists

- Fast UI work offline; stable **Vitest** without hitting AWS on every run.
- Optional: occasional smoke tests against the **dev** API (see [testing.md](./testing.md)).

---

## Parallel tracks (frontend ahead of AWS is fine)

| Track | Owner | Deliverable |
| --- | --- | --- |
| **Contract + UI** | Agent / you (UI) | `docs/api-*.md`, features, MSW, tests |
| **AWS dev API** | You | `backend/`, DynamoDB, Lambda, API Gateway |
| **IaC** | You (when ready) | `infrastructure/` — SAM, CDK, or Terraform; console-first is OK for first slice |

The projects UI and MSW are **ahead** of Milestone 2—that is expected. Your next AWS focus is **Milestone 2**, not re-building the frontend.

---

## Milestone 2 — Dev API (checklist)

Implement [api-projects.md](./api-projects.md) in **dev** (console or IaC).

1. **IAM** — Lambda execution role: `dynamodb:GetItem`, `PutItem`, `UpdateItem`, `Query`, `Scan` (tighten to table ARN); CloudWatch Logs.
2. **DynamoDB** — Table for projects (see [DynamoDB sketch](#dynamodb-sketch-projects-mvp) below).
3. **Lambda** — Node.js in `backend/`; map API Gateway events to handlers; reuse domain rules aligned with `frontend/src/features/projects/domain/`.
4. **API Gateway** — HTTP API or REST API; routes `GET/POST /api/projects`, `GET/PATCH /api/projects/{id}`; integrate Lambda.
5. **CORS** — Allow `http://localhost:3000` (and later your CloudFront origin).
6. **Verify**
   - `curl` against dev stage URL.
   - `frontend/.env.local`: `VITE_MOCK_API=false`, `VITE_API_BASE_URL=https://….execute-api….amazonaws.com/dev`
   - Exercise create/list/patch in the UI.

Official references (start here):

- [Lambda Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)
- [API Gateway HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)
- [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)

---

## Milestone 3 — Auth (checklist)

1. **Cognito user pool** — Sign-up/sign-in; app client for SPA (no secret).
2. **SPA** — Login/logout; store tokens; `Authorization: Bearer` in [api-client](../frontend/src/lib/api-client.ts).
3. **API Gateway** — Cognito JWT authorizer on routes.
4. **Lambda** — Read `sub` (or custom claim) from authorizer context; scope queries to `userId`.
5. **Contract** — Extend `docs/api-projects.md` with auth expectations (401, no cross-user access).
6. **MSW** — Optional mock user for tests; or test against Cognito test users in a separate job.

Reference: [Cognito user pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html), [API Gateway JWT authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html).

---

## Milestone 4 — Host SPA (checklist)

1. **S3** — Bucket for `frontend/dist`; block public access; OAC/OAI for CloudFront.
2. **CloudFront** — HTTPS, default root `index.html`, SPA error routing (403/404 → `index.html`).
3. **Build env** — `VITE_API_BASE_URL`, `VITE_MOCK_API=false` at build time.
4. **CORS** — Add CloudFront origin to API Gateway CORS.
5. **Deploy** — Manual upload or CI (`npm run build` → sync to S3 → invalidation).

Reference: [S3 static website patterns with CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html).

---

## Adding a new resource (repeatable)

Same loop for work items, SDLC, AI, etc.:

1. Write **`docs/api-<resource>.md`**.
2. **Frontend:** `features/<area>/api`, Query hooks, UI; **MSW** handlers + tests.
3. **Backend:** Lambda routes + DynamoDB attributes / GSI as needed.
4. **Deploy** to dev stage; point SPA or keep MSW until UI is ready.
5. **Auth:** ensure Lambda filters by `userId` from JWT.

---

## DynamoDB sketch (projects MVP)

Until Milestone 3, a single-table row per project is enough. After auth, **partition by user**.

**Option A — post–Milestone 3 (recommended for prod):**

| PK | SK | Attributes |
| --- | --- | --- |
| `USER#<userId>` | `PROJECT#<projectId>` | name, description, sdlcPhase, … |

**List projects:** `Query` PK = `USER#<userId>`, SK begins with `PROJECT#`.

**Option B — pre-auth dev only (temporary):**

| PK | SK |
| --- | --- |
| `PROJECT#<id>` | `METADATA` |

Replace with Option A when Cognito lands; do not use Option B in prod.

Domain helpers today live in the frontend; copy or share a package into `backend/src/domain/` so MSW, Lambda, and tests stay aligned.

---

## Switching off MSW

| Goal | Config |
| --- | --- |
| UI against **dev API** | `VITE_MOCK_API=false`, `VITE_API_BASE_URL=<dev stage>` |
| **Production** build | `VITE_MOCK_API=false`, API URL baked in at build |
| **Tests** | MSW on (default in Vitest) |
| **Daily UI, no AWS** | Default dev: MSW on |

---

## IaC placement

- **First slice:** AWS Console or CLI is fine—learn services and IAM.
- **`infrastructure/`:** Add SAM/CDK/Terraform when you are tired of click-ops or need reproducible **dev/prod** (see [infrastructure/README.md](../infrastructure/README.md)).

---

## Agent / session habit

For AWS work, the agent should: name the service, link AWS docs, spell out IAM (principal, actions, resources), propose a **small** change, and give a **verify** step ([AGENTS.md](../AGENTS.md)).
