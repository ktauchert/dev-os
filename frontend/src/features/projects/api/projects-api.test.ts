import { beforeEach, describe, expect, it } from 'vitest'

import {
  createProject,
  fetchProjects,
  updateProject,
} from '#/features/projects/api/projects-api'
import { resetProjectsDb } from '#/mocks/db/projects-db'

describe('projects API (MSW)', () => {
  beforeEach(() => {
    resetProjectsDb()
  })

  it('creates and lists projects starting in Discovery', async () => {
    await createProject({ name: 'Alpha', description: 'First test project' })
    const list = await fetchProjects()
    expect(list).toHaveLength(1)
    expect(list[0].name).toBe('Alpha')
    expect(list[0].sdlcPhase).toBe('Discovery')
  })

  it('updates a project via PATCH', async () => {
    const created = await createProject({ name: 'Beta' })
    const updated = await updateProject(created.id, {
      todayFocus: 'Ship MSW',
    })
    expect(updated.todayFocus).toBe('Ship MSW')
    expect(updated.setupSteps.find((s) => s.id === 'focus')?.done).toBe(true)
  })
})
