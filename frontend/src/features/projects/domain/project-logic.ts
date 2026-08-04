import {
  createSetupSteps,
  type CreateProjectInput,
  type Project,
} from '#/features/projects/types'

export type ProjectPatch = Partial<
  Pick<Project, 'name' | 'description' | 'sdlcPhase' | 'todayFocus' | 'setupSteps'>
>

export function buildNewProject(input: CreateProjectInput): Project {
  const now = new Date().toISOString()
  const name = input.name.trim()
  const description = input.description?.trim() ?? ''
  const sdlcPhase = input.sdlcPhase ?? 'Discovery'
  const todayFocus = input.todayFocus?.trim() ?? ''

  return {
    id: crypto.randomUUID(),
    name,
    description,
    sdlcPhase,
    todayFocus,
    setupSteps: createSetupSteps({
      name,
      description,
      sdlcPhase,
      todayFocus,
    }),
    createdAt: now,
    updatedAt: now,
  }
}

export function applyProjectPatch(current: Project, patch: ProjectPatch): Project {
  const name = patch.name?.trim() ?? current.name
  const description =
    patch.description !== undefined ? patch.description.trim() : current.description
  const sdlcPhase = patch.sdlcPhase ?? current.sdlcPhase
  const todayFocus =
    patch.todayFocus !== undefined ? patch.todayFocus.trim() : current.todayFocus

  const setupSteps =
    patch.setupSteps ??
    createSetupSteps({ name, description, sdlcPhase, todayFocus })

  return {
    ...current,
    name,
    description,
    sdlcPhase,
    todayFocus,
    setupSteps,
    updatedAt: new Date().toISOString(),
  }
}

export function sortProjectsByUpdated(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}
