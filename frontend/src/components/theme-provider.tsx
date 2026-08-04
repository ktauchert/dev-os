import { useEffect } from 'react'
import { applyTheme, readStoredTheme } from '#/lib/theme'

/** Syncs stored theme to <html> on client load (inline script handles first paint). */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { mode, accent } = readStoredTheme()
    applyTheme(mode, accent)
  }, [])

  return children
}
