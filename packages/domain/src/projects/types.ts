export type SdlcPhase =
  | 'Discovery'
  | 'Planning'
  | 'Architecture'
  | 'Development'
  | 'Testing'
  | 'Maintenance'

export type SetupStepId = 'named' | 'intent' | 'focus'

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

export type CreateProjectInput = {
  name: string
  description?: string
  todayFocus?: string
}
