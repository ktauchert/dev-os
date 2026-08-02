# Frontend Architecture (React + TypeScript)

## Directory Structure
```text
src/
├── assets/          # Static assets & images
├── components/      # Reusable UI components (buttons, modals, cards)
│   └── ui/          # Primitives (Shadcn UI / Tailwind)
├── features/        # Feature-driven modules
│   ├── auth/        # Auth state, login/signup forms, Cognito hooks
│   ├── projects/    # Project dashboard, creation form, settings
│   ├── work/        # Epics, features, tasks, Kanban board logic
│   ├── sdlc/        # SDLC stage visualization & status updates
│   └── ai/          # AI companion drawer, prompt interfaces
├── hooks/           # Shared custom React hooks
├── lib/             # Third-party configuration (Axios/Fetch, API clients)
├── routes/          # Application routing (Protected & Public routes)
├── styles/          # globals.css, themes.css (see ui-theme.md)
├── types/           # Global TypeScript interfaces & domain types
└── utils/           # Helper functions & formatters
```

Theming (shadcn CSS variables, light/dark, accents): [ui-theme.md](./ui-theme.md).
