import { http, HttpResponse } from 'msw'

import type { CreateProjectInput, Project, ProjectPatch } from '@dev-os/domain'
import {
  findProject,
  insertProject,
  listProjects,
  patchProject,
} from '#/mocks/db/projects-db'

export const projectsHandlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json(listProjects())
  }),

  http.get('/api/projects/:id', ({ params }) => {
    const project = findProject(String(params.id))
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 })
    }
    return HttpResponse.json(project)
  }),

  http.post('/api/projects', async ({ request }) => {
    const body = (await request.json()) as CreateProjectInput
    if (!body.name?.trim()) {
      return HttpResponse.json({ message: 'Name is required' }, { status: 400 })
    }
    const project = insertProject(body)
    return HttpResponse.json(project, { status: 201 })
  }),

  http.patch('/api/projects/:id', async ({ params, request }) => {
    const id = String(params.id)
    if (!findProject(id)) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 })
    }
    try {
      const patch = (await request.json()) as ProjectPatch
      const project = patchProject(id, patch)
      return HttpResponse.json(project)
    } catch {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 })
    }
  }),
]
