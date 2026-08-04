# MVP

## Problem

Developing software requires navigating the entire Software Development Life Cycle (SDLC), involving many activities, decisions, tools, and artifacts. As projects evolve, maintaining context and understanding the next meaningful step becomes increasingly difficult. This friction slows progress, interrupts engineering workflows, and causes developers to lose momentum.

---

## Target User

The initial target users are individual developers who manage their own software projects. This includes hobby developers, students, freelancers, and indie hackers who need a central place to organize their work, maintain project context, and continuously make progress.

---

## Value Proposition

DevOS helps developers successfully deliver software products by reducing friction throughout the Software Development Life Cycle. Projects **start at Discovery** and are guided forward with small steps so context accumulates in the product. Developers keep momentum, see what comes next on *that* path, and move projects toward completion.

---

## Core Features

### Authentication

Provide secure user authentication and project ownership.

### Projects

Create and manage software projects. **New projects always begin in Discovery** (journey starts with the app—not a mid-lifecycle status pick). See [sdlc-ux.md](./sdlc-ux.md).

### SDLC Workflow

Guide projects along a structured SDLC path from Discovery forward. “Where you are and what comes next” means orientation on **that shared path** and the next micro-step—not free placement on the map. Soft phase advances and a phase map belong to Milestone 6 ([plan.md](./plan.md)).

### Work Management

Organize work using epics, features, tasks, and a Kanban-based workflow (under the current phase).

### AI Companion

Provide contextual assistance throughout the project by:

* Recommending the next meaningful step.
* Providing a daily focus.
* Answering project-related questions.
* Assisting with planning and task refinement.

The AI Companion should understand context **built in DevOS along the journey**, not invent history for projects that never walked Discovery with the app.

---

## Out of Scope

The MVP intentionally excludes:

* Starting a project mid-lifecycle (e.g. create as Development) or manual backfill of prior phases
* Git repo crawl / import to seed SDLC context (**post-MVP Pro** — [future.md](./future.md))
* GitHub / GitLab integration (beyond the Pro idea above)
* Team collaboration
* Advanced analytics
* Plugin system
* Mobile application
* CI/CD insights
* Notifications and reminders
* Advanced AI agents

These capabilities belong to future iterations and should not delay the first usable product.

---

## Success Criteria

The MVP is considered successful when a developer can:

* Create an account and log in.
* Create a project that **starts in Discovery** and manage it over time.
* Follow an SDLC-oriented path with a clear sense of **current phase** and **next small step**.
* Manage work items through a Kanban board.
* Receive contextual assistance from the AI Companion grounded in project context.
* Use the platform from **idea (Discovery)** through active development—with momentum from small steps.

Ultimately, the MVP is successful when developers choose to return because DevOS genuinely helps them make progress and complete their software projects.
