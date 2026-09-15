# ─── Stage 1: deps ───────────────────────────────────────────────────────────
# Install only production deps (no devDeps) using the lockfile.
FROM node:22-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install ALL deps (including dev) so we can build
RUN pnpm install --frozen-lockfile

# ─── Stage 2: builder ─────────────────────────────────────────────────────────
# Generate the Prisma contract and build the Next.js app.
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# DATABASE_URL must be set at build time only if prisma contract emit needs it.
# For Railway, pass it as a build arg or set it in the Railway dashboard.
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Emit contract types + build Next.js (output: standalone)
RUN pnpm run build

# ─── Stage 3: runner ──────────────────────────────────────────────────────────
# Minimal production image using the standalone output.
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy only the standalone bundle + static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma runtime files needed at startup
COPY --from=builder --chown=nextjs:nodejs /app/src/prisma ./src/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run DB migrations, then start the server
CMD ["node", "server.js"]
