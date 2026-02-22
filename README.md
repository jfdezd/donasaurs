# Donasaurs

C2C marketplace MVP with escrow-based order flow.

## Architecture

```
/apps
  /api      → Fastify backend (Node 20+, pg, Zod)
  /web      → Next.js 14 App Router (Supabase Auth, Tailwind)
/packages
  /domain   → Shared TypeScript types & enums
/supabase
  /migrations → Database schema
```

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Supabase project with Auth enabled

## Setup


### Windows (PowerShell) quick setup

If `pnpm` is not recognized in PowerShell, enable Corepack and activate pnpm:

```powershell
node -v
corepack enable
corepack prepare pnpm@9 --activate
pnpm -v
```

If `corepack` is not found, reinstall Node.js 20+ from the official installer, then restart PowerShell and run the commands above.

```bash
# Install dependencies
pnpm install

# Copy env files and fill in values
cp .env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### Environment Variables

#### Backend (`apps/api/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `SUPABASE_URL` | Supabase project URL (used for JWKS JWT validation) |
| `PORT` | Server port (default: 4000) |
| `HOST` | Server host (default: 0.0.0.0) |
| `CORS_ORIGIN` | Allowed CORS origin (default: http://localhost:3000) |

#### Frontend (`apps/web/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:4000) |


### Auth redirect troubleshooting (Supabase)

If email confirmation opens a wrong domain (for example an API URL), configure Supabase Auth URLs:

- **Authentication → URL Configuration → Site URL**: set to your web app URL (`http://localhost:3000` locally).
- **Redirect URLs**: add both local and production web URLs (for example `http://localhost:3000/auth`).

The web app also sends `emailRedirectTo` during sign-up so confirmation links return to `/auth` on the current web origin.

## Run

```bash
# Build shared domain package and start backend (auto-loads apps/api/.env, port 4000)
pnpm dev:api

# Start frontend (port 3000)
pnpm dev:web
```

## Build

```bash
pnpm build
```

## Order Flow

1. Seller creates listing with minimum price
2. Buyer reserves listing (atomic, prevents double-reserve)
3. Buyer pays escrow externally, confirms with reference
4. Seller marks as shipped
5. Buyer confirms delivery → order completes

Payments are **not** processed inside the app.

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Health check |
| GET | `/listings` | No | List all listings |
| GET | `/listings/:id` | No | Get listing detail |
| POST | `/listings` | Yes | Create listing |
| POST | `/orders/reserve` | Yes | Reserve listing & create order |
| POST | `/orders/:id/confirm-escrow` | Yes | Buyer confirms escrow payment |
| POST | `/orders/:id/ship` | Yes | Seller marks as shipped |
| POST | `/orders/:id/complete` | Yes | Buyer confirms delivery |
| GET | `/orders/mine` | Yes | List user's orders |
| GET | `/orders/:id` | Yes | Get order detail |

## Docker

```bash
docker build -f apps/api/Dockerfile -t donasaurs-api .
docker run -p 4000:4000 --env-file apps/api/.env donasaurs-api
```    
