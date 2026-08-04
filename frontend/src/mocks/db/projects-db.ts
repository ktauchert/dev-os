import {
  applyProjectPatch,
  buildNewProject,
  sortProjectsByUpdated,
  type ProjectPatch,
} from '#/features/projects/domain/project-logic'
import type { CreateProjectInput, Project } from '#/features/projects/types'

let projects: Project[] = []

export function resetProjectsDb() {
  projects = []
}

export function listProjects(): Project[] {
  return sortProjectsByUpdated(projects)
}

export function findProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

export function insertProject(input: CreateProjectInput): Project {
  const project = buildNewProject(input)
  projects = [project, ...projects]
  return project
}

export function patchProject(id: string, patch: ProjectPatch): Project {
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error('Project not found')
  }
  const updated = applyProjectPatch(projects[index], patch)
  projects[index] = updated
  return updated
}
