import {
  nextSetupHint,
  setupProgress,
  type Project,
} from '@dev-os/domain'

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
