# REST API v1

Base URL: `http://localhost:4000/api/v1` in development. JSON request/response. Success envelope: `{ "success": true, "data": ..., "meta"?: ... }`; error envelope: `{ "success": false, "error": { "code": "...", "message": "...", "details"?: [...] }, "requestId"?: "..." }`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Liveness |
| GET | `/ready` | Public | PostgreSQL readiness and optional store status |
| POST | `/auth/register` | Public + rate limit | Create citizen account, set HttpOnly session cookie |
| POST | `/auth/login` | Public + rate limit | Authenticate, set HttpOnly session cookie |
| POST | `/auth/logout` | Public | Clear session cookie |
| GET | `/auth/me` | Session | Current signed-in identity |
| GET | `/bins?page=1&limit=50&q=` | Public | Paginated bins, optional query, 20s cache |
| GET | `/reports?page=1&limit=30` | Public | Paginated community reports |
| POST | `/reports` | Public, rate-limited globally | Submit validated citizen report |
| PATCH | `/reports/:id/status` | Operator/Admin | Change report state and write audit event |
| POST | `/routes/optimize` | Public | Priority-weighted nearest-neighbour route plan |
| POST | `/telemetry` | Operator/Admin | Ingest validated sensor level for an existing bin code |

## Validation and error behavior
- Registration requires name (2–80 chars), valid email and password (10–128 chars, letters and digits). Duplicate email returns 409.
- Report category must be one of the documented enum choices; area is 2–120 chars; description is 8–1000 chars; optional coordinates must be valid ranges.
- Bin pagination limits are 1–100; reports limit is 1–100. Unknown endpoints return 404.
- Unauthenticated protected requests return 401; insufficient roles return 403; validation failures return 400. Generic 500 messages omit internals.
- Cookies are HttpOnly and SameSite=Strict; `COOKIE_SECURE=true` is required over HTTPS. CORS accepts only `FRONTEND_URL`.

See `openapi.yaml` for the compact OpenAPI 3.1 contract. Any future endpoint change should update both this inventory and OpenAPI.
