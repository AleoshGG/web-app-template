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
| ORM | Prisma ORM (PSL, postgres adapter) | 8 RC |
| Database | PostgreSQL | ≥ 15 |
| Styles | Tailwind CSS | 4 |
| Package manager | pnpm | 11 |
| Deployment | Railway (Dockerfile, standalone) | — |
| Language | TypeScript | 5 |

## Key files

| File | Purpose |
|---|---|
| `src/prisma/contract.prisma` | Data schema — edit models here |
| `src/prisma/db.ts` | Typed Prisma client (`import { db }`) |
| `prisma.config.ts` | Prisma CLI config (schema path, `DATABASE_URL`) |
| `next.config.ts` | Next.js config (`output: "standalone"` for Docker) |
| `Dockerfile` | Multi-stage build for Railway |
| `railway.json` | Railway deployment config |
| `.env.example` | Environment variable template |

## Common commands

```bash
pnpm dev              # Start development server
pnpm build            # Emit Prisma contract + Next.js build
pnpm contract:emit    # Regenerate contract.json and contract.d.ts after schema changes
pnpm db:push          # Create / sync tables in the DB (dev)
pnpm db:migrate       # Apply migrations (production)
```

## Prisma ORM 8 conventions

- **Do not** use `@prisma/client` directly — the client is instantiated in `src/prisma/db.ts` via `@prisma/orm-postgres`.
- After editing `contract.prisma`, always run `pnpm contract:emit` to regenerate types.
- Query pattern: `db.orm.public.<Model>.<method>()`.
- See `prisma-8.md` at the repo root for a full API quick reference.
