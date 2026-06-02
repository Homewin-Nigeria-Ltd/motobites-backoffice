# Motobites Admin

Admin dashboard for Motobites, built with [Next.js](https://nextjs.org) (App Router), React, TanStack Query, and shadcn-style UI components.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure environment variables. Create `.env.local` in the project root (or copy from `.env`):

   ```bash
   API_BASE_URL=https://your-api.example.com
   ```

   | Variable        | Required | Description |
   | --------------- | -------- | ----------- |
   | `API_BASE_URL`  | Yes\*    | Base URL of the Motobites backend API (no trailing slash). Used for server-side requests (`apiServer`), the `/api/proxy` route, and features that call the API directly. |

   \*Without `API_BASE_URL`, the proxy route returns 500 and server-side auth/API calls will fail. Some list views still use mock data when the API is unavailable.

3. Start the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The app redirects to `/login` by default.

## Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start development server |
| `pnpm build`     | Production build         |
| `pnpm start`     | Run production server    |
| `pnpm lint`      | Run ESLint               |
| `pnpm typecheck` | Run TypeScript check     |

## API architecture

- **Server components / server actions** — Call the backend via `apiServer` at `{API_BASE_URL}/admin/...`.
- **Client components** — Call same-origin `/api/proxy/admin/...`, which forwards to `{API_BASE_URL}` with the auth cookie.

Set `API_BASE_URL` in `.env.local` for local development and in your deployment environment (e.g. Vercel project settings) for production.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for project structure, conventions, and pull request guidelines.
