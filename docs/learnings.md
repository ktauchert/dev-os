# Learnings

Short notes from building DevOS — gotchas, decisions, and “why it broke.” Add new entries at the **top**.

---

## 2026-08-07 — Frontend boot postmortem (Start → SPA, Vite 8, MSW SW)

**What felt wrong:** “Everyone uses Vite + TanStack + MSW — why is ours special?”  
**Answer:** The *product* stack is normal. The *scaffold* and *install graph* were not.

### Root causes (in order)

1. **CTA scaffolded TanStack Start** (`.cta.json` `routerOnly: false`) while DevOS docs want a **Vite SPA** (S3/CloudFront, no SSR). That mismatch stayed invisible until Start + Vite 8 broke HTML serving (`Cannot GET /`).
2. **Vite 8 / Rolldown** left CJS `require("react")` in prebundles (`use-sync-external-store`) → runtime crash in the browser. Pin **Vite 7** + `@vitejs/plugin-react` 5.x for now.
3. **npm workspaces + `legacy-peer-deps`** after adding `@dev-os/domain`: TanStack peers were pinned to unblock install; packages hoisted unevenly (often `@tanstack/*` at repo root, `react` under `frontend/`). Vite needs `resolve.dedupe` + React aliases.
4. **Browser MSW Service Worker** is a common pattern, but its `location.reload()` when “registered but not controlling” double-booted the Vite client. DevOS now mocks `/api/*` via **Vite middleware** (`vite-plugin-msw.ts`); Vitest still uses `msw/node`.

### What we keep (minimal)

| Piece | Why |
| --- | --- |
| `index.html` + `main.tsx` + Router plugin | Normal Vite SPA |
| Vite 7 + React aliases / dedupe | Monorepo resolution |
| `vite-plugin-msw.ts` + `mocks/vite-bridge.ts` | Dev API without SW reload |
| `mocks/handlers` + `mocks/server.ts` | Shared contract + Vitest |

### What we dropped as noise

Browser `setupWorker`, `MswProvider`, `enableMocking`, `public/mockServiceWorker.js`, root-level `msw` dep, oversized `optimizeDeps` / HMR / warmup experiments, Start / SSR-query packages.
