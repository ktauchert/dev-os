import { useShell } from '#/features/shell/shell-context'
import type { StatusBarFieldId } from '#/features/shell/types'

function StatusSegment({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <span className="inline-flex max-w-[14rem] items-center gap-1.5 truncate sm:max-w-none">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium text-foreground">{value}</span>
    </span>
  )
}

function renderField(id: StatusBarFieldId, project: ReturnType<typeof useShell>['project']) {
  switch (id) {
    case 'project':
      return (
        <StatusSegment
          key={id}
          label="Project"
          value={project.projectName ?? '—'}
        />
      )
    case 'phase':
      return <StatusSegment key={id} label="SDLC" value={project.sdlcPhase} />
    case 'setup':
      if (project.setupTotal == null || project.setupTotal === 0) return null
      return (
        <StatusSegment
          key={id}
          label="Setup"
          value={`${project.setupDone ?? 0}/${project.setupTotal}`}
        />
      )
    case 'work':
      return (
        <StatusSegment
          key={id}
          label="Work"
          value={`${project.inProgress} active · ${project.openTasks} open`}
        />
      )
    case 'next':
      return (
        <StatusSegment key={id} label="Next" value={project.nextStep} />
      )
    case 'sync':
      return <StatusSegment key={id} label="Sync" value={project.syncLabel} />
    default:
      return null
  }
}

export function StatusBar() {
  const { project, statusBarFields } = useShell()

  return (
    <footer
      className="flex shrink-0 items-center gap-x-4 gap-y-1 overflow-x-auto border-t border-border bg-card/90 px-4 py-1.5 font-mono text-[11px] backdrop-blur-sm"
      role="status"
      aria-label="Project status"
    >
      {statusBarFields.map((id, index) => (
        <span key={id} className="inline-flex items-center gap-4">
          {index > 0 ? (
            <span className="hidden text-border sm:inline" aria-hidden>
              |
            </span>
          ) : null}
          {renderField(id, project)}
        </span>
      ))}
    </footer>
  )
}
