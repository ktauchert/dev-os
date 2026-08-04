# SDLC journey (product)

How DevOS treats the Software Development Life Cycle for solo developers.

**Scope:** [mvp.md](./mvp.md) · Setup UI: [projects-ux.md](./projects-ux.md) · Later map UI: Milestone 6 in [plan.md](./plan.md)  
**Post-MVP mid-lifecycle join:** [future.md](./future.md)

---

## Product rule (MVP)

**Every project starts at Discovery.** The journey is built *with* the app so context accumulates as the developer progresses. Phase means “how far we have walked together,” not “where I already was outside DevOS.”

“Understand where you are and what comes next” means:

- You are on the **guided path** that began at Discovery.
- The shell and (later) SDLC view show **current phase** and **one next micro-step**.
- Small completable steps create **momentum** (kaizen)—not a dump of historical decisions.

### Why not start mid-lifecycle in MVP

Jumping to Planning or Development without a DevOS trail would require **manual backfill** of intent, decisions, and knowledge. Solo developers will not do that. Empty mid-start also weakens “what’s next” and the AI companion.

Mid-lifecycle onboarding (e.g. analyze a git repo to seed context) is an explicit **later / Pro** idea—see [future.md](./future.md).

---

## Path (phases)

Order for MVP (names may refine later):

```text
Discovery → Planning → Architecture → Development → Testing → Maintenance
```

| Rule | Detail |
| --- | --- |
| **Create** | Always `Discovery`. No create-time phase picker. |
| **Advance** | Soft forward along the path when exit criteria feel met (Milestone 6). |
| **Retreat** | Optional later; not required for MVP. Prefer honesty: stay until ready. |
| **Experienced users** | Same start. Discovery can be short (problem + success in a few lines)—standards without theater. |

---

## Two layers

```text
Layer A — Position on the path     Layer B — Progress inside the phase
Discovery → … → Maintenance        Next micro-step / soft exit criteria
     ▲                                    │
     └── context strip                    └── status / SDLC canvas / AI
```

Today (projects slice): phase is mostly Layer A in the shell + detail. Milestone 6 adds the map and Layer B. Setup checklist ([projects-ux.md](./projects-ux.md)) is **project onboarding**, not the full lifecycle wizard.

---

## AI companion (Milestone 7)

Uses context gathered **along this path** (project fields, work items, phase). It does not invent a backstory for a mid-start project. That keeps recommendations grounded.
