<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| Runtime | React | 19 |
| Styles | Tailwind CSS | 4 |
| Package manager | pnpm | 11 |
| Deployment | Railway (Dockerfile, standalone) | — |
| Language | TypeScript | 5 |
| Persistence | Optional (see `GuideLines.md`) | — |

## Key files

| File | Purpose |
|---|---|
| `app/` | Next.js App Router routes and pages |
| `next.config.ts` | Next.js config (`output: "standalone"` for Docker) |
| `Dockerfile` | Multi-stage build for Railway |
| `railway.json` | Railway deployment config |
| `.env.example` | Environment variable template |
| `GuideLines.md` | Architecture guidelines and data persistence guide |

## Common commands

```bash
pnpm dev              # Start development server
pnpm build            # Next.js standalone production build
pnpm lint             # Run ESLint checks
```

## Data Persistence & ORM

By default, this template has no database layer to stay lightweight and fast to build.
If the project requires a database, refer to [`GuideLines.md`](GuideLines.md) for instructions on setting up PostgreSQL and Prisma ORM.
