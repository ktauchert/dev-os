# Future (post-MVP ideas)

Brainstorming for **after** [mvp.md](./mvp.md). Nothing here is approved work—avoid letting agents or scope creep treat this as requirements.

MVP SDLC rule (Discovery-first journey): [sdlc-ux.md](./sdlc-ux.md).

## Integrations

- GitHub, GitLab, Azure DevOps — repos, branches, commits, PRs, issues
- Third-party tools via API or plugins later

## Pro — mid-lifecycle join (far later)

**Problem:** Some developers already have a codebase deep in Development and will not hand-enter Discovery/Planning history.

**Idea (not MVP):** A **Pro** (or power-user) flow to *join* an existing effort without pretending they walked the path manually:

1. Connect a git remote (GitHub/GitLab/…).
2. **Crawl / analyze** the repo (structure, README, recent commits, languages, maybe open issues).
3. Propose a **seeded** DevOS project: inferred intent, suggested phase, starter epics/tasks, gaps to confirm.
4. User reviews and accepts—then continues with the usual accompanied workflow from that point.

Still distinct from MVP: greenfield always starts at **Discovery** with no import. This feature is optional, expensive (analysis + LLM), and depends on git integration existing first.

## Knowledge & docs (in the product)

- In-app documentation, architecture notes, searchable project knowledge
- AI summaries of project state (product feature, not repo ADRs)

## Productivity & insights

- Reminders, weekly goals, session summaries
- Analytics: activity, delivery trends, repo stats

## Platform

- Teams and collaboration
- Plugin system, custom workflows, mobile companion, public API

## Pro / power-user (footer widgets)

- **Pomodoro / focus timer** in the status bar (configurable slot — not [mvp.md](./mvp.md))
- Other optional status-bar widgets (build status, branch name when Git integration exists)

## Design philosophy (unchanged)

Simplicity, structure over chat-only UX, context-aware guidance, developer stays in control. DevOS complements Git hosts and IDEs—it does not replace them.
