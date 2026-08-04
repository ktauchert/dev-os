import { apiGet, apiPatch, apiPost, ApiError } from '#/lib/api-client'
import type { ProjectPatch } from '#/features/projects/domain/project-logic'
import type { CreateProjectInput, Project } from '#/features/projects/types'

const PROJECTS_PATH = '/api/projects'

/** SSR: no fetch until the client (MSW or real API) is available. */
function skipClientFetch<T>(fallback: T): Promise<T> | null {
  if (typeof window === 'undefined') return Promise.resolve(fallback)
  return null
}

export async function fetchProjects(): Promise<Project[]> {
  const skipped = skipClientFetch<Project[]>([])
  if (skipped) return skipped
  return apiGet<Project[]>(PROJECTS_PATH)
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const skipped = skipClientFetch<Project | null>(null)
  if (skipped) return skipped
  try {
    return await apiGet<Project>(`${PROJECTS_PATH}/${id}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  return apiPost<Project>(PROJECTS_PATH, input)
}

export async function updateProject(
  id: string,
  patch: ProjectPatch,
): Promise<Project> {
  return apiPatch<Project>(`${PROJECTS_PATH}/${id}`, patch)
}
