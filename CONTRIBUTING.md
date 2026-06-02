# Contributing to Motobites Admin

Thank you for helping improve the Motobites admin dashboard. This guide covers how to set up the project, follow our conventions, and submit changes.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) (recommended package manager for this repo)

## Getting started

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

2. Create a local environment file:

   ```bash
   # .env.local
   API_BASE_URL=https://your-api.example.com
   ```

   `API_BASE_URL` is the backend API origin (no trailing slash). When it is not set, the proxy route and server API calls fail; some features still use in-repo mock data where implemented.

3. Start the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The app redirects to `/login` by default.

## Project structure

```
src/
├── app/              # Next.js App Router (routes, layouts)
├── components/       # Shared UI and layout components
├── constants/        # App-wide constants (e.g. auth, API URL)
├── features/         # Feature modules (auth, order, restaurant, staff, …)
├── hooks/            # Shared React hooks
├── lib/              # Utilities (API client, query client, toast)
└── utils/            # Pure helper functions
```

Each feature under `src/features/<name>/` typically includes:

- `components/` — UI scoped to the feature
- `sections/` — Page-level compositions
- `queries/` — TanStack Query options and keys
- `hooks/` — Feature hooks
- `actions/` — Server actions (where used)
- `types.ts` — Feature types
- `index.ts` — Public exports

Prefer importing from the feature barrel (`@/features/order`) rather than deep paths when the export exists.

## Code style

- **TypeScript** — Strict typing; avoid `any` unless unavoidable.
- **Formatting** — Match existing files (indentation, imports, naming).
- **Icons** — Use `@/components/ui/icons` (`Icon`, `Icons`). Do not import from `lucide-react` directly (enforced by ESLint).
- **UI primitives** — Use existing components under `@/components/ui` (shadcn-style) before adding new primitives.
- **Scope** — Keep changes focused; avoid unrelated refactors in the same PR.

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start dev server (Turbopack)   |
| `pnpm build`      | Production build               |
| `pnpm start`      | Run production server          |
| `pnpm lint`       | Run ESLint                     |
| `pnpm typecheck`  | Run TypeScript (`tsc --noEmit`)|

Run lint and typecheck before opening a pull request:

```bash
pnpm lint
pnpm typecheck
```

## Git hooks

This repo uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged). On commit, staged `*.{js,jsx,ts,tsx,mjs}` files are auto-fixed with ESLint.

Do not skip hooks (`--no-verify`) unless a maintainer explicitly asks you to.

## Pull requests

1. Branch from the default branch with a clear name (e.g. `feat/staff-export`, `fix/login-validation`).
2. Write a concise PR description: **what** changed and **why**.
3. Include a short test plan (steps you used to verify the change).
4. Ensure CI checks pass (lint, typecheck, build if applicable).
5. Request review from a code owner when ready.

## Adding a feature

1. Add routes under `src/app/(dashboard)/` or `src/app/(auth)/` as needed.
2. Implement logic in `src/features/<feature-name>/`.
3. Wire navigation in `src/components/layouts/dashboard/app-sidebar.tsx` if the page is part of the dashboard.
4. Use TanStack Query for server/async state; use server actions for mutations that set cookies or need server-only APIs.
5. Add or extend mock data under `features/<name>/data/` when the backend is not available yet.

## Environment variables

| Variable   | Description                                      |
| ---------- | ------------------------------------------------ |
| `API_URL`  | Backend API base URL (see `src/constants/app.ts`)|

## Questions

If something is unclear, open an issue or ask in your PR. When in doubt, follow patterns already used in `auth`, `order`, `restaurant`, or `staff` features.
