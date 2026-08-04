# UI & interaction

How DevOS should **feel** to use: built for developers who live on the keyboard and lose flow when hunting sidebars with the mouse.

Visual tokens and themes: [ui-theme.md](./ui-theme.md).  
Product boundaries: [mvp.md](./mvp.md).  
Principles: [vision.md](./vision.md) — structure over chat, context over conversation.

---

## What you remember: **Ctrl+K**

That pattern is a **command palette** (same idea as VS Code, GitHub, Linear, Notion, Raycast).

| Piece | Typical stack |
| --- | --- |
| UX name | Command palette, command menu |
| Library | [**cmdk**](https://github.com/pacocoursey/cmdk) |
| shadcn/ui | [**Command**](https://ui.shadcn.com/docs/components/command) (`CommandDialog`, search input, grouped items) |

**Fit for DevOS:** High. Navigation and actions live behind one shortcut instead of a permanent sidebar. Palette can list: go to project, create task, open board, toggle theme, “what’s next?”, later AI prompts — all searchable, keyboard-only after open.

Default shortcut: **`Ctrl+K`** (Windows/Linux) · **`⌘K`** (macOS). Register both where the OS allows.

---

## Deliberately not a default sidebar

Persistent left nav is familiar but often **ignored clutter**: same links always visible, rarely matches “what am I doing right now?”

DevOS prefers:

- **Canvas-first** — the current screen (board, project overview, SDLC step) owns the space.
- **Palette-first navigation** — infrequent jumps via Ctrl+K / ⌘K.
- **Thin context strip** — small, always-visible **context**, not a full app map (see below).
- **On-demand panels** — AI companion, filters, details: open with shortcut or action, close to get space back (drawer/sheet, not a second permanent column).

A sidebar is not forbidden forever (e.g. post-MVP), but **not the MVP shell**.

---

## Shell layout (MVP)

```text
┌─────────────────────────────────────────────────────────────┐
│ Context strip: project · SDLC phase · focus hint  [theme] ⌘K │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                     Main canvas (route outlet)               │
│              Kanban · project home · auth · etc.             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Status bar (footer): configurable project context · sync · …  │
└─────────────────────────────────────────────────────────────┘

        ┌──────────────────────┐
        │ Command palette      │  ← modal, Ctrl+K / ⌘K
        │ [ Search…          ] │
        └──────────────────────┘
```

**Context strip (header)** — *where am I?* Project name, SDLC phase, optional “today’s focus” line. Palette hint + theme control. Not a link farm.

**Main canvas** — structured workflows ([mvp.md](./mvp.md)): boards, forms, phase views.

**Status bar (footer, MVP)** — VS Code–style **persistent project telemetry**, not navigation. Stays in the shell for every authenticated/project view. User-configurable **which fields show** (order on/off), stored per user or per project later.

| MVP status fields (examples) | Purpose |
| --- | --- |
| Active project | Name + quick switch via palette |
| SDLC phase | Current stage in the lifecycle |
| **Setup** | `Setup n/4` from project onboarding checklist |
| Work summary | Open tasks / in-progress count (when data exists) |
| Health / “next step” | One kaizen-style hint ([projects-ux.md](./projects-ux.md)) |
| Connection / sync | Placeholder until API (“Local” / “Synced”) |

**Implemented:** `features/shell/status-bar.tsx`; shell state updated from selected project on `/projects`. Work counts still `0` until work management exists.

**Post-MVP / Pro (not MVP):** e.g. **Pomodoro timer** slot in the status bar — see [future.md](./future.md). Design the footer as **extensible slots** so Pro widgets plug in without redesigning the shell.

---

## Keyboard-first workflow

Align UI with an engineer’s loop: **intent → command → confirm → back to canvas**.

| Priority | Interaction |
| --- | --- |
| Primary | Command palette (navigate, create, run common actions) |
| Secondary | Shortcuts on canvas (e.g. `n` new task when board focused — add gradually) |
| Tertiary | Mouse / touch — fully supported, not required for power use |

Palette groups (MVP-oriented):

1. **Navigate** — Home, Projects  
2. **Open project** — one entry per project (from Query list)  
3. **Create** — New project → `/projects?new=1`  
4. **App** — Toggle theme (sign out later)

**Implemented:** `features/shell/command-palette.tsx` — Ctrl+K / ⌘K; project list + new project.

AI companion ([mvp.md](./mvp.md)): **invoke from palette** (“Ask about this project…”) or dedicated shortcut; opens a **side sheet or modal**, not a always-open chat column.

---

## Routes vs chrome (implementation)

- **TanStack Router** — `/`, `/projects` (search-driven panes). Board and nested project routes later. See [frontend-architecture.md](./frontend-architecture.md).
- **Shell** — `features/shell/app-shell.tsx` from `__root.tsx`.
- **Features** — `features/projects/` etc.; routes stay thin.

Suggested feature modules for UI work:

| Feature | Canvas / role |
| --- | --- |
| `shell/` | Context strip, status bar (footer), command palette, shortcuts |
| `projects/` | Project rail, create form, detail, setup checklist |
| `work/` | Kanban, task detail |
| `sdlc/` | Phase progress, “what’s next” |
| `auth/` | Login (until Cognito: placeholder) |
| `ai/` | Companion sheet + palette entries |

---

## shadcn building blocks

| Need | Component |
| --- | --- |
| Command palette | `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem` |
| Context / AI panel | `Sheet` or `Dialog` |
| Canvas cards / boards | `Card`, `Button`, `Badge`, Table (TanStack Table) |
| Forms | Add Form + TanStack Form when needed |

Install via shadcn CLI when implementing; keep styling on semantic tokens from [ui-theme.md](./ui-theme.md).

---

## MVP UX success (qualitative)

A solo developer can:

- Open the app and understand **project + SDLC context** without reading a sidebar.  
- Reach main destinations via **palette + at most one confirm**.  
- Work on a board or project view with **minimal mouse travel**.  
- Open AI help **when needed**, dismiss it, return to the canvas.

---

## Out of scope for this doc

Pixel mocks, full shortcut map, or mobile layout — add when routes exist. Post-MVP nav experiments live in [future.md](./future.md).
