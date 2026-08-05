import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createProject,
  fetchProjects,
  updateProject,
} from '#/features/projects/api/projects-api'
import type { CreateProjectInput, ProjectPatch } from '@dev-os/domain'

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.list() }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ProjectPatch }) =>
      updateProject(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.list() }),
  })
}
