import { describe, expect, it } from 'vitest'

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
      sdlcPhase: 'Development',
      todayFocus: 'API',
    })
    expect(setupProgress(steps)).toEqual({ done: 4, total: 4, ratio: 1 })
  })

  it('returns the first incomplete step hint', () => {
    const steps = createSetupSteps({ name: 'Only name' })
    expect(nextSetupHint(steps)).toContain('building')
  })
})
