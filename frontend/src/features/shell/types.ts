/** Project context shown in the shell (header + status bar). Mock until API exists. */
export type ProjectShellState = {
  projectName: string | null
  sdlcPhase: string
  openTasks: number
  inProgress: number
  nextStep: string
  syncLabel: string
  todayFocus?: string
  setupDone?: number
  setupTotal?: number
}

export type StatusBarFieldId =
  | 'project'
  | 'phase'
  | 'setup'
  | 'work'
  | 'next'
  | 'sync'

export const defaultStatusBarFields: StatusBarFieldId[] = [
  'project',
  'phase',
  'setup',
  'work',
  'next',
  'sync',
]

export const mockProjectShell: ProjectShellState = {
  projectName: 'Sample Project',
  sdlcPhase: 'Development',
  openTasks: 5,
  inProgress: 2,
  nextStep: 'Scaffold work board',
  syncLabel: 'Mock API',
  todayFocus: 'Shell & routes',
  setupDone: 2,
  setupTotal: 4,
}
