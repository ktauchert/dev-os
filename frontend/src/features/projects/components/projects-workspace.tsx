import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { NewProjectForm } from '#/features/projects/components/new-project-form'
import { ProjectDetailPanel } from '#/features/projects/components/project-detail-panel'
import { ProjectListPanel } from '#/features/projects/components/project-list-panel'
import { useProjects } from '#/features/projects/queries'
import { projectToShell } from '#/features/projects/types'
import { useShell } from '#/features/shell/shell-context'

export type ProjectsSearch = {
  project?: string
  new?: boolean
}

type ProjectsWorkspaceProps = {
  search: ProjectsSearch
}

export function ProjectsWorkspace({ search }: ProjectsWorkspaceProps) {
  const navigate = useNavigate()
  const { setProject } = useShell()
  const { data: projects = [], isLoading } = useProjects()

  const showNew = Boolean(search.new)
  const selectedId =
    search.project && projects.some((p) => p.id === search.project)
      ? search.project
      : null

  const selected = selectedId
    ? projects.find((p) => p.id === selectedId)
    : undefined

  useEffect(() => {
    if (selected) {
      setProject(projectToShell(selected))
    } else if (!showNew && projects.length === 0) {
      setProject({
        projectName: null,
        sdlcPhase: '—',
        openTasks: 0,
        inProgress: 0,
        nextStep: 'Create your first project',
        syncLabel: 'Mock API',
        setupDone: 0,
        setupTotal: 4,
      })
    }
  }, [selected, showNew, projects.length, setProject])

  const goNew = () => navigate({ to: '/projects', search: { new: true } })
  const goSelect = (id: string) =>
    navigate({ to: '/projects', search: { project: id } })
  const clearPane = () => navigate({ to: '/projects', search: {} })

  return (
    <div className="feature-card flex min-h-[min(70vh,640px)] flex-col overflow-hidden rounded-xl border border-border md:flex-row">
      <ProjectListPanel
        projects={projects}
        selectedId={selectedId}
        isLoading={isLoading}
        onSelect={goSelect}
        onNew={goNew}
      />
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {showNew ? (
          <NewProjectForm
            onCreated={(id) => goSelect(id)}
            onCancel={clearPane}
          />
        ) : selected ? (
          <ProjectDetailPanel project={selected} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              Select a project from the list or create a new one.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Tip: <kbd className="rounded border border-border px-1">Ctrl+K</kbd>{' '}
              lists projects from anywhere.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
