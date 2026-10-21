<<<<<<< HEAD
# smart-waste-management
=======
# Terra — Smart Waste Management

A responsive civic-tech platform concept for monitoring smart bins, reporting waste hotspots, and planning efficient collection routes. The repo is structured as a TypeScript React + Express modular monolith with PostgreSQL as the source of truth, MongoDB for flexible sensor/event payload archives, and Redis for cache/rate-limit counters.

## What is included
- Editorial, responsive dashboard and landing view with a procedural Three.js/R3F hero scene and reduced-motion/mobile fallback.
- Typed API client; bin list, sensor level display, report form, and route planning interface connect to `/api/v1` endpoints.
- Express API with Zod validation, helmet, CORS allowlist, request IDs, structured errors, health/readiness, rate limits, and PostgreSQL-backed bin/report data.
- Prisma schema and migration; MongoDB event archive adapter and Redis cache/rate-limit integration are optional at runtime and explicitly degrade for non-security features.
- OpenAPI and architecture/data model/deployment docs.

## Requirements
Node.js 20+, npm 10+, Docker Compose (for databases). The frontend can run without database services for visual development, but real data operations require PostgreSQL. MongoDB/Redis are optional adapters; when configured, they enrich telemetry archival and caching/rate limiting.

## Start locally
1. `cp .env.example .env` and replace `SESSION_SECRET` with a random secret.
2. `docker compose up -d`
3. `npm install`
4. `npm run db:migrate --workspace backend`
5. `npm run db:seed --workspace backend` (optional demo data; clearly marked demo records)
6. `npm run dev`

Frontend: http://localhost:5173 · API: http://localhost:4000/api/v1/health

## Commands
- `npm run build` — compile frontend and backend
- `npm run typecheck` — TypeScript checks
- `npm test` — unit/integration-oriented tests
- `npm run db:migrate --workspace backend` — apply Prisma migrations
- `npm run db:seed --workspace backend` — insert development-only seed records

## Important limitations
This is a production-oriented starter, not a deployed production service. Physical IoT devices, real municipal GIS/traffic data, mail/SMS delivery, and production identity provider credentials are not bundled. Route planning uses a deterministic nearest-neighbour heuristic over saved coordinates and is not a live traffic optimizer. Authentication uses signed, HttpOnly cookie sessions and must be configured with a strong secret; production deployment must enable HTTPS, secure cookies, CSRF origin checks, monitoring, backups, and review. No user accounts or sensor readings are fabricated as live data; seed records are explicitly demo fixtures.
>>>>>>> c35e82a (initial commit)
