# Local and production deployment

## Local
1. Copy `.env.example` to `.env`; set a random `SESSION_SECRET` of at least 32 characters.
2. `docker compose up -d` starts persistent PostgreSQL, MongoDB and Redis volumes.
3. `npm install`
4. `npm run db:migrate --workspace backend`
5. Optional: `npm run db:seed --workspace backend` inserts clearly illustrative demo bins.
6. `npm run dev`; frontend is on 5173 and API on 4000.

## Production checklist
- Use managed PostgreSQL with TLS, automated backups, point-in-time recovery and tested restore procedures. Apply Prisma migrations as a release step.
- Configure `DATABASE_URL`, `MONGODB_URI`, `REDIS_URL`, `SESSION_SECRET`, `FRONTEND_URL`, `COOKIE_SECURE=true`, and `NODE_ENV=production` in the secret manager; never bake secrets into images.
- Serve behind HTTPS and a reverse proxy with correctly configured `TRUST_PROXY`. Do not set trust proxy without understanding the actual proxy topology.
- Build frontend (`npm run build --workspace frontend`) and backend (`npm run build --workspace backend`) in CI. Deploy static assets behind a CDN and the API as a non-root container. Add resource limits and health probes.
- The starter uses process-local API rate limits; switch to a shared Redis-backed limiter before horizontal scaling. Review `KEYS` cache invalidation for scale.
- Add CSRF tokens/session rotation, email verification, password recovery, operator account provisioning, and security review before public production launch.
- Wire metrics/alerts for API latency, error rate, sensor freshness, overflow duration, DB pool saturation, Redis/Mongo health, and failed collection jobs. Pino logs are structured to stdout.
- Device integration requires authenticated gateway/device identity, signed telemetry or mTLS, replay protection, and a documented device schema; current `/telemetry` is an operator-authenticated API, not an open IoT ingestion endpoint.
- Configure map/GIS and routing provider credentials only server-side. Current route plan is coordinate-based and does not account for traffic, truck capacity, time windows, or one-way roads.
- Use a CDN/security policy and validate CSP before enabling strict CSP headers. Review retention and public-report privacy with the city.
