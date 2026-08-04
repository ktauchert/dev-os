import { useEffect, useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  nextSetupHint,
  setupProgress,
  SDLC_PHASES,
  type Project,
  type SdlcPhase,
} from '#/features/projects/types'
import {
  useUpdateProject,
} from '#/features/projects/queries'

type ProjectDetailPanelProps = {
  project: Project
}

export function ProjectDetailPanel({ project }: ProjectDetailPanelProps) {
  const update = useUpdateProject()
  const [focusDraft, setFocusDraft] = useState(project.todayFocus)
  const [descriptionDraft, setDescriptionDraft] = useState(project.description)

  useEffect(() => {
    setFocusDraft(project.todayFocus)
    setDescriptionDraft(project.description)
  }, [project.id, project.todayFocus, project.description])

  const { done, total } = setupProgress(project.setupSteps)
  const encouragement =
    done === total
      ? 'Setup complete — good momentum. Keep the next step small.'
      : nextSetupHint(project.setupSteps)

  return (
    <div className="max-w-2xl">
      <header>
        <h2 className="display-title text-2xl font-semibold text-foreground">
          {project.name}
        </h2>
        <label className="mt-3 flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Description</span>
          <textarea
            value={descriptionDraft}
            onChange={(e) => setDescriptionDraft(e.target.value)}
            onBlur={() => {
              if (descriptionDraft !== project.description) {
                update.mutate({
                  id: project.id,
                  patch: { description: descriptionDraft },
                })
              }
            }}
            rows={3}
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </label>
      </header>

      <div className="island-shell mt-6 rounded-lg p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Kaizen · next small step
        </p>
        <p className="mt-1 text-sm text-foreground">{encouragement}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Setup progress {done}/{total}
        </p>
      </div>

      <section className="mt-8">
        <h3 className="text-sm font-semibold text-foreground">Project fields</h3>
        <div className="mt-3 grid gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">SDLC phase</span>
            <select
              value={project.sdlcPhase}
              onChange={(e) =>
                update.mutate({
                  id: project.id,
                  patch: { sdlcPhase: e.target.value as SdlcPhase },
                })
              }
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            >
              {SDLC_PHASES.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">This week’s focus</span>
            <input
              value={focusDraft}
              onChange={(e) => setFocusDraft(e.target.value)}
              onBlur={() => {
                if (focusDraft !== project.todayFocus) {
                  update.mutate({
                    id: project.id,
                    patch: { todayFocus: focusDraft },
                  })
                }
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            />
          </label>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-sm font-semibold text-foreground">Setup checklist</h3>
        <ul className="mt-3 space-y-2">
          {project.setupSteps.map((step) => (
            <li
              key={step.id}
              className="flex items-start gap-3 rounded-md border border-border bg-card/50 px-3 py-2"
            >
              <span
                className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border border-border text-[10px]"
                aria-hidden
              >
                {step.done ? '✓' : ''}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.hint}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Steps complete automatically as you fill in project fields — small wins, no busywork.
        </p>
      </section>

      <Button type="button" variant="outline" className="mt-8" disabled>
        Open board (coming with work management)
      </Button>
    </div>
  )
}
