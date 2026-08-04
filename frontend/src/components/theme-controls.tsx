import { useCallback, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

import {
  defaultTheme,
  persistTheme,
  readStoredTheme,
  type ThemeAccent,
  type ThemeMode,
} from '#/lib/theme'

export function ThemeControls() {
  const [mode, setMode] = useState<ThemeMode>(defaultTheme.mode)
  const [accent, setAccent] = useState<ThemeAccent>(defaultTheme.accent)

  useEffect(() => {
    const stored = readStoredTheme()
    setMode(stored.mode)
    setAccent(stored.accent)
  }, [])

  const toggle = useCallback(() => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    persistTheme(next, accent)
    setMode(next)
  }, [mode, accent])

  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex items-center justify-center rounded-md border border-border bg-card p-2 text-foreground hover:bg-muted"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
