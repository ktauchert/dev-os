import { Plus } from 'lucide-react'

import { Button } from '#/components/ui/button'
import type { Project } from '#/features/projects/types'
import { cn } from '#/lib/utils'

type ProjectListPanelProps = {
  projects: Project[]
  selectedId: string | null
  isLoading: boolean
  onSelect: (id: string) => void
  onNew: () => void
}

export function ProjectListPanel({
  projects,
  selectedId,
  isLoading,
  onSelect,
  onNew,
}: ProjectListPanelProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border md:w-56 md:border-r md:border-b-0 lg:w-64">
      <div className="border-b border-border p-3">
        <Button type="button" className="w-full" size="sm" onClick={onNew}>
          <Plus className="size-4" />
          New project
        </Button>
      </div>
      <nav
        className="flex max-h-48 flex-1 flex-col gap-0.5 overflow-y-auto p-2 md:max-h-none"
        aria-label="Projects"
      >
        {isLoading ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">
            No projects yet. Create one to get started.
          </p>
        ) : (
          projects.map((project) => {
            const active = project.id === selectedId
            const done = project.setupSteps.filter((s) => s.done).length
            const total = project.setupSteps.length
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelect(project.id)}
                className={cn(
                  'rounded-md px-3 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                <span className="block truncate font-medium">{project.name}</span>
                <span
                  className={cn(
                    'mt-0.5 block text-xs',
                    active ? 'text-primary-foreground/80' : 'text-muted-foreground',
                  )}
                >
                  {project.sdlcPhase} · setup {done}/{total}
                </span>
              </button>
            )
          })
        )}
      </nav>
    </aside>
  )
}
