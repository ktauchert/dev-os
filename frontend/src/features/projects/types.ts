export type SdlcPhase =
  | 'Discovery'
  | 'Planning'
  | 'Architecture'
  | 'Development'
  | 'Testing'
  | 'Maintenance'

export type SetupStepId = 'named' | 'intent' | 'phase' | 'focus'

export type SetupStep = {
  id: SetupStepId
  label: string
  hint: string
  done: boolean
}

export type Project = {
  id: string
  name: string
  description: string
  sdlcPhase: SdlcPhase
  todayFocus: string
  setupSteps: SetupStep[]
  createdAt: string
  updatedAt: string
}

export const SDLC_PHASES: SdlcPhase[] = [
  'Discovery',
  'Planning',
  'Architecture',
  'Development',
  'Testing',
  'Maintenance',
]

export function createSetupSteps(
  partial?: Partial<Pick<Project, 'name' | 'description' | 'sdlcPhase' | 'todayFocus'>>,
): SetupStep[] {
  const name = partial?.name?.trim() ?? ''
  const description = partial?.description?.trim() ?? ''
  const phase = partial?.sdlcPhase
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
      hint: 'What are you building, and for whom?',
      done: description.length >= 12,
    },
    {
      id: 'phase',
      label: 'Set SDLC starting phase',
      hint: 'Where you are today — you can change this later.',
      done: Boolean(phase),
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

export function projectToShell(project: Project) {
  const { done, total } = setupProgress(project.setupSteps)
  return {
    projectName: project.name,
    sdlcPhase: project.sdlcPhase,
    openTasks: 0,
    inProgress: 0,
    nextStep:
      done === total
        ? 'Setup complete — add work items when the board ships'
        : nextSetupHint(project.setupSteps),
    syncLabel: 'Mock API',
    todayFocus: project.todayFocus || undefined,
    setupDone: done,
    setupTotal: total,
  }
}

export type CreateProjectInput = {
  name: string
  description?: string
  sdlcPhase?: SdlcPhase
  todayFocus?: string
}
