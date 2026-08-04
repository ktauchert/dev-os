import { createContext, useContext, useMemo, useState } from 'react'

import {
  defaultStatusBarFields,
  mockProjectShell,
  type ProjectShellState,
  type StatusBarFieldId,
} from '#/features/shell/types'

type ShellContextValue = {
  project: ProjectShellState
  setProject: React.Dispatch<React.SetStateAction<ProjectShellState>>
  statusBarFields: StatusBarFieldId[]
}

const ShellContext = createContext<ShellContextValue | null>(null)

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<ProjectShellState>(mockProjectShell)
  const value = useMemo(
    () => ({
      project,
      setProject,
      statusBarFields: defaultStatusBarFields,
    }),
    [project],
  )

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export function useShell() {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error('useShell must be used within ShellProvider')
  return ctx
}
