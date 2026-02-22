FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./

# Copy packages
COPY packages/domain/package.json packages/domain/tsconfig.json ./packages/domain/
COPY packages/domain/src ./packages/domain/src

# Copy api package
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/
COPY apps/api/src ./apps/api/src

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build domain first, then api
RUN pnpm --filter @donasaurs/domain build
RUN pnpm --filter @donasaurs/api build

# ── Production stage ──
FROM node:20-slim AS runner
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY --from=base /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=base /app/packages/domain/package.json ./packages/domain/
COPY --from=base /app/packages/domain/dist ./packages/domain/dist
COPY --from=base /app/apps/api/package.json ./apps/api/
COPY --from=base /app/apps/api/dist ./apps/api/dist

RUN pnpm install --frozen-lockfile --prod

EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "apps/api/dist/server.js"]
