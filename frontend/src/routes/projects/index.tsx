import { createFileRoute } from '@tanstack/react-router'

import { ProjectsWorkspace } from '#/features/projects/components/projects-workspace'
import type { ProjectsSearch } from '#/features/projects/components/projects-workspace'

export const Route = createFileRoute('/projects/')({
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => ({
    project: typeof search.project === 'string' ? search.project : undefined,
    new:
      search.new === true ||
      search.new === 'true' ||
      search.new === '1' ||
      search.new === 1,
  }),
  component: ProjectsPage,
})

function ProjectsPage() {
  const search = Route.useSearch()
  return (
    <div>
      <h1 className="display-title mb-4 text-2xl font-bold text-foreground">
        Projects
      </h1>
      <ProjectsWorkspace search={search} />
    </div>
  )
}
