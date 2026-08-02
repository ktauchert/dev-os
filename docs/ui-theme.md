# UI theme

DevOS uses **shadcn/ui** components as-is. Customization is **semantic color tokens** only: light/dark mode plus selectable **accent** themes. No one-off hex colors in feature code.

## Principles

- Use Tailwind semantic classes: `bg-background`, `text-foreground`, `bg-primary`, `border-border`, `bg-muted`, `text-muted-foreground`, `ring-ring`, etc.
- **Default experience:** dark mode (primary audience: developers).
- **Light mode:** soft **paper** — warm off-white, low glare, stone-tinted borders (not pure white).
- **Dark accents:** shared stone-based surfaces; accent changes **primary**, **ring**, and focus/chart highlights toward **stone** (neutral), **cyan**, **orange**, or **violet** (Tailwind palette family).

## Modes and accents

| Control | Values | Default |
| --- | --- | --- |
| Mode | `light` · `dark` | `dark` |
| Accent | `stone` · `cyan` · `orange` · `violet` | `stone` |

Persist both in `localStorage` (e.g. `devos-theme-mode`, `devos-theme-accent`). Apply on `<html>`:

- Mode: class `dark` when mode is dark (match [shadcn theming](https://ui.shadcn.com/docs/theming)).
- Accent: `data-accent="cyan"` (etc.) for dark; light paper theme uses one shared `:root` palette (accent may still tint primary slightly if desired—keep paper backgrounds unchanged).

## Paper light (`:root`, no `.dark`)

Warm, readable, “notebook” feel:

| Token | Direction |
| --- | --- |
| `--background` | stone-50 / warm 40 20% 98% |
| `--foreground` | stone-800 |
| `--card` | stone-50 or slightly lighter than background |
| `--muted` | stone-100 |
| `--muted-foreground` | stone-500 |
| `--border` | stone-200 |
| `--input` | stone-200 |
| `--primary` | stone-800 (neutral) or current accent-600 for buttons |
| `--primary-foreground` | stone-50 |

Avoid `#ffffff` full-screen backgrounds.

## Dark base (all accents)

Shared `.dark` surfaces (stone family):

| Token | Direction |
| --- | --- |
| `--background` | stone-950 |
| `--foreground` | stone-50 |
| `--card` | stone-900 |
| `--card-foreground` | stone-50 |
| `--muted` | stone-800 |
| `--muted-foreground` | stone-400 |
| `--border` | stone-800 |
| `--input` | stone-800 |
| `--secondary` | stone-800 |
| `--destructive` | red-500 family (shadcn default pattern) |

## Dark accent overrides

Under `.dark[data-accent="…"]`, set at minimum `--primary`, `--primary-foreground`, `--ring`, and optionally `--accent` / chart vars. Use Tailwind-equivalent HSL (shadcn stores `H S% L%` without `hsl()`).

| Accent | Primary (approx.) | Notes |
| --- | --- | --- |
| **stone** | stone-200 on stone-900 | Monochrome; primary reads as soft gray button |
| **cyan** | cyan-500 / cyan-400 foreground on cyan-950 | Links, CTAs, focus rings |
| **orange** | orange-500 | Warm highlights |
| **violet** | violet-500 | Cool highlights |

**stone** dark example: `--primary: 60 4.8% 83.9%` (stone-200), `--primary-foreground: 24 9.8% 10%` (stone-900).

**cyan** dark example: `--primary: 189 94% 43%`, `--primary-foreground: 183 100% 96%`.

**orange** dark: `--primary: 24.6 95% 53.1%`, `--primary-foreground: 60 9.1% 97.8%`.

**violet** dark: `--primary: 262.1 83.3% 57.8%`, `--primary-foreground: 210 20% 98%`.

Keep `--background` / `--card` on stone for every accent so themes feel cohesive, not four different apps.

## File layout (frontend)

```text
frontend/src/
├── styles/
│   ├── globals.css       # tailwind layers + imports
│   └── themes.css        # :root, .dark, [data-accent] variables
├── components/
│   ├── ui/               # shadcn primitives
│   └── theme-provider.tsx
│   └── theme-toggle.tsx  # mode + accent picker (uses shadcn DropdownMenu/Toggle)
```

Install shadcn with CSS variables theme. Wire `ThemeProvider` at app root.

## UI for switching

- **Mode:** sun/moon toggle (light paper ↔ dark).
- **Accent:** only shown or emphasized in dark mode; optional in light.
- Use shadcn `Button`, `DropdownMenu`, `ToggleGroup` — no custom unstyled controls.

## Accessibility

- Maintain contrast for `foreground` on `background` and `primary-foreground` on `primary` (WCAG AA for body text where possible).
- Visible `ring` on focus for keyboard users.

## Agent / skill

Implementation details and checklist: project skill `.cursor/skills/devos-ui-theme/SKILL.md`.
