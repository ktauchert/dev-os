import { useNavigate } from '@tanstack/react-router'
import {
  FolderKanban,
  Home,
  Moon,
  Plus,
  Sun,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '#/components/ui/command'
import { useProjects } from '#/features/projects/queries'
import { useCommandPalette } from '#/features/shell/command-palette-context'
import {
  defaultTheme,
  persistTheme,
  readStoredTheme,
  type ThemeMode,
} from '#/lib/theme'

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const navigate = useNavigate()
  const { data: projects = [] } = useProjects()
  const [mode, setMode] = useState<ThemeMode>(defaultTheme.mode)

  useEffect(() => {
    if (open) setMode(readStoredTheme().mode)
  }, [open])

  const run = (fn: () => void) => {
    setOpen(false)
    fn()
  }

  const toggleTheme = () => {
    const accent = readStoredTheme().accent
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    persistTheme(next, accent)
    setMode(next)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="DevOS commands">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => navigate({ to: '/' }))}>
            <Home />
            Home
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => navigate({ to: '/projects' }))}
          >
            <FolderKanban />
            Projects
          </CommandItem>
        </CommandGroup>
        {projects.length > 0 ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Open project">
              {projects.map((p) => (
                <CommandItem
                  key={p.id}
                  onSelect={() =>
                    run(() =>
                      navigate({
                        to: '/projects',
                        search: { project: p.id },
                      }),
                    )
                  }
                >
                  <FolderKanban />
                  {p.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
        <CommandSeparator />
        <CommandGroup heading="Create">
          <CommandItem
            onSelect={() =>
              run(() => navigate({ to: '/projects', search: { new: true } }))
            }
          >
            <Plus />
            New project
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="App">
          <CommandItem onSelect={() => run(toggleTheme)}>
            {mode === 'dark' ? <Sun /> : <Moon />}
            Toggle theme
            <CommandShortcut>{mode === 'dark' ? 'Light' : 'Dark'}</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
