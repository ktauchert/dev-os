export type ThemeMode = 'light' | 'dark'
export type ThemeAccent = 'stone' | 'cyan' | 'orange' | 'violet'

export const THEME_MODE_KEY = 'devos-theme-mode'
export const THEME_ACCENT_KEY = 'devos-theme-accent'

export const themeAccents: ThemeAccent[] = ['stone', 'cyan', 'orange', 'violet']

export const defaultTheme = {
  mode: 'dark' as ThemeMode,
  accent: 'stone' as ThemeAccent,
}

export function applyTheme(mode: ThemeMode, accent: ThemeAccent) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.dataset.accent = accent
}

export function readStoredTheme(): { mode: ThemeMode; accent: ThemeAccent } {
  if (typeof window === 'undefined') return defaultTheme
  const mode = (localStorage.getItem(THEME_MODE_KEY) as ThemeMode | null) ?? defaultTheme.mode
  const accent =
    (localStorage.getItem(THEME_ACCENT_KEY) as ThemeAccent | null) ?? defaultTheme.accent
  return { mode, accent }
}

export function persistTheme(mode: ThemeMode, accent: ThemeAccent) {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_MODE_KEY, mode)
  localStorage.setItem(THEME_ACCENT_KEY, accent)
  applyTheme(mode, accent)
}

/** Inline in <head> to avoid light flash before React hydrates */
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${THEME_MODE_KEY}')||'dark';var a=localStorage.getItem('${THEME_ACCENT_KEY}')||'stone';var r=document.documentElement;if(m==='dark')r.classList.add('dark');else r.classList.remove('dark');r.dataset.accent=a;}catch(e){document.documentElement.classList.add('dark');document.documentElement.dataset.accent='stone';}})();`
