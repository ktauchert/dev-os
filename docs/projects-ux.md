# Projects — UX & progress

How the **Projects** area works in MVP: split workspace, light setup steps, and status-bar progress without a heavy wizard or global sidebar.

Related: [ui-ux.md](./ui-ux.md) · [mvp.md](./mvp.md) · [sdlc-ux.md](./sdlc-ux.md) · [vision.md](./vision.md) (continuous progress).

---

## Not a global sidebar

The **left column on `/projects` only** is a **project rail** — list + “New project”. It does not replace app navigation (that stays **Ctrl+K**). Other routes (board, SDLC later) use their own layout.

```text
/projects
┌──────────────┬────────────────────────────────────────┐
│ Project rail │ Main pane                               │
│ · Project A  │  · New project form (name, description) │
│ · Project B  │  · OR selected project detail + setup   │
│ [+ New]      │                                         │
└──────────────┴────────────────────────────────────────┘
```

**URL state (shareable, palette-friendly):**

| URL | Right pane |
| --- | --- |
| `/projects` | Empty state — pick a project or create one |
| `/projects?new=1` | New project form |
| `/projects?project=<id>` | Selected project detail + setup checklist |

Command palette lists projects and opens `/projects?project=<id>` or `?new=1`.

**New project form:** focus moves to the **Name** field on open (button or palette) so typing can start immediately.

---

## MVP features (this slice)

1. **See** all my projects in the rail.  
2. **Create** a project (name required, description optional). Always starts in **Discovery**—no create-time phase picker ([sdlc-ux.md](./sdlc-ux.md)).  
3. **Select** a project → detail on the right; shell header + status bar reflect **active project** and current phase.  
4. **Setup checklist** — small fixed onboarding steps (not a multi-page SDLC wizard yet).  
5. **Progress** in status bar: `Setup …` + encouraging **next micro-step** (kaizen-style).

Data: **MSW** in dev/test ([api-mocking.md](./api-mocking.md)); **dev API** on AWS at Milestone 2 ([api-projects.md](./api-projects.md), [aws-dev-workflow.md](./aws-dev-workflow.md)).

---

## Setup steps (MVP) — ease in, don’t overwhelm

Three **small, completable** onboarding steps (plus an automatic Discovery start). **Done** is derived from project fields — no manual checkbox busywork.

| Step | Intent | Auto-complete when |
| --- | --- | --- |
| **Named** | Clear title | Name non-empty |
| **Intent** | What you’re building (Discovery kickoff) | Description ≥ 12 chars |
| **Focus** | This week (kaizen) | `todayFocus` ≥ 3 chars |

**SDLC phase** is not a setup choice: create always sets **Discovery**. Phase changes later mean **progress along the path** (Milestone 6), not “I already was elsewhere.”

**Progress** = completed setup steps ÷ 3. Shown in footer as `Setup 2/3` and in detail as a simple checklist.

### Kaizen tone (copy, not gamification)

- Status **next** line uses **one** actionable hint, e.g. “Add a one-line focus for this week.”  
- When all setup steps done: “Setup complete — good momentum. Open the board when work items exist.”  
- Avoid streaks, points, or nagging notifications in MVP.

Full **SDLC map / “what’s next”** belong to **Milestone 6** ([sdlc-ux.md](./sdlc-ux.md)) — build on this checklist, don’t block project CRUD on it.

---

## Later (not MVP on this page)

- Soft advance Discovery → Planning → … with exit hints  
- Multi-route phase views (`/projects/$id/sdlc`, …)  
- Auto-complete setup from work items / AI  
- Board link from project detail (`/projects/$id/board`)  
- **Pro mid-lifecycle join** via git crawl — [future.md](./future.md) only

---

## Implementation map

| Piece | Location |
| --- | --- |
| HTTP client | `features/projects/api/projects-api.ts` |
| Domain rules | `packages/domain` (`projects/logic.ts`, `helpers/setup-steps.ts`) |
| MSW handlers | `mocks/handlers/projects-handlers.ts` |
| Route + search params | `frontend/src/routes/projects/index.tsx` |
| Palette entries | `features/shell/command-palette.tsx` |
| Shell sync | `projectToShell()` → `features/shell/shell-context` |
