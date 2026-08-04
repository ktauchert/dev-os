import { describe, expect, it } from 'vitest'

import { buildNewProject } from '#/features/projects/domain/project-logic'
import {
  createSetupSteps,
  nextSetupHint,
  setupProgress,
} from '#/features/projects/types'

describe('project setup helpers', () => {
  it('counts completed setup steps from field values', () => {
    const steps = createSetupSteps({
      name: 'DevOS',
      description: 'A long enough description',
      todayFocus: 'API',
    })
    expect(setupProgress(steps)).toEqual({ done: 3, total: 3, ratio: 1 })
  })

  it('returns the first incomplete step hint', () => {
    const steps = createSetupSteps({ name: 'Only name' })
    expect(nextSetupHint(steps)).toContain('building')
  })
})

describe('buildNewProject', () => {
  it('always starts in Discovery', () => {
    const project = buildNewProject({ name: 'Alpha' })
    expect(project.sdlcPhase).toBe('Discovery')
    expect(project.setupSteps).toHaveLength(3)
    expect(project.setupSteps.map((s) => s.id)).toEqual([
      'named',
      'intent',
      'focus',
    ])
  })
})
