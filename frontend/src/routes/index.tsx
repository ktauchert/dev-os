import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div>
      <h1 className="display-title text-4xl font-bold text-foreground">DevOS</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Canvas-first shell: context strip, status bar, and{' '}
        <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-sm">
          Ctrl+K
        </kbd>{' '}
        for commands — no sidebar.
      </p>
    </div>
  )
}
