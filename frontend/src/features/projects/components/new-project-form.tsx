import { useEffect, useRef, useState } from 'react'

import { Button } from '#/components/ui/button'
import { useCreateProject } from '#/features/projects/queries'

type NewProjectFormProps = {
  onCreated: (projectId: string) => void
  onCancel: () => void
}

export function NewProjectForm({ onCreated, onCancel }: NewProjectFormProps) {
  const create = useCreateProject()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [todayFocus, setTodayFocus] = useState('')

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      nameInputRef.current?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    create.mutate(
      { name, description, todayFocus },
      {
        onSuccess: (project) => onCreated(project.id),
      },
    )
  }

  return (
    <div className="max-w-lg">
      <h2 className="display-title text-xl font-semibold text-foreground">
        New project
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Journeys start in Discovery. Name it, describe intent, optionally set this
        week’s focus — then refine setup after saving.
      </p>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Name</span>
          <input
            ref={nameInputRef}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none ring-ring focus-visible:ring-2"
            placeholder="e.g. DevOS"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none ring-ring focus-visible:ring-2"
            placeholder="What are you building, and for whom?"
          />
        </label>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">SDLC phase:</span>{' '}
          Discovery (starting point — you advance as you go)
        </p>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">This week’s focus (optional)</span>
          <input
            value={todayFocus}
            onChange={(e) => setTodayFocus(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none ring-ring focus-visible:ring-2"
            placeholder="One line"
          />
        </label>
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={create.isPending || !name.trim()}>
            {create.isPending ? 'Saving…' : 'Create project'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
