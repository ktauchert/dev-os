import { useCommandPalette } from '#/features/shell/command-palette-context'
import { useShell } from '#/features/shell/shell-context'
import { ThemeControls } from '#/components/theme-controls'

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline">
      {children}
    </kbd>
  )
}

export function ContextStrip() {
  const { project } = useShell()
  const { setOpen } = useCommandPalette()

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 py-2 backdrop-blur-sm">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
        <span className="truncate text-sm font-semibold text-foreground">
          {project.projectName ?? 'No project'}
        </span>
        <span className="hidden text-muted-foreground sm:inline">·</span>
        <span className="truncate text-xs text-muted-foreground sm:text-sm">
          {project.sdlcPhase}
        </span>
        {project.todayFocus ? (
          <>
            <span className="hidden text-muted-foreground lg:inline">·</span>
            <span className="hidden truncate text-xs text-muted-foreground lg:inline">
              {project.todayFocus}
            </span>
          </>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <span className="hidden sm:inline">Commands</span>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </button>
        <ThemeControls />
      </div>
    </header>
  )
}
