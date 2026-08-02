---
name: devos-ui-theme
description: >-
  Applies DevOS shadcn/ui theming — paper light mode, dark stone surfaces, and
  stone/cyan/orange/violet accent themes via CSS variables. Use when scaffolding
  the frontend, editing globals.css or themes.css, ThemeProvider, theme toggle,
  Tailwind semantic colors, or any DevOS UI styling and color modes.
---

# DevOS UI theme

## Source of truth

Read [docs/ui-theme.md](../../../docs/ui-theme.md) before changing colors or theme wiring.

## Rules

1. **shadcn/ui only** for interactive UI; extend via tokens, not forked component copies.
2. **No raw palette classes in features** — avoid `bg-stone-950`, `text-cyan-500` in `src/features/**`. Use `bg-background`, `text-primary`, etc. Accent-specific color only in `styles/themes.css`.
3. **Defaults:** `dark` mode, `stone` accent.
4. **Light:** paper palette on `:root` (warm stone, soft borders).
5. **Dark:** stone surfaces + `[data-accent="stone|cyan|orange|violet"]` primary/ring overrides.

## Implementation checklist

When setting up or extending themes:

- [ ] `frontend/src/styles/themes.css` — `:root` (paper), `.dark` (base), `.dark[data-accent="…"]` (four accents)
- [ ] `globals.css` imports themes; `@tailwind` layers unchanged
- [ ] `ThemeProvider` sets `classList` (`dark`) and `data-accent` on `document.documentElement`
- [ ] Persist mode + accent to `localStorage`; respect `prefers-color-scheme` only if user has not chosen (optional; default dark is fine for DevOS)
- [ ] `theme-toggle.tsx` — mode switch + accent picker (shadcn components)
- [ ] After shadcn init, verify Button/Card/Input in each accent in dark + paper light

## shadcn theming pattern

Variables are `H S% L%` values consumed as `hsl(var(--primary))`.

```css
.dark[data-accent="cyan"] {
  --primary: 189 94% 43%;
  --primary-foreground: 183 100% 96%;
  --ring: 189 94% 43%;
}
```

Use [shadcn theming docs](https://ui.shadcn.com/docs/theming) for required variable set (`background`, `foreground`, `card`, `popover`, `muted`, `border`, `input`, `destructive`, etc.).

## ThemeProvider sketch

```tsx
// Apply: html.classList.toggle("dark", mode === "dark")
// Apply: html.dataset.accent = accent
```

Provider wraps the app in `main.tsx`; expose `useTheme()` for toggle component.

## When building screens

- Layout: `bg-background text-foreground`
- Panels: `bg-card border border-border`
- Secondary text: `text-muted-foreground`
- Primary actions: default `Button` (uses `--primary`)

## Do not

- Add MUI, Chakra, or parallel design systems
- Add per-page color schemes
- Generate one-off gradients in features unless added to the theme doc first

## Related

- [docs/frontend-architecture.md](../../../docs/frontend-architecture.md)
- [.cursor/rules/devos-frontend.mdc](../../rules/devos-frontend.mdc)
