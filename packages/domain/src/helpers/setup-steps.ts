import type { Project, SetupStep } from '../projects/types.js'

export function createSetupSteps(
  partial?: Partial<Pick<Project, 'name' | 'description' | 'todayFocus'>>,
): SetupStep[] {
  const name = partial?.name?.trim() ?? ''
  const description = partial?.description?.trim() ?? ''
  const focus = partial?.todayFocus?.trim() ?? ''

  return [
    {
      id: 'named',
      label: 'Name the project',
      hint: 'A short, recognizable title.',
      done: name.length > 0,
    },
    {
      id: 'intent',
      label: 'Describe the intent',
      hint: 'What are you building, and for whom? (Discovery kickoff)',
      done: description.length >= 12,
    },
    {
      id: 'focus',
      label: 'This week’s focus',
      hint: 'One line — keeps scope small (kaizen).',
      done: focus.length >= 3,
    },
  ]
}

export function setupProgress(steps: SetupStep[]) {
  const total = steps.length
  const done = steps.filter((s) => s.done).length
  return { done, total, ratio: total === 0 ? 0 : done / total }
}

export function nextSetupHint(steps: SetupStep[]): string {
  const next = steps.find((s) => !s.done)
  if (!next) return 'Setup complete — steady progress. Work board comes next.'
  return next.hint
}
