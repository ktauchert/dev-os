import { QueryClientProvider } from '@tanstack/react-query'

import { MswProvider } from '#/components/msw-provider'
import { getQueryClient } from '#/lib/query-client'
import { CommandPalette } from '#/features/shell/command-palette'
import { CommandPaletteProvider } from '#/features/shell/command-palette-context'
import { ContextStrip } from '#/features/shell/context-strip'
import { ShellProvider } from '#/features/shell/shell-context'
import { StatusBar } from '#/features/shell/status-bar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <MswProvider>
        <ShellProvider>
          <CommandPaletteProvider>
            <div className="flex min-h-screen flex-col">
              <ContextStrip />
              <main className="page-wrap flex-1 py-6">{children}</main>
              <StatusBar />
            </div>
            <CommandPalette />
          </CommandPaletteProvider>
        </ShellProvider>
      </MswProvider>
    </QueryClientProvider>
  )
}
